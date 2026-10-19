export function power(base, exponent){
    return Math.pow(base, exponent);
}

export function square(value){
    return value * value;
}

export function cube(value){
    return value * value * value;
}

export function squareRoot(value){
    return Math.sqrt(value);
}

export function cubeRoot(value){
    return Math.cbrt(value);
}

export function root(base, rootValue){
    if(rootValue == 0){
        throw new Error("Root cannot be zero");
    }
    else{
        let x = 1/rootValue;
        return Math.pow(base, x);
    }
}

export function ln(value){
    return Math.log(value);
}

export function log2(value){
    return Math.log2(value);
}

export function log10(value){
    return Math.log10(value);
}

export function log(value, base){
    if(value <= 0){
        throw new Error("Logarithm value must be greater than zero");
    }

    if(base <= 0){
        throw new Error("Logarithm base must be greater than zero");
    }

    if(base == 1){
        throw new Error("Logarithm base cannot be one");
    }

    return Math.log(value) / Math.log(base);
}