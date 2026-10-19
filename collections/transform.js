export function copy(array){
    if(!Array.isArray(array)){
        throw new Error("array must be an array");
    }

    let output = [];

    for(let x of array){
        output.push(x);
    }

    return output;
}

export function removeDuplicates(array){
    if(!Array.isArray(array)){
        throw new Error("array must be an array");
    }

    let output = [];
    let toAdd = true;

    for(let x of array){
        for(let y of output){
            if(x === y){
                toAdd = false;
                break;
            }
        }

        if(toAdd){
            output.push(x);
        }

        toAdd = true;
    }

    return output;
}

export function take(array, amount){
    if(!Array.isArray(array)){
        throw new Error("array must be an array");
    }

    if(typeof amount !== "number" || !Number.isInteger(amount)){
        throw new Error("amount must be an integer");
    }

    if(amount < 0){
        throw new Error("amount cannot be negative");
    }

    if(amount > array.length){
        throw new Error("amount cannot be greater than the array length");
    }

    let output = [];

    for(let i = 0; i < amount; i++){
        output.push(array[i]);
    }

    return output;
}

export function drop(array, amount){
    if(!Array.isArray(array)){
        throw new Error("array must be an array");
    }

    if(typeof amount !== "number" || !Number.isInteger(amount)){
        throw new Error("amount must be an integer");
    }

    if(amount < 0){
        throw new Error("amount cannot be negative");
    }

    if(amount > array.length){
        throw new Error("amount cannot be greater than the array length");
    }

    let output = [];

    for(let i = amount; i < array.length; i++){
        output.push(array[i]);
    }

    return output;
}

export function slice(array, start, end){
    if(!Array.isArray(array)){
        throw new Error("array must be an array");
    }

    if(typeof start !== "number" || !Number.isInteger(start)){
        throw new Error("start must be an integer");
    }

    if(typeof end !== "number" || !Number.isInteger(end)){
        throw new Error("end must be an integer");
    }

    if(start < 0 || end < 0){
        throw new Error("start and end cannot be negative");
    }

    if(start > end){
        throw new Error("start cannot be greater than end");
    }

    if(start > array.length || end > array.length){
        throw new Error("start and end cannot be greater than the array length");
    }

    let output = [];

    for(let i = start; i < end; i++){
        output.push(array[i]);
    }

    return output;
}