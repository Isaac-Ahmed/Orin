export function choice(array){
    if(!Array.isArray(array)){
        throw new Error(
            "input must be an array"
        );
    }

    if(array.length === 0){
        throw new Error(
            "array cannot be empty"
        );
    }

    const index =
        Math.floor(
            Math.random() *
            array.length
        );

    return array[index];
}

export function sample(array, amount){
    if(!Array.isArray(array)){
        throw new Error(
            "input must be an array"
        );
    }

    if(
        !Number.isSafeInteger(amount) ||
        amount < 1
    ){
        throw new Error(
            "amount must be a positive integer"
        );
    }

    if(amount > array.length){
        throw new Error(
            "amount cannot be greater than array length"
        );
    }

    const shuffled =
        shuffle(array);

    const output = [];

    for(
        let i = 0;
        i < amount;
        i++
    ){
        output.push(
            shuffled[i]
        );
    }

    return output;
}

export function shuffle(array){
    if(!Array.isArray(array)){
        throw new Error(
            "input must be an array"
        );
    }

    const output =
        [...array];

    for(
        let i = output.length - 1;
        i > 0;
        i--
    ){
        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        const currentValue =
            output[i];

        output[i] =
            output[randomIndex];

        output[randomIndex] =
            currentValue;
    }

    return output;
}

export function pickIndex(array){
    if(!Array.isArray(array)){
        throw new Error(
            "input must be an array"
        );
    }

    if(array.length === 0){
        throw new Error(
            "array cannot be empty"
        );
    }

    return Math.floor(
        Math.random() *
        array.length
    );
}