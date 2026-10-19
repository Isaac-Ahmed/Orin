export function split(value, separator){
    return value.split(separator);
}

export function join(value, separator){
    return value.join(separator);
}

export function words(value){
    return value.split(" ");
}

export function lines(value){
    return value.split(/\r?\n|\r/);
}   