export function and(a, b){
    if(!(typeof a === "boolean") || !(typeof b === "boolean")){
        throw new Error("values must be booleans");
    }
    return a && b;
}

export function or(a, b){
    if(!(typeof a === "boolean") || !(typeof b === "boolean")){
        throw new Error("values must be booleans");
    }
    return a || b;
}

export function nor(a, b){
    if(!(typeof a === "boolean") || !(typeof b === "boolean")){
        throw new Error("values must be booleans");
    }
    return !(a || b);
}

export function xor(a, b){
    if(!(typeof a === "boolean") || !(typeof b === "boolean")){
        throw new Error("values must be booleans");
    }
    let output = false;
    if(a || b){output = true;}
    if(a && b){output = false;}
    return output;
}

export function nand(a, b){
    if(!(typeof a === "boolean") || !(typeof b === "boolean")){
        throw new Error("values must be booleans");
    }
    return !(a && b);
}

export function xnor(a, b){
    return !xor(a, b);
}