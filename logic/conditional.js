export function ifTrue(condition, trueValue, falseValue){
    if(typeof condition !== "boolean"){
        throw new Error("condition must be a boolean");
    }

    if(condition){
        return trueValue;
    }

    return falseValue;
}

export function coalesce(a, b){
    if(a == null){
        return b;
    }

    return a;
}

export function firstNotNull(array){
    for(let x of array){
        if(x !== null){
            return x;
        }
    }

    throw new Error(
        "array contains no non-null values"
    );
}

export function allNotNull(array){
    for(let x of array){
        if(x === null){
            return false;
        }
    }

    return true;
}

export function anyNull(array){
    for(let x of array){
        if(x === null){
            return true;
        }
    }

    return false;
}

export function noneNull(array){
    for(let x of array){
        if(x === null){
            return false;
        }
    }

    return true;
}