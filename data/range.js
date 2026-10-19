import { isInteger } from "./validation.js";

export function range(end){
    if(!isInteger(end)){throw new Error("end value must be an integer");}
    let output = [];
    for(let i = 0; i < end; i++){
        output.push(i);
    }
    return output;
}

export function rangeBetween(start, end){
    if(!isInteger(end) || !isInteger(start)){throw new Error("start and end must be integers");}
    let output = [];
    for(let i = start; i < end; i++){
        output.push(i);
    }
    return output;
}

export function rangeStep(start, end, step){
    if(!isInteger(end) || !isInteger(start) || !isInteger(step)){throw new Error("start, end and step must be integers");}
    if(step <= 0){throw new Error("step must be positive");}
    let output = [];
    for(let i = start; i < end; i += step){
        output.push(i);
    }
    return output;
}