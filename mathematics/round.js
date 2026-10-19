export function round(value){
    return Math.round(value);
}

export function truncate(value){
    return Math.trunc(value);
}

export function floor(value){
    return Math.floor(value);
}

export function roundTo(value, decimalPlaces){
    let x = Math.pow(10, decimalPlaces);
    return Math.round(value * x) / x;
}

export function ceiling(value){
    return Math.ceil(value);
}