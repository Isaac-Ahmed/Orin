export function isInteger(value){
    return Number.isSafeInteger(value);
}

export function isDouble(value){
    return typeof value === "number" && Number.isFinite(value) && !Number.isSafeInteger(value);
}

export function isString(value){
    return typeof value === "string";
}

export function isNumber(value){
    return typeof value === "number" && Number.isFinite(value);
}

export function isBoolean(value){
    return typeof value === "boolean";
}

export function isChar(value){
    return typeof value === "string" && [...value].length === 1;
}

export function isArray(value){
    return Array.isArray(value);
}

export function isNull(value){
    return value === null;
}