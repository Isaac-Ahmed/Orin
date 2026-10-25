import {
    getFunctionDefinition,
    isSupportedFunction
} from "./functions.js";


function isDigit(char){
    return (
        char >= "0" &&
        char <= "9"
    );
}


function isLetter(char){
    return (
        (
            char >= "a" &&
            char <= "z"
        ) ||
        (
            char >= "A" &&
            char <= "Z"
        )
    );
}


function canEndValue(token){
    return (
        token &&
        (
            token.type === "number" ||
            token.type === "identifier" ||
            token.type === ")" ||
            token.type === "absoluteClose"
        )
    );
}


function canStartValue(token){
    return (
        token &&
        (
            token.type === "number" ||
            token.type === "identifier" ||
            token.type === "(" ||
            token.type === "absoluteOpen"
        )
    );
}


function tokenise(value){
    let tokens = [];
    let i = 0;
    let absoluteDepth = 0;

    while(i < value.length){
        let char =
            value[i];

        if(/\s/.test(char)){
            i++;
            continue;
        }

        if(
            isDigit(char) ||
            char === "."
        ){
            let number = "";
            let decimals = 0;

            while(
                i < value.length &&
                (
                    isDigit(value[i]) ||
                    value[i] === "."
                )
            ){
                if(value[i] === "."){
                    decimals++;
                }

                if(decimals > 1){
                    throw new Error(
                        "invalid number"
                    );
                }

                number +=
                    value[i];

                i++;
            }

            let parsed =
                Number(number);

            if(!Number.isFinite(parsed)){
                throw new Error(
                    "invalid number"
                );
            }

            tokens.push({
                type: "number",
                value: parsed
            });

            continue;
        }

        if(isLetter(char)){
            let name = "";

            while(
                i < value.length &&
                (
                    isLetter(value[i]) ||
                    isDigit(value[i])
                )
            ){
                name +=
                    value[i];

                i++;
            }

            if(
                /^log\d+$/.test(
                    name.toLowerCase()
                ) &&
                value[i] === "." &&
                isDigit(
                    value[i + 1]
                )
            ){
                name += ".";
                i++;

                while(
                    i < value.length &&
                    isDigit(value[i])
                ){
                    name +=
                        value[i];

                    i++;
                }
            }

            tokens.push({
                type: "identifier",
                value: name
            });

            continue;
        }

        if(char === "|"){
            const previous =
                tokens[
                    tokens.length - 1
                ];

            if(
                absoluteDepth > 0 &&
                canEndValue(previous)
            ){
                tokens.push({
                    type: "absoluteClose",
                    value: "|"
                });

                absoluteDepth--;
            }
            else{
                tokens.push({
                    type: "absoluteOpen",
                    value: "|"
                });

                absoluteDepth++;
            }

            i++;
            continue;
        }

        if(
            "+-*/^(),".includes(
                char
            )
        ){
            tokens.push({
                type: char,
                value: char
            });

            i++;
            continue;
        }

        throw new Error(
            `invalid character '${char}'`
        );
    }

    if(absoluteDepth !== 0){
        throw new Error(
            "unclosed absolute value"
        );
    }

    return addImplicitMultiplication(
        tokens
    );
}


function isFunctionIdentifier(token){
    if(
        !token ||
        token.type !== "identifier"
    ){
        return false;
    }

    return isSupportedFunction(
        token.value
    );
}


function addImplicitMultiplication(tokens){
    let output = [];

    for(
        let i = 0;
        i < tokens.length;
        i++
    ){
        let current =
            tokens[i];

        let next =
            tokens[i + 1];

        output.push(
            current
        );

        if(!next){
            continue;
        }

        if(
            !canEndValue(current) ||
            !canStartValue(next)
        ){
            continue;
        }

        if(
            current.type ===
                "identifier" &&
            isFunctionIdentifier(
                current
            ) &&
            next.type === "("
        ){
            continue;
        }

        output.push({
            type: "*",
            value: "*"
        });
    }

    return output;
}


function createParser(tokens){
    let position = 0;


    function current(){
        return (
            tokens[position] ||
            null
        );
    }


    function consume(type){
        let token =
            current();

        if(
            !token ||
            token.type !== type
        ){
            throw new Error(
                `expected '${type}'`
            );
        }

        position++;

        return token;
    }


    function parseExpression(){
        return parseAddSubtract();
    }


    function parseAddSubtract(){
        let node =
            parseMultiplyDivide();

        while(
            current() &&
            (
                current().type === "+" ||
                current().type === "-"
            )
        ){
            let operator =
                current().type;

            position++;

            let right =
                parseMultiplyDivide();

            node = {
                type:
                    operator === "+"
                        ? "add"
                        : "subtract",

                left: node,
                right: right
            };
        }

        return node;
    }


    function parseMultiplyDivide(){
        let node =
            parseUnary();

        while(
            current() &&
            (
                current().type === "*" ||
                current().type === "/"
            )
        ){
            let operator =
                current().type;

            position++;

            let right =
                parseUnary();

            node = {
                type:
                    operator === "*"
                        ? "multiply"
                        : "divide",

                left: node,
                right: right
            };
        }

        return node;
    }


    function parseUnary(){
        if(
            current() &&
            current().type === "+"
        ){
            position++;

            return parseUnary();
        }

        if(
            current() &&
            current().type === "-"
        ){
            position++;

            return {
                type: "negative",
                value: parseUnary()
            };
        }

        return parsePower();
    }


    function parsePower(){
        let node =
            parsePrimary();

        if(
            current() &&
            current().type === "^"
        ){
            position++;

            let right =
                parseUnary();

            node = {
                type: "power",
                left: node,
                right: right
            };
        }

        return node;
    }


    function parseFunction(
        token
    ){
        const definition =
            getFunctionDefinition(
                token.value
            );

        if(!definition){
            throw new Error(
                `unknown identifier '${token.value}'`
            );
        }

        consume("(");

        const args = [];

        if(
            current() &&
            current().type !== ")"
        ){
            while(true){
                args.push(
                    parseExpression()
                );

                if(
                    !current() ||
                    current().type !== ","
                ){
                    break;
                }

                position++;
            }
        }

        consume(")");

        if(
            args.length !==
            definition.argumentCount
        ){
            throw new Error(
                `'${token.value}' expects ${definition.argumentCount} argument${definition.argumentCount === 1 ? "" : "s"}`
            );
        }

        return {
            type: "call",
            name:
                definition.name,

            displayName:
                definition.displayName,

            arguments:
                args
        };
    }


    function parsePrimary(){
        let token =
            current();

        if(!token){
            throw new Error(
                "unexpected end of expression"
            );
        }

        if(
            token.type ===
            "number"
        ){
            position++;

            return {
                type: "constant",
                value: token.value
            };
        }

        if(
            token.type ===
            "identifier"
        ){
            position++;

            let name =
                token.value.toLowerCase();

            if(name === "x"){
                return {
                    type: "variable"
                };
            }

            if(name === "e"){
                return {
                    type: "constant",
                    value: Math.E,
                    name: "e"
                };
            }

            if(
                isFunctionIdentifier(
                    token
                )
            ){
                return parseFunction(
                    token
                );
            }

            throw new Error(
                `unknown identifier '${token.value}'`
            );
        }

        if(token.type === "("){
            position++;

            let node =
                parseExpression();

            consume(")");

            return node;
        }

        if(
            token.type ===
            "absoluteOpen"
        ){
            position++;

            let node =
                parseExpression();

            consume(
                "absoluteClose"
            );

            return {
                type: "absolute",
                value: node
            };
        }

        throw new Error(
            `unexpected '${token.value}'`
        );
    }


    let root =
        parseExpression();

    if(
        position !==
        tokens.length
    ){
        throw new Error(
            `unexpected '${tokens[position].value}'`
        );
    }

    return root;
}


function buildExpression(value){
    if(typeof value !== "string"){
        throw new Error(
            "expression must be a string"
        );
    }

    if(value.trim() === ""){
        throw new Error(
            "expression cannot be empty"
        );
    }

    let tokens =
        tokenise(value);

    let root =
        createParser(tokens);

    return {
        __orinExpression: true,
        source: value,
        root: root
    };
}

export const __orinReturnTypes = {
    createExpression:
        "expression.create"
};


export function create(value){
    return buildExpression(
        value
    );
}


export function createExpression(value){
    return buildExpression(
        value
    );
}