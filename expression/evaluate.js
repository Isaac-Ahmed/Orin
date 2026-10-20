function validateExpression(expression){
    if(typeof expression !== "object" || expression === null){throw new Error("invalid expression");}
    if(expression.__orinExpression !== true){throw new Error("invalid expression");}
    if(typeof expression.root !== "object" || expression.root === null){throw new Error("invalid expression");}
}

function evaluateNode(node, x){
    if(node.type === "constant"){
        return node.value;
    }

    if(node.type === "variable"){
        return x;
    }

    if(node.type === "negative"){
        return -evaluateNode(node.value, x);
    }

    if(node.type === "add"){
        return evaluateNode(node.left, x) + evaluateNode(node.right, x);
    }

    if(node.type === "subtract"){
        return evaluateNode(node.left, x) - evaluateNode(node.right, x);
    }

    if(node.type === "multiply"){
        return evaluateNode(node.left, x) * evaluateNode(node.right, x);
    }

    if(node.type === "divide"){
        return evaluateNode(node.left, x) / evaluateNode(node.right, x);
    }

    if(node.type === "power"){
        return Math.pow(
            evaluateNode(node.left, x),
            evaluateNode(node.right, x)
        );
    }

    if(node.type === "ln"){
        return Math.log(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "log"){
        let value = evaluateNode(node.value, x);

        return Math.log(value) / Math.log(node.base || 10);
    }

    if(node.type === "sin"){
        return Math.sin(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "cos"){
        return Math.cos(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "tan"){
        return Math.tan(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "sqrt"){
        return Math.sqrt(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "abs"){
        return Math.abs(
            evaluateNode(node.value, x)
        );
    }

    if(node.type === "exp"){
        return Math.exp(
            evaluateNode(node.value, x)
        );
    }

    throw new Error(`unknown expression node '${node.type}'`);
}

export function evaluate(expression, x){
    validateExpression(expression);

    if(typeof x !== "number" || !Number.isFinite(x)){throw new Error("x must be a number");}

    return evaluateNode(expression.root, x);
}

export function isDefined(expression, x){
    validateExpression(expression);

    if(typeof x !== "number" || !Number.isFinite(x)){throw new Error("x must be a number");}

    let value = evaluateNode(expression.root, x);

    return Number.isFinite(value);
}