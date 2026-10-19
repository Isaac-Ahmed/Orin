export function length(value){
    return value.length;
}

export function upper(value){
    return value.toUpperCase();
}

export function lower(value){
    return value.toLowerCase();
}

export function trim(value){
    return value.trim();
}

export function trimStart(value){
    return value.trimStart();
}

export function trimEnd(value){
    return value.trimEnd();
}

export function contains(value, search){
    return value.includes(search);
}

export function startsWith(value, search){
    return value.startsWith(search);
}

export function endsWith(value, search){
    return value.endsWith(search);
}

export function replace(value, search, replacement){
    return value.replace(search, replacement);
}

export function replaceAll(value, search, replacement){
    return value.replaceAll(search, replacement);
}

export function substring(value, start, end){
    return value.substring(start, end);
}

export function charAt(value, index){
    return value.charAt(index);
}

export function indexOf(value, search){
    return value.indexOf(search);
}

export function lastIndexOf(value, search){
    return value.lastIndexOf(search);
}

export function repeat(value, count){
    return value.repeat(count);
}