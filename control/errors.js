const TRY_REGEX =
    /^\s*try\s*\{\s*$/;

const CATCH_REGEX =
    /^\s*catch\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*\{\s*$/;

const FINALLY_REGEX =
    /^\s*finally\s*\{\s*$/;

const THROW_REGEX =
    /^\s*throw(?:\s+(.+?))?\s*;\s*$/;

export class OrinThrownError {
    constructor(value){
        this.value = value;
    }
}

export function isTryStatement(line){
    return TRY_REGEX.test(line);
}

export function isCatchStatement(line){
    return CATCH_REGEX.test(line);
}

export function isFinallyStatement(line){
    return FINALLY_REGEX.test(line);
}

export function isThrowStatement(line){
    return THROW_REGEX.test(line);
}

export function parseCatchStatement(line){
    const match = line.match(CATCH_REGEX);

    if(!match){
        throw new Error("Invalid catch statement");
    }

    return {
        variableName: match[1]
    };
}

export function parseThrowStatement(line){
    const match = line.match(THROW_REGEX);

    if(!match){
        throw new Error("Invalid throw statement");
    }

    if(match[1] === undefined){
        return {
            expression: null
        };
    }

    return {
        expression: match[1].trim()
    };
}