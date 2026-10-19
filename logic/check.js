export function allTrue(array){
    let check = true;
    for(let x of array){
        if(!(typeof x === "boolean")){
            throw new Error("all values of array must be a boolean");
        }
        if(!x){
            check = false;
        }
    }
    return check;
}

export function anyTrue(array){
    let check = false;
    for(let x of array){
        if(!(typeof x === "boolean")){
            throw new Error("all values of array must be a boolean");
        }
        if(x){
            check = true;
        }
    }
    return check;
}

export function noneTrue(array){
    if(anyTrue(array)){return false;}
    return true;
}

export function allEqual(array){
    let value = array[0];
    for(let x of array){
        if(value !== x){
            return false;
        }
    }
    return true;
}