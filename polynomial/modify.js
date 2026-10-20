import { createPolynomial } from "./create.js";

function validatePolynomial(polynomial){
    if(typeof polynomial !== "object" || polynomial === null){throw new Error("invalid polynomial");}
    if(!Array.isArray(polynomial.coeffs) || !Array.isArray(polynomial.exponents)){throw new Error("invalid polynomial");}
    if(polynomial.coeffs.length !== polynomial.exponents.length){throw new Error("invalid polynomial");}
}

function sortPolynomial(polynomial){
    let terms = [];

    for(let i = 0; i < polynomial.coeffs.length; i++){
        terms.push({
            coefficient: polynomial.coeffs[i],
            exponent: polynomial.exponents[i]
        });
    }

    terms.sort((a, b) => b.exponent - a.exponent);

    polynomial.coeffs = [];
    polynomial.exponents = [];

    for(let term of terms){
        if(term.coefficient === 0){continue;}

        polynomial.coeffs.push(term.coefficient);
        polynomial.exponents.push(term.exponent);
    }

    return polynomial;
}

function changePolynomial(polynomial, value, multiplier){
    validatePolynomial(polynomial);

    if(typeof value !== "string"){throw new Error("value must be a string");}

    let change = createPolynomial(value);

    for(let i = 0; i < change.coeffs.length; i++){
        let exponent = change.exponents[i];
        let coefficient = change.coeffs[i] * multiplier;

        let index = polynomial.exponents.indexOf(exponent);

        if(index === -1){
            if(coefficient !== 0){
                polynomial.exponents.push(exponent);
                polynomial.coeffs.push(coefficient);
            }
        }
        else{
            polynomial.coeffs[index] += coefficient;
        }
    }

    return sortPolynomial(polynomial);
}

export function add(polynomial, value){
    return changePolynomial(polynomial, value, 1);
}

export function remove(polynomial, value){
    return changePolynomial(polynomial, value, -1);
}

export function setCoefficient(polynomial, exponent, coefficient){
    validatePolynomial(polynomial);

    if(!Number.isSafeInteger(exponent) || exponent < 0){throw new Error("exponent must be a non-negative integer");}
    if(typeof coefficient !== "number" || !Number.isFinite(coefficient)){throw new Error("coefficient must be a number");}

    let index = polynomial.exponents.indexOf(exponent);

    if(index === -1){
        if(coefficient !== 0){
            polynomial.exponents.push(exponent);
            polynomial.coeffs.push(coefficient);
        }
    }
    else if(coefficient === 0){
        polynomial.exponents.splice(index, 1);
        polynomial.coeffs.splice(index, 1);
    }
    else{
        polynomial.coeffs[index] = coefficient;
    }

    return sortPolynomial(polynomial);
}

export function removeExponent(polynomial, exponent){
    validatePolynomial(polynomial);

    if(!Number.isSafeInteger(exponent) || exponent < 0){throw new Error("exponent must be a non-negative integer");}

    let index = polynomial.exponents.indexOf(exponent);

    if(index === -1){return polynomial;}

    polynomial.exponents.splice(index, 1);
    polynomial.coeffs.splice(index, 1);

    return polynomial;
}