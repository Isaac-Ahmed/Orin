function isDigit(char){
    return char >= "0" && char <= "9";
}

function isLetter(char){
    return (
        (char >= "a" && char <= "z") ||
        (char >= "A" && char <= "Z")
    );
}

function tokenise(value){
    let tokens = [];
    let i = 0;

    while(i < value.length){
        let char = value[i];

        if(/\s/.test(char)){
            i++;
            continue;
        }

        if(isDigit(char) || char === "."){
            let number = "";
            let decimals = 0;

            while(i < value.length && (isDigit(value[i]) || value[i] === ".")){
                if(value[i] === "."){decimals++;}
                if(decimals > 1){throw new Error("invalid number");}

                number += value[i];
                i++;
            }

            let parsed = Number(number);

            if(!Number.isFinite(parsed)){throw new Error("invalid number");}

            tokens.push({
                type: "number",
                value: parsed
            });

            continue;
        }

        if(isLetter(char)){
            let name = "";

            while(i < value.length && (isLetter(value[i]) || isDigit(value[i]))){
                name += value[i];
                i++;
            }

            tokens.push({
                type: "identifier",
                value: name
            });

            continue;
        }

        if("+-*/^()".includes(char)){
            tokens.push({
                type: char,
                value: char
            });

            i++;
            continue;
        }

        throw new Error(`invalid character '${char}'`);
    }

    return addImplicitMultiplication(tokens);
}

function canEndValue(token){
    return (
        token &&
        (
            token.type === "number" ||
            token.type === "identifier" ||
            token.type === ")"
        )
    );
}

function canStartValue(token){
    return (
        token &&
        (
            token.type === "number" ||
            token.type === "identifier" ||
            token.type === "("
        )
    );
}

function isFunctionIdentifier(token){
    if(!token || token.type !== "identifier"){return false;}

    let name = token.value.toLowerCase();

    return (
        name === "ln" ||
        name === "log" ||
        name === "sin" ||
        name === "cos" ||
        name === "tan" ||
        name === "sqrt" ||
        name === "abs" ||
        name === "exp" ||
        /^log\d+(?:\.\d+)?$/.test(name)
    );
}

function addImplicitMultiplication(tokens){
    let output = [];

    for(let i = 0; i < tokens.length; i++){
        let current = tokens[i];
        let next = tokens[i + 1];

        output.push(current);

        if(!next){continue;}
        if(!canEndValue(current) || !canStartValue(next)){continue;}

        if(
            current.type === "identifier" &&
            isFunctionIdentifier(current) &&
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
        return tokens[position] || null;
    }

    function consume(type){
        let token = current();

        if(!token || token.type !== type){
            throw new Error(`expected '${type}'`);
        }

        position++;

        return token;
    }

    function parseExpression(){
        return parseAddSubtract();
    }

    function parseAddSubtract(){
        let node = parseMultiplyDivide();

        while(current() && (current().type === "+" || current().type === "-")){
            let operator = current().type;
            position++;

            let right = parseMultiplyDivide();

            node = {
                type: operator === "+" ? "add" : "subtract",
                left: node,
                right: right
            };
        }

        return node;
    }

    function parseMultiplyDivide(){
        let node = parsePower();

        while(current() && (current().type === "*" || current().type === "/")){
            let operator = current().type;
            position++;

            let right = parsePower();

            node = {
                type: operator === "*" ? "multiply" : "divide",
                left: node,
                right: right
            };
        }

        return node;
    }

    function parsePower(){
        let node = parseUnary();

        if(current() && current().type === "^"){
            position++;

            let right = parsePower();

            node = {
                type: "power",
                left: node,
                right: right
            };
        }

        return node;
    }

    function parseUnary(){
        if(current() && current().type === "+"){
            position++;
            return parseUnary();
        }

        if(current() && current().type === "-"){
            position++;

            return {
                type: "negative",
                value: parseUnary()
            };
        }

        return parsePrimary();
    }

    function parsePrimary(){
        let token = current();

        if(!token){throw new Error("unexpected end of expression");}

        if(token.type === "number"){
            position++;

            return {
                type: "constant",
                value: token.value
            };
        }

        if(token.type === "identifier"){
            position++;

            let name = token.value.toLowerCase();

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

            if(isFunctionIdentifier(token)){
                consume("(");

                let value = parseExpression();

                consume(")");

                if(name.startsWith("log") && name !== "log"){
                    let base = Number(name.slice(3));

                    if(!Number.isFinite(base) || base <= 0 || base === 1){
                        throw new Error("invalid logarithm base");
                    }

                    return {
                        type: "log",
                        base: base,
                        value: value
                    };
                }

                return {
                    type: name,
                    value: value
                };
            }

            throw new Error(`unknown identifier '${token.value}'`);
        }

        if(token.type === "("){
            position++;

            let node = parseExpression();

            consume(")");

            return node;
        }

        throw new Error(`unexpected '${token.value}'`);
    }

    let root = parseExpression();

    if(position !== tokens.length){
        throw new Error(`unexpected '${tokens[position].value}'`);
    }

    return root;
}

function buildExpression(value){
    if(typeof value !== "string"){throw new Error("expression must be a string");}
    if(value.trim() === ""){throw new Error("expression cannot be empty");}

    let tokens = tokenise(value);
    let root = createParser(tokens);

    return {
        __orinExpression: true,
        source: value,
        root: root
    };
}

export function create(value){
    return buildExpression(value);
}

export function createExpression(value){
    return buildExpression(value);
}