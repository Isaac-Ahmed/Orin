function validatePolynomial(polynomial){
    if(typeof polynomial !== "object" || polynomial === null){throw new Error("invalid polynomial");}
    if(!Array.isArray(polynomial.coeffs) || !Array.isArray(polynomial.exponents)){throw new Error("invalid polynomial");}
    if(polynomial.coeffs.length !== polynomial.exponents.length){throw new Error("invalid polynomial");}
}

export function evaluate(polynomial, x){
    validatePolynomial(polynomial);

    if(typeof x !== "number" || !Number.isFinite(x)){throw new Error("x must be a number");}

    let result = 0;

    for(let i = 0; i < polynomial.coeffs.length; i++){
        result += polynomial.coeffs[i] * Math.pow(x, polynomial.exponents[i]);
    }

    return result;
}

export function getCoefficient(polynomial, exponent){
    validatePolynomial(polynomial);

    if(!Number.isSafeInteger(exponent) || exponent < 0){throw new Error("exponent must be a non-negative integer");}

    let index = polynomial.exponents.indexOf(exponent);

    if(index === -1){return 0;}

    return polynomial.coeffs[index];
}

export function getDegree(polynomial){
    validatePolynomial(polynomial);

    if(polynomial.exponents.length === 0){return 0;}

    let highest = polynomial.exponents[0];

    for(let exponent of polynomial.exponents){
        if(exponent > highest){highest = exponent;}
    }

    return highest;
}