export function contains(array, value){
    return array.includes(value);
}

export function findIndex(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i] === value){
            return i;
        }
    }

    return -1;
}

export function find(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i] === value){
            return array[i];
        }
    }

    return null;
}

export function count(array, value){
    let output = 0;

    for(let i = 0; i < array.length; i++){
        if(array[i] === value){
            output++;
        }
    }

    return output;
}

export function first(array){
    if(array.length === 0){
        return null;
    }

    return array[0];
}

export function last(array){
    if(array.length === 0){
        return null;
    }

    return array[array.length - 1];
}