export function factorial(value){
    let output = 1;
    if(value < 0 || value != Math.floor(value)){
        throw new Error("value must be a non-negative integer");
    }
    for(let i = 1; i <= value; i++){
        output *= i;
    }
    return output;
}

export function isEven(value){
    if(value != Math.floor(value)){
        throw new Error("value must be an integer");
    }
    if((value/2) == Math.floor(value/2)){
        return true;
    }
    return false;
}

export function isOdd(value){
    if(value != Math.floor(value)){
        throw new Error("value must be an integer");
    }
    if((value/2) == Math.floor(value/2)){
        return false;
    }
    return true;
}

export function gcd(a, b){
    if(a != Math.floor(a) || b != Math.floor(b)){
        throw new Error("values must be integers");
    }
    a = Math.abs(a);
    b = Math.abs(b);  
    if(a * b == 0){
        if(a == 0){return b;}
        return a;
    }
    let gcd = 1;
    let min;
    if(a > b){min = b;}
    else{min = a;}

    for(let x = 1; x <= min; x++){
        if((a/x) == Math.floor(a/x) && (b/x) == Math.floor(b/x)){
            gcd = x;
        }
    }

    return gcd;
}

export function lcm(a, b) {
    if (a != Math.floor(a) || b != Math.floor(b)) {
        throw new Error("values must be integers");
    }

    a = Math.abs(a);
    b = Math.abs(b);

    if (a == 0 || b == 0) {
        return 0;
    }

    return (a * b) / gcd(a, b);
}

export function isPrime(value){
    if(value != Math.floor(value)){
        throw new Error("value must be an integer");
    }
    if(value < 0){
        throw new Error("value must be non-negative");
    }
    if(value == 1 || value == 0){return false;}
    for(let x = 2; x <= Math.sqrt(value); x++){
        if(value/x == Math.floor(value/x)){
            return false;
        }
    }
    return true;
}

export function factors(value){
    if(value != Math.floor(value)){
        throw new Error("value must be an integer");
    }
    if(value <= 0){
        throw new Error("value must be positive");
    }

    let list = [];
    for(let i = 1; i <= value; i++){
        if((value/i) == Math.floor(value/i)){
            list.push(i);
        }
    }

    return list;
}

export function primeFactors(value) {
    if (value != Math.floor(value)) {
        throw new Error("value must be an integer");
    }

    if (value < 1) {
        throw new Error("value must be positive");
    }

    const output = [];

    let divisor = 2;

    while (value > 1) {
        if (value / divisor == Math.floor(value / divisor)) {
            output.push(divisor);
            value /= divisor;
        }
        else {
            divisor++;
        }
    }

    return output;
}

export function isPerfectSquare(value){
    if (value != Math.floor(value)) {
        throw new Error("value must be an integer");
    }

    if (value < 0) {
        throw new Error("value must be non-negative");
    }
    if(value == Math.pow(Math.floor(Math.sqrt(value)), 2)){
        return true;
    }
    return false;
}

export function isCoprime(a, b){
    if(a != Math.floor(a) || b != Math.floor(b)){
        throw new Error("values must be integers");
    }
    if(gcd(a, b) == 1){
        return true;
    }
    return false;
}

export function isPerfectNumber(value){
    let list = factors(value);
    list.pop();
    let x = 0;
    for(let i of list){
        x += i;
    }
    if(x == value){return true;}
    return false;
}