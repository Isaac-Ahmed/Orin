/**
 * DATABASE.RESULT
 *
 * Helpers for working with results returned by database.runner.
 */


// ========================================
// INTERNAL HELPERS
// ========================================

function getFinalResult(
    result
){
    if(
        !Array.isArray(
            result
        )
    ){
        throw new Error(
            "value must be a database result"
        );
    }


    if(
        result.length === 0
    ){
        return null;
    }


    return result[
        result.length - 1
    ];
}


function getRowsFromResult(
    result
){
    const finalResult =
        getFinalResult(
            result
        );


    if(
        finalResult === null
    ){
        return [];
    }


    if(
        !Array.isArray(
            finalResult.rows
        )
    ){
        return [];
    }


    return finalResult.rows;
}


// ========================================
// PUBLIC FUNCTIONS
// ========================================


// Return every row from the final SQL statement
export function getRows(
    result
){
    return getRowsFromResult(
        result
    );
}


// Return one row by zero-based index
export function getRow(
    result,
    index
){
    const rows =
        getRowsFromResult(
            result
        );


    if(
        !Number.isSafeInteger(
            index
        )
    ){
        throw new Error(
            "row index must be an integer"
        );
    }


    if(
        index < 0 ||
        index >= rows.length
    ){
        throw new Error(
            `row index ${index} is out of range`
        );
    }


    return rows[
        index
    ];
}


// Return one column value from one row
export function getValue(
    result,
    rowIndex,
    columnName
){
    if(
        typeof columnName !==
            "string"
    ){
        throw new Error(
            "column name must be a string"
        );
    }


    const row =
        getRow(
            result,
            rowIndex
        );


    if(
        !Object.prototype
            .hasOwnProperty
            .call(
                row,
                columnName
            )
    ){
        throw new Error(
            `column '${columnName}' does not exist`
        );
    }


    return row[
        columnName
    ];
}


// Return number of rows
export function getCount(
    result
){
    return getRowsFromResult(
        result
    ).length;
}


// Check whether at least one row exists
export function hasRows(
    result
){
    return (
        getCount(
            result
        ) > 0
    );
}