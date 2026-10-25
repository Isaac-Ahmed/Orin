import {
    PGlite
} from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.10/dist/index.js";


// ========================================
// DATABASE STATE
// ========================================

let activeDatabase =
    null;

let databaseStarting =
    null;


// ========================================
// SQL RESULTS PANEL
// ========================================

function getSqlResultsContent(){
    return document.getElementById(
        "sqlResultsContent"
    );
}


function clearSqlResults(){
    const content =
        getSqlResultsContent();


    if(!content){
        return;
    }


    content.replaceChildren();
}


function addSqlLine(
    message,
    className = ""
){
    const content =
        getSqlResultsContent();


    if(!content){
        return;
    }


    const line =
        document.createElement(
            "p"
        );


    line.className =
        "sql-line";


    if(className){
        line.classList.add(
            className
        );
    }


    line.textContent =
        String(
            message
        );


    content.appendChild(
        line
    );
}


// ========================================
// VALUE DISPLAY
// ========================================

function formatSqlValue(
    value
){
    if(
        value === null ||
        value === undefined
    ){
        return {
            text:
                "NULL",

            isNull:
                true
        };
    }


    if(
        typeof value ===
            "object"
    ){
        try{
            return {
                text:
                    JSON.stringify(
                        value
                    ),

                isNull:
                    false
            };
        }
        catch(error){
            return {
                text:
                    String(
                        value
                    ),

                isNull:
                    false
            };
        }
    }


    return {
        text:
            String(
                value
            ),

        isNull:
            false
    };
}


// ========================================
// TABLE DISPLAY
// ========================================

function renderSqlTable(
    rows,
    fields
){
    const content =
        getSqlResultsContent();


    if(!content){
        return;
    }


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.className =
        "sql-table-scroll";


    const table =
        document.createElement(
            "table"
        );


    table.className =
        "sql-table";


    const thead =
        document.createElement(
            "thead"
        );


    const headerRow =
        document.createElement(
            "tr"
        );


    for(
        const field
        of fields
    ){
        const th =
            document.createElement(
                "th"
            );


        th.textContent =
            field.name;


        headerRow.appendChild(
            th
        );
    }


    thead.appendChild(
        headerRow
    );


    table.appendChild(
        thead
    );


    const tbody =
        document.createElement(
            "tbody"
        );


    for(
        const row
        of rows
    ){
        const tr =
            document.createElement(
                "tr"
            );


        for(
            const field
            of fields
        ){
            const td =
                document.createElement(
                    "td"
                );


            const formatted =
                formatSqlValue(
                    row[
                        field.name
                    ]
                );


            td.textContent =
                formatted.text;


            if(
                formatted.isNull
            ){
                td.classList.add(
                    "sql-null"
                );
            }


            tr.appendChild(
                td
            );
        }


        tbody.appendChild(
            tr
        );
    }


    table.appendChild(
        tbody
    );


    wrapper.appendChild(
        table
    );


    content.appendChild(
        wrapper
    );
}


// ========================================
// RESULT DISPLAY
// ========================================

function displaySqlResult(
    result,
    index
){
    const rows =
        result &&
        Array.isArray(
            result.rows
        )
            ? result.rows
            : [];


    const fields =
        result &&
        Array.isArray(
            result.fields
        )
            ? result.fields
            : [];


    if(
        fields.length > 0
    ){
        addSqlLine(
            `Result ${index}: ${rows.length} row(s) returned`
        );


        renderSqlTable(
            rows,
            fields
        );


        return;
    }


    const affectedRows =
        result &&
        typeof result.affectedRows ===
            "number"
            ? result.affectedRows
            : 0;


    addSqlLine(
        `Statement ${index}: ${affectedRows} row(s) affected`
    );
}


// ========================================
// DATABASE LIFECYCLE
// ========================================

async function createDatabase(){
    activeDatabase =
        await PGlite.create({
            dataDir:
                "memory://"
        });


    return activeDatabase;
}


async function getDatabase(){
    if(
        activeDatabase
    ){
        return activeDatabase;
    }


    if(
        databaseStarting
    ){
        return await databaseStarting;
    }


    databaseStarting =
        createDatabase();


    try{
        return await databaseStarting;
    }
    finally{
        databaseStarting =
            null;
    }
}


async function resetDatabase(
    clearResults = true
){
    if(
        databaseStarting
    ){
        try{
            await databaseStarting;
        }
        catch(error){
        }


        databaseStarting =
            null;
    }


    if(
        activeDatabase
    ){
        try{
            await activeDatabase.close();
        }
        catch(error){
            console.warn(
                "PGlite close error:",
                error
            );
        }
    }


    activeDatabase =
        null;


    if(
        clearResults
    ){
        clearSqlResults();
    }
}


// ========================================
// SQL EXECUTION
// ========================================

async function executeSQL(
    sql,
    description
){
    if(
        typeof sql !==
            "string"
    ){
        throw new Error(
            "SQL source must be a string"
        );
    }


    if(
        sql.trim() === ""
    ){
        throw new Error(
            "SQL source is empty"
        );
    }


    const database =
        await getDatabase();


    addSqlLine(
        `Running ${description}...`
    );


    try{
        const results =
            await database.exec(
                sql
            );


        if(
            !Array.isArray(
                results
            ) ||
            results.length === 0
        ){
            addSqlLine(
                "SQL executed successfully.",
                "sql-success"
            );


            return [];
        }


        for(
            let i = 0;
            i < results.length;
            i++
        ){
            displaySqlResult(
                results[i],
                i + 1
            );
        }


        addSqlLine(
            "SQL execution completed successfully.",
            "sql-success"
        );


        return results;
    }
    catch(error){
        addSqlLine(
            "PostgreSQL error:",
            "sql-error"
        );


        addSqlLine(
            error &&
            error.message
                ? error.message
                : String(
                    error
                ),
            "sql-error"
        );


        throw error;
    }
}


// ========================================
// RUN A DEFINE SQL DEFINITION
// ========================================

export async function runSQL(
    definition
){
    if(
        !definition ||
        typeof definition !==
            "object" ||
        definition.__orinSQLDefinition !==
            true ||
        definition.__orinModuleType !==
            "database.sql"
    ){
        throw new Error(
            "runSQL requires a SQL definition"
        );
    }


    if(
        Array.isArray(
            definition.parameters
        ) &&
        definition.parameters.length > 0
    ){
        throw new Error(
            "parameterised SQL definitions are not supported yet"
        );
    }


    return await executeSQL(
        definition.source,
        `SQL definition '${definition.name}'`
    );
}


// ========================================
// RUN A PROJECT SQL FILE
// ========================================

export async function runSQLFile(
    filepath
){
    if(
        typeof filepath !==
            "string"
    ){
        throw new Error(
            "runSQLFile path must be a string"
        );
    }


    const cleanPath =
        filepath.trim();


    if(
        cleanPath === ""
    ){
        throw new Error(
            "runSQLFile path cannot be empty"
        );
    }


    if(
        !cleanPath
            .toLowerCase()
            .endsWith(
                ".sql"
            )
    ){
        throw new Error(
            "runSQLFile requires a .sql file"
        );
    }


    if(
        !window[
            "orinProjectFiles"
        ] ||
        typeof window[
            "orinProjectFiles"
        ].readText !==
            "function"
    ){
        throw new Error(
            "Orin project file access is unavailable"
        );
    }


    const sql =
        window[
            "orinProjectFiles"
        ].readText(
            cleanPath
        );


    return await executeSQL(
        sql,
        cleanPath
    );
}


// ========================================
// SESSION CONTROL
// ========================================

export async function reset(){
    await resetDatabase(
        true
    );
}


// ========================================
// RUNTIME BRIDGE
// ========================================

window[
    "orinDatabaseRunnerRuntime"
] = {
    reset:
        resetDatabase,

    hasDatabase:
        function(){
            return (
                activeDatabase !==
                null
            );
        }
};