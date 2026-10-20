const FUNCTION_DEFINITIONS = {
    ln: {
        argumentCount: 1,
        category: "Logarithmic functions",
        syntax: "ln(x)",
        evaluate(values){
            return Math.log(values[0]);
        }
    },

    log: {
        argumentCount: 1,
        category: "Logarithmic functions",
        syntax: "log(x)",
        evaluate(values){
            return Math.log10(values[0]);
        }
    },

    sin: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "sin(x)",
        evaluate(values){
            return Math.sin(values[0]);
        }
    },

    cos: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "cos(x)",
        evaluate(values){
            return Math.cos(values[0]);
        }
    },

    tan: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "tan(x)",
        evaluate(values){
            return Math.tan(values[0]);
        }
    },

    sec: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "sec(x)",
        evaluate(values){
            return 1 / Math.cos(values[0]);
        }
    },

    csc: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "csc(x)",
        evaluate(values){
            return 1 / Math.sin(values[0]);
        }
    },

    cot: {
        argumentCount: 1,
        category: "Trigonometric functions",
        syntax: "cot(x)",
        evaluate(values){
            return 1 / Math.tan(values[0]);
        }
    },

    asin: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "asin(x)",
        evaluate(values){
            return Math.asin(values[0]);
        }
    },

    acos: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "acos(x)",
        evaluate(values){
            return Math.acos(values[0]);
        }
    },

    atan: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "atan(x)",
        evaluate(values){
            return Math.atan(values[0]);
        }
    },

    asec: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "asec(x)",
        evaluate(values){
            return Math.acos(
                1 / values[0]
            );
        }
    },

    acsc: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "acsc(x)",
        evaluate(values){
            return Math.asin(
                1 / values[0]
            );
        }
    },

    acot: {
        argumentCount: 1,
        category: "Inverse trigonometric functions",
        syntax: "acot(x)",
        evaluate(values){
            return Math.atan2(
                1,
                values[0]
            );
        }
    },

    sinh: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "sinh(x)",
        evaluate(values){
            return Math.sinh(values[0]);
        }
    },

    cosh: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "cosh(x)",
        evaluate(values){
            return Math.cosh(values[0]);
        }
    },

    tanh: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "tanh(x)",
        evaluate(values){
            return Math.tanh(values[0]);
        }
    },

    sech: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "sech(x)",
        evaluate(values){
            return 1 / Math.cosh(values[0]);
        }
    },

    csch: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "csch(x)",
        evaluate(values){
            return 1 / Math.sinh(values[0]);
        }
    },

    coth: {
        argumentCount: 1,
        category: "Hyperbolic functions",
        syntax: "coth(x)",
        evaluate(values){
            return (
                Math.cosh(values[0]) /
                Math.sinh(values[0])
            );
        }
    },

    asinh: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "asinh(x)",
        evaluate(values){
            return Math.asinh(values[0]);
        }
    },

    acosh: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "acosh(x)",
        evaluate(values){
            return Math.acosh(values[0]);
        }
    },

    atanh: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "atanh(x)",
        evaluate(values){
            return Math.atanh(values[0]);
        }
    },

    asech: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "asech(x)",
        evaluate(values){
            return Math.acosh(
                1 / values[0]
            );
        }
    },

    acsch: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "acsch(x)",
        evaluate(values){
            return Math.asinh(
                1 / values[0]
            );
        }
    },

    acoth: {
        argumentCount: 1,
        category: "Inverse hyperbolic functions",
        syntax: "acoth(x)",
        evaluate(values){
            return Math.atanh(
                1 / values[0]
            );
        }
    },

    sqrt: {
        argumentCount: 1,
        category: "Roots",
        syntax: "sqrt(x)",
        evaluate(values){
            return Math.sqrt(values[0]);
        }
    },

    cbrt: {
        argumentCount: 1,
        category: "Roots",
        syntax: "cbrt(x)",
        evaluate(values){
            return Math.cbrt(values[0]);
        }
    },

    root: {
        argumentCount: 2,
        category: "Roots",
        syntax: "root(x, n)",
        evaluate(values){
            const value =
                values[0];

            const rootValue =
                values[1];

            if(rootValue === 0){
                return NaN;
            }

            if(
                value < 0 &&
                Number.isInteger(rootValue) &&
                Math.abs(rootValue) % 2 === 1
            ){
                return -Math.pow(
                    -value,
                    1 / rootValue
                );
            }

            return Math.pow(
                value,
                1 / rootValue
            );
        }
    },

    floor: {
        argumentCount: 1,
        category: "Rounding functions",
        syntax: "floor(x)",
        evaluate(values){
            return Math.floor(values[0]);
        }
    },

    ceiling: {
        argumentCount: 1,
        category: "Rounding functions",
        syntax: "ceiling(x)",
        evaluate(values){
            return Math.ceil(values[0]);
        }
    },

    round: {
        argumentCount: 1,
        category: "Rounding functions",
        syntax: "round(x)",
        evaluate(values){
            return Math.round(values[0]);
        }
    },

    truncate: {
        argumentCount: 1,
        category: "Rounding functions",
        syntax: "truncate(x)",
        evaluate(values){
            return Math.trunc(values[0]);
        }
    }
};

const CATEGORY_ORDER = [
    "Trigonometric functions",
    "Inverse trigonometric functions",
    "Hyperbolic functions",
    "Inverse hyperbolic functions",
    "Logarithmic functions",
    "Roots",
    "Rounding functions"
];


function getDynamicLogDefinition(name){
    const match =
        name.match(
            /^log(\d+(?:\.\d+)?)$/
        );

    if(!match){
        return null;
    }

    const base =
        Number(match[1]);

    if(
        !Number.isFinite(base) ||
        base <= 0 ||
        base === 1
    ){
        throw new Error(
            "invalid logarithm base"
        );
    }

    return {
        name: "log",
        displayName: name,
        base: base,
        argumentCount: 1,
        category: "Logarithmic functions",
        syntax: `${name}(x)`,

        evaluate(values){
            return (
                Math.log(values[0]) /
                Math.log(base)
            );
        }
    };
}


export function getFunctionDefinition(name){
    if(typeof name !== "string"){
        return null;
    }

    const lower =
        name.toLowerCase();

    if(
        FUNCTION_DEFINITIONS[
            lower
        ]
    ){
        return {
            ...FUNCTION_DEFINITIONS[
                lower
            ],

            name: lower,
            displayName: lower
        };
    }

    return getDynamicLogDefinition(
        lower
    );
}


export function isSupportedFunction(name){
    return (
        getFunctionDefinition(name) !==
        null
    );
}


export function evaluateFunction(
    name,
    values
){
    const definition =
        getFunctionDefinition(
            name
        );

    if(!definition){
        throw new Error(
            `unknown expression function '${name}'`
        );
    }

    if(
        values.length !==
        definition.argumentCount
    ){
        throw new Error(
            `'${name}' expects ${definition.argumentCount} argument${definition.argumentCount === 1 ? "" : "s"}`
        );
    }

    return definition.evaluate(
        values
    );
}


function getCategorySyntax(category){
    const values = [];

    for(
        const name
        in FUNCTION_DEFINITIONS
    ){
        const definition =
            FUNCTION_DEFINITIONS[
                name
            ];

        if(
            definition.category !==
            category
        ){
            continue;
        }

        values.push(
            definition.syntax
        );
    }

    if(
        category ===
        "Logarithmic functions"
    ){
        values.push(
            "logN(x)"
        );
    }

    return values.join(", ");
}


export function getSupportedSyntax(){
    const sections = [
        "Variable\nx",

        "Constants\ne",

        "Operators\n+, -, *, /, ^",

        "Grouping\n(...)",

        "Absolute value\n|...|",

        "Implicit multiplication\n2x, 2(x+1), x(x+1), (x+1)(x-1)",

        "Polynomial and rational expressions\n3x^2+2x-1, (x+x^2)/(x-1)"
    ];

    for(
        const category
        of CATEGORY_ORDER
    ){
        sections.push(
            category +
            "\n" +
            getCategorySyntax(
                category
            )
        );
    }

    sections.push(
        "Logarithm bases\nlog(x) is base 10. logN(x) uses N as the base, for example log4(x) or log100(x^10)."
    );

    sections.push(
        "Powers\nEither side of ^ may be a complete expression, for example (x+1)^(x-2)."
    );

    return sections.join(
        "\n\n"
    );
}