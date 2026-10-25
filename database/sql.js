// ========================================
// DATABASE.SQL
//
// Enables SQL definitions inside Orin.
//
// This module does NOT execute SQL.
// database.runner will handle execution.
//
// Intended Orin syntax:
//
// import database.sql;
//
// define sql getUsers(){
//     SELECT *
//     FROM users;
// }
//
// ========================================


// ========================================
// CONSTANTS
// ========================================

const SQL_DEFINITION_TYPE =
    "database.sql";


// ========================================
// VALIDATION
// ========================================

function validateName(name){
    if(
        typeof name !== "string"
    ){
        throw new Error(
            "SQL definition name must be a string"
        );
    }


    const trimmed =
        name.trim();


    if(
        trimmed === ""
    ){
        throw new Error(
            "SQL definition name cannot be empty"
        );
    }


    if(
        !/^[A-Za-z_$][\w$]*$/.test(
            trimmed
        )
    ){
        throw new Error(
            `'${name}' is not a valid SQL definition name`
        );
    }


    return trimmed;
}


function validateParameters(
    parameters
){
    if(
        parameters === undefined ||
        parameters === null
    ){
        return [];
    }


    if(
        !Array.isArray(
            parameters
        )
    ){
        throw new Error(
            "SQL definition parameters must be an array"
        );
    }


    const output = [];


    for(
        const parameter
        of parameters
    ){
        if(
            typeof parameter !==
                "string"
        ){
            throw new Error(
                "SQL definition parameter names must be strings"
            );
        }


        const trimmed =
            parameter.trim();


        if(
            trimmed === ""
        ){
            throw new Error(
                "SQL definition parameter names cannot be empty"
            );
        }


        if(
            !/^[A-Za-z_$][\w$]*$/.test(
                trimmed
            )
        ){
            throw new Error(
                `'${parameter}' is not a valid SQL parameter name`
            );
        }


        if(
            output.includes(
                trimmed
            )
        ){
            throw new Error(
                `SQL definition contains duplicate parameter '${trimmed}'`
            );
        }


        output.push(
            trimmed
        );
    }


    return output;
}


function validateSource(source){
    if(
        typeof source !== "string"
    ){
        throw new Error(
            "SQL definition body must be a string"
        );
    }


    return source
        .replace(
            /\r\n/g,
            "\n"
        )
        .replace(
            /\r/g,
            "\n"
        );
}


// ========================================
// DEFINITION CREATION
// ========================================

function buildSQLDefinition(
    name,
    parameters,
    source
){
    const validName =
        validateName(
            name
        );


    const validParameters =
        validateParameters(
            parameters
        );


    const validSource =
        validateSource(
            source
        );


    return Object.freeze({
        __orinSQLDefinition:
            true,

        __orinModuleType:
            SQL_DEFINITION_TYPE,

        name:
            validName,

        parameters:
            Object.freeze(
                [
                    ...validParameters
                ]
            ),

        source:
            validSource
    });
}


// ========================================
// PUBLIC CREATION FUNCTIONS
// ========================================

export function create(
    name,
    parameters,
    source
){
    return buildSQLDefinition(
        name,
        parameters,
        source
    );
}


export function createSQLDefinition(
    name,
    parameters,
    source
){
    return buildSQLDefinition(
        name,
        parameters,
        source
    );
}


// ========================================
// TYPE CHECKING
// ========================================

export function isSQLDefinition(
    value
){
    return (
        value !== null &&
        typeof value === "object" &&
        value.__orinSQLDefinition ===
            true &&
        value.__orinModuleType ===
            SQL_DEFINITION_TYPE &&
        typeof value.name ===
            "string" &&
        Array.isArray(
            value.parameters
        ) &&
        typeof value.source ===
            "string"
    );
}


// ========================================
// DEFINITION INFORMATION
// ========================================

export function getName(
    definition
){
    requireSQLDefinition(
        definition
    );


    return definition.name;
}


export function getParameters(
    definition
){
    requireSQLDefinition(
        definition
    );


    return [
        ...definition.parameters
    ];
}


export function getSource(
    definition
){
    requireSQLDefinition(
        definition
    );


    return definition.source;
}


// ========================================
// INTERNAL VALIDATION
// ========================================

function requireSQLDefinition(
    definition
){
    if(
        !isSQLDefinition(
            definition
        )
    ){
        throw new Error(
            "value must be an SQL definition"
        );
    }
}


// ========================================
// ORIN RETURN TYPE INFORMATION
// ========================================

export const __orinReturnTypes = {
    create:
        SQL_DEFINITION_TYPE,

    createSQLDefinition:
        SQL_DEFINITION_TYPE
};