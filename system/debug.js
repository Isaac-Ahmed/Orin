export function assert(condition){
    if(typeof condition !== "boolean"){
        throw new Error(
            "assert condition must be a boolean"
        );
    }

    if(!condition){
        throw new Error(
            "assert condition was false"
        );
    }
}

export function assertEqual(a, b){
    if(a !== b){
        throw new Error(
            "values are not equal"
        );
    }
}

export function assertNotEqual(a, b){
    if(a === b){
        throw new Error(
            "values are equal"
        );
    }
}

export function fail(message){
    if(typeof message !== "string"){
        throw new Error(
            "fail message must be a string"
        );
    }

    throw new Error(
        message
    );
}