export function capitalize(value){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    if(value.length === 0){
        return "";
    }

    return value[0].toUpperCase() + value.slice(1);
}

export function titleCase(value){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    if(value.length === 0){
        return "";
    }

    let words = value.split(" ");
    let output = [];

    for(let word of words){
        if(word.length === 0){
            continue;
        }

        output.push(capitalize(word));
    }

    return output.join(" ");
}

export function reverse(value){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    let output = "";

    for(let i = value.length - 1; i >= 0; i--){
        output += value[i];
    }

    return output;
}

export function padStart(value, padding, times){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    if(typeof padding !== "string"){
        throw new Error("padding needs to be a string");
    }

    validateTimes(times);

    let output = "";

    for(let i = 0; i < times; i++){
        output += padding;
    }

    output += value;

    return output;
}

export function padEnd(value, padding, times){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    if(typeof padding !== "string"){
        throw new Error("padding needs to be a string");
    }

    validateTimes(times);

    let output = value;

    for(let i = 0; i < times; i++){
        output += padding;
    }

    return output;
}

export function center(value, padding, times){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    if(typeof padding !== "string"){
        throw new Error("padding needs to be a string");
    }

    validateTimes(times);

    let output = "";

    let leftPadding = Math.floor(times / 2);
    let rightPadding = Math.ceil(times / 2);

    for(let i = 0; i < leftPadding; i++){
        output += padding;
    }

    output += value;

    for(let i = 0; i < rightPadding; i++){
        output += padding;
    }

    return output;
}

export function repeatText(value, times){
    if(typeof value !== "string"){
        throw new Error("value needs to be a string");
    }

    validateTimes(times);

    let output = "";

    for(let i = 0; i < times; i++){
        output += value;
    }

    return output;
}

function validateTimes(times){
    if(typeof times !== "number"){
        throw new Error("times needs to be an integer");
    }

    if(!Number.isInteger(times)){
        throw new Error("times needs to be an integer");
    }

    if(times < 0){
        throw new Error("times cannot be negative");
    }
}