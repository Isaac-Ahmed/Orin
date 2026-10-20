import { createExpression } from "./create.js";

function validateExpression(expression){
    if(typeof expression !== "object" || expression === null){throw new Error("invalid expression");}
    if(expression.__orinExpression !== true){throw new Error("invalid expression");}
    if(typeof expression.root !== "object" || expression.root === null){throw new Error("invalid expression");}
}

function getRoot(value){
    if(typeof value === "string"){
        return createExpression(value).root;
    }

    validateExpression(value);

    return value.root;
}

function updateSource(expression){
    expression.source = null;

    return expression;
}

export function add(expression, value){
    validateExpression(expression);

    expression.root = {
        type: "add",
        left: expression.root,
        right: getRoot(value)
    };

    return updateSource(expression);
}

export function remove(expression, value){
    validateExpression(expression);

    expression.root = {
        type: "subtract",
        left: expression.root,
        right: getRoot(value)
    };

    return updateSource(expression);
}

export function multiply(expression, value){
    validateExpression(expression);

    expression.root = {
        type: "multiply",
        left: expression.root,
        right: getRoot(value)
    };

    return updateSource(expression);
}

export function divide(expression, value){
    validateExpression(expression);

    expression.root = {
        type: "divide",
        left: expression.root,
        right: getRoot(value)
    };

    return updateSource(expression);
}

export function power(expression, value){
    validateExpression(expression);

    expression.root = {
        type: "power",
        left: expression.root,
        right: getRoot(value)
    };

    return updateSource(expression);
}

export function negate(expression){
    validateExpression(expression);

    expression.root = {
        type: "negative",
        value: expression.root
    };

    return updateSource(expression);
}