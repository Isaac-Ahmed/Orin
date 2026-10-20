import {
    evaluateFunction
} from "./functions.js";


function validateExpression(expression){
    if(
        typeof expression !== "object" ||
        expression === null
    ){
        throw new Error(
            "invalid expression"
        );
    }

    if(
        expression.__orinExpression !==
        true
    ){
        throw new Error(
            "invalid expression"
        );
    }

    if(
        typeof expression.root !==
            "object" ||
        expression.root === null
    ){
        throw new Error(
            "invalid expression"
        );
    }
}


function evaluateNode(node, x){
    if(
        node.type ===
        "constant"
    ){
        return node.value;
    }

    if(
        node.type ===
        "variable"
    ){
        return x;
    }

    if(
        node.type ===
        "negative"
    ){
        return -evaluateNode(
            node.value,
            x
        );
    }

    if(
        node.type ===
        "absolute"
    ){
        return Math.abs(
            evaluateNode(
                node.value,
                x
            )
        );
    }

    if(
        node.type ===
        "add"
    ){
        return (
            evaluateNode(
                node.left,
                x
            ) +
            evaluateNode(
                node.right,
                x
            )
        );
    }

    if(
        node.type ===
        "subtract"
    ){
        return (
            evaluateNode(
                node.left,
                x
            ) -
            evaluateNode(
                node.right,
                x
            )
        );
    }

    if(
        node.type ===
        "multiply"
    ){
        return (
            evaluateNode(
                node.left,
                x
            ) *
            evaluateNode(
                node.right,
                x
            )
        );
    }

    if(
        node.type ===
        "divide"
    ){
        return (
            evaluateNode(
                node.left,
                x
            ) /
            evaluateNode(
                node.right,
                x
            )
        );
    }

    if(
        node.type ===
        "power"
    ){
        return Math.pow(
            evaluateNode(
                node.left,
                x
            ),

            evaluateNode(
                node.right,
                x
            )
        );
    }

    if(
        node.type ===
        "call"
    ){
        const values =
            node.arguments.map(
                argument =>
                    evaluateNode(
                        argument,
                        x
                    )
            );

        return evaluateFunction(
            node.displayName ||
                node.name,
            values
        );
    }

    throw new Error(
        `unknown expression node '${node.type}'`
    );
}


export function evaluate(
    expression,
    x
){
    validateExpression(
        expression
    );

    if(
        typeof x !== "number" ||
        !Number.isFinite(x)
    ){
        throw new Error(
            "x must be a number"
        );
    }

    return evaluateNode(
        expression.root,
        x
    );
}


export function isDefined(
    expression,
    x
){
    validateExpression(
        expression
    );

    if(
        typeof x !== "number" ||
        !Number.isFinite(x)
    ){
        throw new Error(
            "x must be a number"
        );
    }

    let value =
        evaluateNode(
            expression.root,
            x
        );

    return Number.isFinite(
        value
    );
}