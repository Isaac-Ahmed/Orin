export function sortAscending(array){
    let output = [...array];

    output.sort((a, b) => a - b);

    return output;
}

export function sortDescending(array){
    let output = [...array];

    output.sort((a, b) => b - a);

    return output;
}

export function reverseOrder(array){
    let output = [...array];

    output.reverse();

    return output;
}

export function isSortedAscending(array){
    for(let i = 0; i < array.length - 1; i++){
        if(array[i] > array[i + 1]){
            return false;
        }
    }

    return true;
}

export function isSortedDescending(array){
    for(let i = 0; i < array.length - 1; i++){
        if(array[i] < array[i + 1]){
            return false;
        }
    }

    return true;
}