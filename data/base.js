export function toBinary(value){
    if(!Number.isSafeInteger(value) || value < 0){throw new Error("value must be a non-negative integer");}
    return value.toString(2);
}

export function toOctal(value){
    if(!Number.isSafeInteger(value) || value < 0){throw new Error("value must be a non-negative integer");}
    return value.toString(8);
}

export function toHex(value){
    if(!Number.isSafeInteger(value) || value < 0){throw new Error("value must be a non-negative integer");}
    return value.toString(16).toUpperCase();
}

export function fromBinary(value){
    if(typeof value !== "string"){throw new Error("value must be a string");}
    if(value.length === 0){throw new Error("value cannot be empty");}

    for(let character of value){
        if(character !== "0" && character !== "1"){throw new Error("value must contain only binary digits");}
    }

    return parseInt(value, 2);
}

export function fromOctal(value){
    if(typeof value !== "string"){throw new Error("value must be a string");}
    if(value.length === 0){throw new Error("value cannot be empty");}

    for(let character of value){
        if(character < "0" || character > "7"){throw new Error("value must contain only octal digits");}
    }

    return parseInt(value, 8);
}

export function fromHex(value){
    if(typeof value !== "string"){throw new Error("value must be a string");}
    if(value.length === 0){throw new Error("value cannot be empty");}

    let upperValue = value.toUpperCase();
    let validCharacters = "0123456789ABCDEF";

    for(let character of upperValue){
        if(!validCharacters.includes(character)){throw new Error("value must contain only hexadecimal digits");}
    }

    return parseInt(upperValue, 16);
}

export function convertBase(value, fromBase, toBase){
    if(typeof value !== "string"){throw new Error("value must be a string");}
    if(value.length === 0){throw new Error("value cannot be empty");}
    if(!Number.isSafeInteger(fromBase) || fromBase < 2 || fromBase > 36){throw new Error("fromBase must be an integer between 2 and 36");}
    if(!Number.isSafeInteger(toBase) || toBase < 2 || toBase > 36){throw new Error("toBase must be an integer between 2 and 36");}

    let upperValue = value.toUpperCase();
    let characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(let character of upperValue){
        let digit = characters.indexOf(character);
        if(digit === -1 || digit >= fromBase){throw new Error("value contains a digit that is invalid for fromBase");}
    }

    let decimalValue = parseInt(upperValue, fromBase);

    if(!Number.isSafeInteger(decimalValue)){throw new Error("converted value is outside the safe integer range");}

    return decimalValue.toString(toBase).toUpperCase();
}