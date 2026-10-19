import {
    isBoolean,
    isDouble,
    isInteger,
    isString,
    isArray,
    isNull
} from "./validation.js";

export function typeOf(value){
    if(isInteger(value)){return "integer";}
    if(isDouble(value)){return "double";}
    if(isBoolean(value)){return "boolean";}
    if(isString(value)){return "string";}
    if(isArray(value)){return "array";}
    if(isNull(value)){return "null";}
    return "unknown";
}

export function isEmpty(value){
    if(isString(value) && value.length === 0){
        return true;
    }

    if(isArray(value) && value.length === 0){
        return true;
    }

    return false;
}

export function sizeOf(value){
    if(isArray(value)){
        return value.length;
    }

    if(isString(value)){
        return value.length;
    }

    throw new Error(
        "value must be a string or array"
    );
}

export function sameType(a, b){
    return typeOf(a) === typeOf(b);
}