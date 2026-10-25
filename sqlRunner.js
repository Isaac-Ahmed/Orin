/**
 * Orin SQL Runner
 *
 * Runs .sql project files using PGlite.
 *
 * Behaviour:
 * - Runs the currently active .sql file
 * - Creates a fresh PostgreSQL database for every run
 * - Executes the full SQL script
 * - Supports multiple SQL statements
 * - Shows SELECT results as HTML tables
 * - Shows affected row counts
 * - Shows PostgreSQL errors
 * - Discards the database after every run
 */

import {
    PGlite
} from "https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.10/dist/index.js";


// ========================================
// STATE
// ========================================

let sqlRunning =
    false;

let activeSqlDatabase =
    null;


// ========================================
// FILE CHECKS
// ========================================

function isSqlProjectFile(file){
    return (
        file &&
        file.type === "file" &&
        typeof file.name === "string" &&
        file.name
            .toLowerCase()
            .endsWith(".sql")
    );
}


function isActiveFileSql(){
    return (
        typeof activeFile !== "undefined" &&
        isSqlProjectFile(
            activeFile
        )
    );
}


// ========================================
// SQL PANEL
// ========================================

function getSqlResultsPanel(){
    return document.getElementById(
        "sqlResultsPanel"
    );
}


function getSqlResultsContent(){
    return document.getElementById(
        "sqlResultsContent"
    );
}


function showSqlResultsPanel(){
    const panel =
        getSqlResultsPanel();

    if(!panel){
        return;
    }

    panel.classList.remove(
        "hidden"
    );
}


function hideSqlResultsPanel(){
    const panel =
        getSqlResultsPanel();

    if(!panel){
        return;
    }

    panel.classList.add(
        "hidden"
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


// ========================================
// OUTPUT HELPERS
// ========================================

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
        String(message);

    content.appendChild(
        line
    );
}


function formatSqlValue(value){
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
            String(value),

        isNull:
            false
    };
}


// ========================================
// TABLE OUTPUT
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
// DATABASE MANAGEMENT
// ========================================

async function closeSqlDatabase(){
    if(
        !activeSqlDatabase
    ){
        return;
    }


    try{
        await activeSqlDatabase.close();
    }
    catch(error){
        console.warn(
            "PGlite close error:",
            error
        );
    }


    activeSqlDatabase =
        null;
}


async function createSqlDatabase(){
    await closeSqlDatabase();


    activeSqlDatabase =
        await PGlite.create({
            dataDir:
                "memory://"
        });


    return activeSqlDatabase;
}


// ========================================
// SQL EXECUTION
// ========================================

async function runSqlFile(){
    if(
        sqlRunning
    ){
        return;
    }


    if(
        typeof activeFile ===
            "undefined" ||
        !activeFile
    ){
        throw new Error(
            "there is no active project file"
        );
    }


    if(
        !isSqlProjectFile(
            activeFile
        )
    ){
        throw new Error(
            "the active file is not an SQL file"
        );
    }


    if(
        typeof editor ===
            "undefined" ||
        !editor
    ){
        throw new Error(
            "the editor is unavailable"
        );
    }


    const sql =
        editor.getValue();


    showSqlResultsPanel();
    clearSqlResults();


    if(
        sql.trim() === ""
    ){
        addSqlLine(
            "SQL file is empty."
        );

        return;
    }


    sqlRunning =
        true;


    addSqlLine(
        `Running ${activeFile.name}...`
    );


    try{
        const database =
            await createSqlDatabase();


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
        }
        else{
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
        }
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
                : String(error),
            "sql-error"
        );


        if(
            error &&
            error.position
        ){
            addSqlLine(
                `Error position: ${error.position}`,
                "sql-error"
            );
        }
    }
    finally{
        await closeSqlDatabase();

        sqlRunning =
            false;
    }
}


// ========================================
// PUBLIC API
// ========================================

window.orinSql = {
    run:
        runSqlFile,

    isSqlFile:
        isSqlProjectFile,

    isActiveFileSql:
        isActiveFileSql,

    showResults:
        showSqlResultsPanel,

    hideResults:
        hideSqlResultsPanel,

    clearResults:
        clearSqlResults,

    isRunning:
        function(){
            return sqlRunning;
        }
};


window.runSqlFile =
    runSqlFile;