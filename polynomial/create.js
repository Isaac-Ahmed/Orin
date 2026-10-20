function validatePolynomial(polynomial){
    if(typeof polynomial !== "object" || polynomial === null){throw new Error("invalid polynomial");}
    if(!Array.isArray(polynomial.coeffs) || !Array.isArray(polynomial.exponents)){throw new Error("invalid polynomial");}
    if(polynomial.coeffs.length !== polynomial.exponents.length){throw new Error("invalid polynomial");}
}

function parseTerm(term){
    if(typeof term !== "string"){throw new Error("term must be a string");}

    term = term.trim();

    if(term === ""){throw new Error("term cannot be empty");}

    if(!term.includes("x")){
        let coefficient = Number(term);

        if(!Number.isFinite(coefficient)){throw new Error("invalid polynomial term");}

        return {
            coefficient: coefficient,
            exponent: 0
        };
    }

    let xIndex = term.indexOf("x");

    if(term.indexOf("x", xIndex + 1) !== -1){throw new Error("invalid polynomial term");}

    let coefficientText = term.slice(0, xIndex);
    let exponentText = term.slice(xIndex + 1);

    let coefficient;

    if(coefficientText === "" || coefficientText === "+"){coefficient = 1;}
    else if(coefficientText === "-"){coefficient = -1;}
    else{
        coefficient = Number(coefficientText);

        if(!Number.isFinite(coefficient)){throw new Error("invalid polynomial coefficient");}
    }

    let exponent = 1;

    if(exponentText !== ""){
        if(!exponentText.startsWith("^")){throw new Error("invalid polynomial exponent");}

        exponentText = exponentText.slice(1);

        if(exponentText === ""){throw new Error("invalid polynomial exponent");}

        exponent = Number(exponentText);

        if(!Number.isSafeInteger(exponent) || exponent < 0){
            throw new Error("exponent must be a non-negative integer");
        }
    }

    return {
        coefficient: coefficient,
        exponent: exponent
    };
}

function addParsedTerm(polynomial, coefficient, exponent){
    let index = polynomial.exponents.indexOf(exponent);

    if(index !== -1){
        polynomial.coeffs[index] += coefficient;

        if(polynomial.coeffs[index] === 0){
            polynomial.coeffs.splice(index, 1);
            polynomial.exponents.splice(index, 1);
        }

        return;
    }

    if(coefficient === 0){return;}

    polynomial.coeffs.push(coefficient);
    polynomial.exponents.push(exponent);
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
        polynomial.coeffs.push(term.coefficient);
        polynomial.exponents.push(term.exponent);
    }

    return polynomial;
}

function buildPolynomial(value){
    if(typeof value !== "string"){throw new Error("polynomial must be a string");}

    value = value
        .replaceAll(" ", "")
        .replaceAll("*", "");

    if(value === ""){throw new Error("polynomial cannot be empty");}

    if(value[0] !== "+" && value[0] !== "-"){
        value = "+" + value;
    }

    let terms = [];
    let current = "";

    for(let i = 0; i < value.length; i++){
        let char = value[i];

        if((char === "+" || char === "-") && current !== ""){
            terms.push(current);
            current = char;
        }
        else{
            current += char;
        }
    }

    if(current !== ""){
        terms.push(current);
    }

    let polynomial = {
        coeffs: [],
        exponents: []
    };

    for(let term of terms){
        let parsed = parseTerm(term);

        addParsedTerm(
            polynomial,
            parsed.coefficient,
            parsed.exponent
        );
    }

    return sortPolynomial(polynomial);
}

export function create(value){
    return buildPolynomial(value);
}

export function createPolynomial(value){
    return buildPolynomial(value);
}

export function getCoefficients(polynomial){
    validatePolynomial(polynomial);

    return [...polynomial.coeffs];
}

export function getExponents(polynomial){
    validatePolynomial(polynomial);

    return [...polynomial.exponents];
}

export function polynomialToString(polynomial){
    validatePolynomial(polynomial);

    if(polynomial.coeffs.length === 0){return "0";}

    let output = "";

    for(let i = 0; i < polynomial.coeffs.length; i++){
        let coefficient = polynomial.coeffs[i];
        let exponent = polynomial.exponents[i];

        if(coefficient === 0){continue;}

        let negative = coefficient < 0;
        let absolute = Math.abs(coefficient);

        if(output !== ""){
            output += negative ? "-" : "+";
        }
        else if(negative){
            output += "-";
        }

        if(exponent === 0){
            output += absolute;
            continue;
        }

        if(absolute !== 1){
            output += absolute;
        }

        output += "x";

        if(exponent !== 1){
            output += "^" + exponent;
        }
    }

    return output === "" ? "0" : output;
}