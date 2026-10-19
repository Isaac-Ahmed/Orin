export function randomDigit(){
    return Math.floor(10 * Math.random());
}

export function randomChar(){
    let upperCase = ["A", "B" , "C" , "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let randomChar = upperCase[Math.floor(Math.random() * 26)];
    if(Math.random() > 0.5){return randomChar.toLowerCase();}
    return randomChar;
}

export function randomAlphaNumeric(length){
    if(!Number.isSafeInteger(length)){throw new Error("length must be an integer");}
    if(length < 1){throw new Error("length must be positive");}
    let output = "";
    for(let i = 0; i < length; i++){
        if(Math.floor(Math.random() * 62) < 10){
            output += randomDigit();
        }
        else{
            output += randomChar();
        }
    }
    return output;
}

export function randomString(length){
    if(!Number.isSafeInteger(length)){throw new Error("length must be an integer");}
    if(length < 1){throw new Error("length must be positive");}
    let output = "";
    for(let i = 0; i < length; i++){
        output += randomChar();
    }
    return output;
}

export function randomFromCharset(characters, length){
    if(!Number.isSafeInteger(length)){
        throw new Error(
            "length must be an integer"
        );
    }

    if(length < 1){
        throw new Error(
            "length must be positive"
        );
    }

    if(!Array.isArray(characters)){
        throw new Error(
            "characters must be an array"
        );
    }

    if(characters.length === 0){
        throw new Error(
            "characters cannot be empty"
        );
    }

    let output = "";

    for(let i = 0; i < length; i++){
        output +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];
    }

    return output;
}