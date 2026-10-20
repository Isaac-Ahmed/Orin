import {
    getSupportedSyntax as getSyntax
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


function nodeToString(node){
    if(
        node.type ===
        "constant"
    ){
        if(
            node.name === "e"
        ){
            return "e";
        }

        return String(
            node.value
        );
    }

    if(
        node.type ===
        "variable"
    ){
        return "x";
    }

    if(
        node.type ===
        "negative"
    ){
        return (
            "-(" +
            nodeToString(
                node.value
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "absolute"
    ){
        return (
            "|" +
            nodeToString(
                node.value
            ) +
            "|"
        );
    }

    if(
        node.type ===
        "add"
    ){
        return (
            "(" +
            nodeToString(
                node.left
            ) +
            "+" +
            nodeToString(
                node.right
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "subtract"
    ){
        return (
            "(" +
            nodeToString(
                node.left
            ) +
            "-" +
            nodeToString(
                node.right
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "multiply"
    ){
        return (
            "(" +
            nodeToString(
                node.left
            ) +
            "*" +
            nodeToString(
                node.right
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "divide"
    ){
        return (
            "(" +
            nodeToString(
                node.left
            ) +
            "/" +
            nodeToString(
                node.right
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "power"
    ){
        return (
            "(" +
            nodeToString(
                node.left
            ) +
            "^" +
            nodeToString(
                node.right
            ) +
            ")"
        );
    }

    if(
        node.type ===
        "call"
    ){
        const values =
            node.arguments.map(
                argument =>
                    nodeToString(
                        argument
                    )
            );

        return (
            (
                node.displayName ||
                node.name
            ) +
            "(" +
            values.join(", ") +
            ")"
        );
    }

    throw new Error(
        `unknown expression node '${node.type}'`
    );
}


function countNodes(node){
    if(
        node.type === "constant" ||
        node.type === "variable"
    ){
        return 1;
    }

    if(
        node.type === "negative" ||
        node.type === "absolute"
    ){
        return (
            1 +
            countNodes(
                node.value
            )
        );
    }

    if(
        node.type ===
        "call"
    ){
        let total = 1;

        for(
            const argument
            of node.arguments
        ){
            total +=
                countNodes(
                    argument
                );
        }

        return total;
    }

    return (
        1 +
        countNodes(
            node.left
        ) +
        countNodes(
            node.right
        )
    );
}


function getDepthValue(node){
    if(
        node.type === "constant" ||
        node.type === "variable"
    ){
        return 1;
    }

    if(
        node.type === "negative" ||
        node.type === "absolute"
    ){
        return (
            1 +
            getDepthValue(
                node.value
            )
        );
    }

    if(
        node.type ===
        "call"
    ){
        let maximum = 0;

        for(
            const argument
            of node.arguments
        ){
            maximum =
                Math.max(
                    maximum,
                    getDepthValue(
                        argument
                    )
                );
        }

        return (
            1 +
            maximum
        );
    }

    return (
        1 +
        Math.max(
            getDepthValue(
                node.left
            ),

            getDepthValue(
                node.right
            )
        )
    );
}


function collectTypes(
    node,
    output
){
    if(
        node.type ===
        "call"
    ){
        output.push(
            node.displayName ||
            node.name
        );

        for(
            const argument
            of node.arguments
        ){
            collectTypes(
                argument,
                output
            );
        }

        return;
    }

    output.push(
        node.type
    );

    if(
        node.value &&
        typeof node.value ===
            "object"
    ){
        collectTypes(
            node.value,
            output
        );
    }

    if(node.left){
        collectTypes(
            node.left,
            output
        );
    }

    if(node.right){
        collectTypes(
            node.right,
            output
        );
    }
}


export function toString(expression){
    validateExpression(
        expression
    );

    return nodeToString(
        expression.root
    );
}


export function getNodeCount(expression){
    validateExpression(
        expression
    );

    return countNodes(
        expression.root
    );
}


export function getDepth(expression){
    validateExpression(
        expression
    );

    return getDepthValue(
        expression.root
    );
}


export function getNodeTypes(expression){
    validateExpression(
        expression
    );

    let output = [];

    collectTypes(
        expression.root,
        output
    );

    return output;
}


export function getOriginal(expression){
    validateExpression(
        expression
    );

    return expression.source;
}


export function getSupportedSyntax(){
    return getSyntax();
}