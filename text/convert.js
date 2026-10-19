export function toInteger(value){
    let attempt = Number(value);
    if(Number.isNaN(attempt)){
        throw new Error("value must be an integer"); 
    }
    if(Math.floor(attempt) != attempt){
        throw new Error("value must be an integer");
    }
    return attempt;
}

export function toDouble(value){
    let attempt = Number(value);
    if(Number.isNaN(attempt)){
        throw new Error("value must be an double"); 
    }
    return attempt;
}

export function toBoolean(value){
    try{
        value = value.toLowerCase();
        if(value == "true"){return true;}
        if(value == "false"){return false;}
        throw new Error("value must either be true or false");
    }
    catch{
        throw new Error("value must either be true or false");
    }
}

export function toChar(value){
    if(value.length == 1){return value;}
    throw new Error("value must be one character long");
}

export function toString(value){
    return String(value);
}