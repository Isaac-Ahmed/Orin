let lineNum = 0;
let errorEncountered = false;
let currentSourceName = "main.orin";

const modules = Object.create(null);
const objects = Object.create(null);
const variables = Object.create(null);
const variableTypes = Object.create(null);
const userFunctions = Object.create(null);
const sqlDefinitions = Object.create(null);
const userObjectTypes = Object.create(null);

window["orinWindowRuntime"] = {
    values: Object.create(null),

    async run(value){
        if(typeof value !== "string"){
            throw new Error(
                "window action must be a string"
            );
        }

        try {
            return await evaluateExpression(
                value
            );
        }
        catch(error){
            appendTerminalOutput(
                `Window error: ${error.message}\n`
            );

            console.error(error);

            return null;
        }
    },

    register(name, value){
        this.values[name] =
            value;
    },

    get(name){
        return this.values[name];
    },

    getName(value){
        for(const name in this.values){
            if(
                this.values[name] ===
                value
            ){
                return name;
            }
        }

        return null;
    },

    clear(){
        for(const name in this.values){
            delete this.values[name];
        }
    }
};

const scopeStack = [];
const scopeTypeStack = [];

const callableModuleNames = new Set();
const loadedProjectFiles = new Set();
const loadingProjectFiles = new Set();

let conditionControl = null;
let whileControl = null;
let loopControl = null;
let errorControl = null;

let activeLoopDepth = 0;
let activeSwitchDepth = 0;

const builtInTypes = {
    integer: "./object/integer.js",
    double: "./object/double.js",
    string: "./object/string.js",
    boolean: "./object/boolean.js",
    char: "./object/char.js",
    array: "./object/array.js"
};

const standardLibraryModules = {
    "terminal.output" : "./terminal/output.js",
    "terminal.access" : "./terminal/access.js",

    "mathematics.basic" : "./mathematics/basic.js",
    "mathematics.power" : "./mathematics/power.js",
    "mathematics.round" : "./mathematics/round.js",
    "mathematics.compare" : "./mathematics/compare.js",
    "mathematics.random" : "./mathematics/random.js",
    "mathematics.trigonometry" : "./mathematics/trigonometry.js",
    "mathematics.constants" : "./mathematics/constants.js",
    "mathematics.statistics" : "./mathematics/statistics.js",
    "mathematics.numberTheory" : "./mathematics/numberTheory.js",
    "mathematics.probability" : "./mathematics/probability.js",

    "text.general" : "./text/general.js",
    "text.convert" : "./text/convert.js",
    "text.split" : "./text/split.js",
    "text.format" : "./text/format.js",

    "time.general" : "./time/general.js",
    "time.timer" : "./time/timer.js",

    "collections.search" : "./collections/search.js",
    "collections.sort" : "./collections/sort.js",
    "collections.transform" : "./collections/transform.js",

    "data.validation" : "./data/validation.js",
    "data.range" : "./data/range.js",
    "data.inspect" : "./data/inspect.js",
    "data.base" : "./data/base.js",

    "system.debug" : "./system/debug.js",

    "logic.check" : "./logic/check.js",
    "logic.compare" : "./logic/compare.js",
    "logic.conditional" : "./logic/conditional.js",

    "random.choice" : "./random/choice.js",
    "random.generate" : "./random/generate.js",

    "file.create" : "./file/create.js",
    "file.read" : "./file/read.js",
    "file.write" : "./file/write.js",
    "file.delete" : "./file/delete.js",
    "file.content" : "./file/content.js",

    "polynomial.create" : "./polynomial/create.js",
    "polynomial.evaluate" : "./polynomial/evaluate.js",
    "polynomial.modify" : "./polynomial/modify.js",
    
    "graph.terminal" : "./graph/terminal.js",
    "graph.window" : "./graph/window.js",

    "expression.create" : "./expression/create.js",
    "expression.evaluate" : "./expression/evaluate.js",
    "expression.inspect" : "./expression/inspect.js",
    "expression.modify" : "./expression/modify.js",

    "window.page" : "./window/page.js",

    "window.node.button" : "./window/node/button.js",
    "window.node.text" : "./window/node/text.js",
    "window.node.input" : "./window/node/input.js",
    "window.node.textarea" : "./window/node/textarea.js",
    "window.node.radiobutton" : "./window/node/radiobutton.js",
    "window.node.dropdown" : "./window/node/dropdown.js",
    "window.node.list" : "./window/node/list.js",
    "window.node.spreadsheet" : "./window/node/spreadsheet.js",
    "window.node.image" : "./window/node/image.js",
    "window.node.checkbox" : "./window/node/checkbox.js",
    "window.node.shape" : "./window/node/shape.js",
    "window.node.slider" : "./window/node/slider.js",
    "window.node.progressbar" : "./window/node/progressbar.js",

    "window.layout.container" : "./window/layout/container.js",
    "window.layout.column" : "./window/layout/column.js",
    "window.layout.row" : "./window/layout/row.js",
    "window.layout.grid" : "./window/layout/grid.js",

    "database.sql" : "./database/sql.js",
    "database.runner" : "./database/runner.js",
    "database.result" : "./database/result.js"
};

class ReturnSignal {
    constructor(value) {
        this.value = value;
    }
}

class BreakSignal {}

class ContinueSignal {}

// Run the current Orin file
async function runCode() {
    lineNum = 0;
    errorEncountered = false;

    currentSourceName =
        typeof activeFile !== "undefined" && activeFile
            ? activeFile.name
            : "main.orin";

    clearObject(modules);
    clearObject(objects);
    clearObject(variables);
    clearObject(variableTypes);
    clearObject(userFunctions);
    clearObject(sqlDefinitions);    
    clearObject(userObjectTypes);

    if(
        window[
            "orinDatabaseRunnerRuntime"
        ] &&
        typeof window[
            "orinDatabaseRunnerRuntime"
        ].reset ===
            "function"
    ){
        await window[
            "orinDatabaseRunnerRuntime"
        ].reset(
            true
        );
    }

    window["orinWindowRuntime"].clear();

    callableModuleNames.clear();
    loadedProjectFiles.clear();
    loadingProjectFiles.clear();

    scopeStack.length = 0;
    scopeTypeStack.length = 0;

    activeLoopDepth = 0;
    activeSwitchDepth = 0;

    clearTerminalDisplay();

    try {
        await loadControlModules();
        await loadBuiltInTypes();

        if (errorEncountered) {
            return;
        }

        await loadRootProjectFiles();

        if (errorEncountered) {
            return;
        }

        const code =
            editor.getValue();

        await executeSource(
            code,
            currentSourceName
        );
    }
    catch (error) {
        console.error(error);

        if (!errorEncountered) {
            orinError(
                error instanceof ReturnSignal
                    ? "return can only be used inside a function"
                    : error instanceof BreakSignal
                        ? "break can only be used inside a loop or switch"
                        : error instanceof ContinueSignal
                            ? "continue can only be used inside a loop"
                            : errorControl &&
                                error instanceof errorControl.OrinThrownError
                                ? String(
                                    getRawValue(
                                        error.value
                                    )
                                )
                                : error.message,
                error.orinLine
            );
        }
    }
}

// Load core control files automatically
async function loadControlModules() {
    if (
        conditionControl &&
        whileControl &&
        loopControl &&
        errorControl
    ) {
        return;
    }

    [
        conditionControl,
        whileControl,
        loopControl,
        errorControl
    ] = await Promise.all([
        import("./control/conditions.js"),
        import("./control/while.js"),
        import("./control/loops.js"),
        import("./control/errors.js")
    ]);
}

// Clear an object without replacing its reference
function clearObject(object) {
    Object.keys(object).forEach(
        key => delete object[key]
    );
}

// Clear the Monaco terminal
function clearTerminalDisplay() {
    if (
        typeof terminalEditor !== "undefined" &&
        terminalEditor
    ) {
        const model =
            terminalEditor.getModel();

        if (model) {
            model.setValue("");
        }

        return;
    }

    const terminal =
        document.getElementById("terminal");

    if (
        terminal &&
        "value" in terminal
    ) {
        terminal.value = "";
    }
}

// Append text to the terminal even when Monaco is read-only
function appendTerminalOutput(text) {
    if (
        typeof terminalEditor !== "undefined" &&
        terminalEditor
    ) {
        const model =
            terminalEditor.getModel();

        if (!model) {
            return;
        }

        const endPosition =
            model.getPositionAt(
                model.getValueLength()
            );

        model.applyEdits([
            {
                range: new monaco.Range(
                    endPosition.lineNumber,
                    endPosition.column,
                    endPosition.lineNumber,
                    endPosition.column
                ),

                text:
                    String(text),

                forceMoveMarkers:
                    true
            }
        ]);

        const finalPosition =
            model.getPositionAt(
                model.getValueLength()
            );

        terminalEditor.setPosition(
            finalPosition
        );

        terminalEditor.revealPosition(
            finalPosition
        );

        return;
    }

    const terminal =
        document.getElementById("terminal");

    if (
        terminal &&
        "value" in terminal
    ) {
        terminal.value +=
            String(text);
    }
}

// Check whether the user has requested program termination
function executionShouldStop() {
    return (
        typeof shouldEndProgram === "function" &&
        shouldEndProgram()
    );
}

// Load built-in Orin types
async function loadBuiltInTypes() {
    for (
        const typeName in builtInTypes
    ) {
        modules[typeName] =
            await import(
                builtInTypes[typeName]
            );
    }
}

// Execute an Orin source file
async function executeSource(
    source,
    sourceName
) {
    const previousSource =
        currentSourceName;

    const previousLine =
        lineNum;

    currentSourceName =
        sourceName;

    const topLevelLines =
        registerFunctionsFromSource(
            source,
            sourceName
        );

    if (errorEncountered) {
        currentSourceName =
            previousSource;

        lineNum =
            previousLine;

        return;
    }

    try {
        await executeLineObjects(
            topLevelLines,
            false
        );
    }
    catch (error) {
        error.orinLine =
            lineNum;

        throw error;
    }
    finally {
        currentSourceName =
            previousSource;

        lineNum =
            previousLine;
    }
}

// Execute normal statements and core control structures
async function executeLineObjects(
    sourceLines,
    allowReturn
) {
    const textLines =
        sourceLines.map(
            sourceLine =>
                sourceLine.text
        );

    let index = 0;

    while (
        index < sourceLines.length
    ) {
        if (
            errorEncountered ||
            executionShouldStop()
        ) {
            return;
        }

        const sourceLine =
            sourceLines[index];

        lineNum =
            sourceLine.lineNumber;

        const cleanLine =
            sourceLine.text.trim();

        if (
            cleanLine === "" ||
            cleanLine.startsWith("//")
        ) {
            index++;
            continue;
        }

        // if / else if / else
        if (
            conditionControl.isIfStatement(
                cleanLine
            )
        ) {
            index =
                await conditionControl.executeConditionalChain(
                    textLines,
                    index,
                    evaluateExpression,
                    async (
                        body,
                        headerPosition
                    ) => {
                        await executeControlBody(
                            body,
                            sourceLines,
                            headerPosition,
                            allowReturn
                        );
                    }
                );

            continue;
        }

        // while
        const whileMatch =
            cleanLine.match(
                /^while\s*\((.*)\)\s*\{\s*$/
            );

        if (whileMatch) {
            const block =
                readSourceBlock(
                    sourceLines,
                    index,
                    "while"
                );

            activeLoopDepth++;

            try {
                let iterations = 0;

                while (
                    await evaluateBooleanCondition(
                        whileMatch[1]
                    )
                ) {
                    if (
                        errorEncountered ||
                        executionShouldStop()
                    ) {
                        break;
                    }

                    try {
                        await executeLineObjects(
                            block.body,
                            allowReturn
                        );
                    }
                    catch (error) {
                        if (
                            error instanceof BreakSignal
                        ) {
                            break;
                        }

                        if (
                            !(error instanceof ContinueSignal)
                        ) {
                            throw error;
                        }
                    }

                    iterations++;

                    if (
                        iterations % 50 === 0
                    ) {
                        await yieldToBrowser();
                    }
                }
            }
            finally {
                activeLoopDepth--;
            }

            index =
                block.endIndex + 1;

            continue;
        }

        // repeat
        const repeatMatch =
            cleanLine.match(
                /^repeat\s*\((.*)\)\s*\{\s*$/
            );

        if (repeatMatch) {
            const block =
                readSourceBlock(
                    sourceLines,
                    index,
                    "repeat"
                );

            const repeatValue =
                getRawValue(
                    await evaluateExpression(
                        repeatMatch[1]
                    )
                );

            if (
                !Number.isSafeInteger(
                    repeatValue
                ) ||
                repeatValue < 0
            ) {
                throw new Error(
                    "repeat amount must be a non-negative integer"
                );
            }

            activeLoopDepth++;

            try {
                for (
                    let iteration = 0;
                    iteration < repeatValue;
                    iteration++
                ) {
                    if (
                        errorEncountered ||
                        executionShouldStop()
                    ) {
                        break;
                    }

                    try {
                        await executeLineObjects(
                            block.body,
                            allowReturn
                        );
                    }
                    catch (error) {
                        if (
                            error instanceof BreakSignal
                        ) {
                            break;
                        }

                        if (
                            !(error instanceof ContinueSignal)
                        ) {
                            throw error;
                        }
                    }

                    if (
                        (iteration + 1) % 50 === 0
                    ) {
                        await yieldToBrowser();
                    }
                }
            }
            finally {
                activeLoopDepth--;
            }

            index =
                block.endIndex + 1;

            continue;
        }

        // for
        const forMatch =
            cleanLine.match(
                /^for\s*\((.*)\)\s*\{\s*$/
            );

        if (forMatch) {
            const block =
                readSourceBlock(
                    sourceLines,
                    index,
                    "for"
                );

            const parts =
                splitForHeader(
                    forMatch[1]
                );

            if (
                parts.length !== 3
            ) {
                throw new Error(
                    "for statement must contain an initializer, condition and update"
                );
            }

            scopeStack.push({});
            scopeTypeStack.push({});
            activeLoopDepth++;

            try {
                if (
                    parts[0].trim() !== ""
                ) {
                    await parse(
                        ensureSemicolon(
                            parts[0]
                        ),
                        allowReturn
                    );
                }

                let iterations = 0;

                while (
                    parts[1].trim() === "" ||
                    await evaluateBooleanCondition(
                        parts[1]
                    )
                ) {
                    if (
                        errorEncountered ||
                        executionShouldStop()
                    ) {
                        break;
                    }

                    let shouldBreak = false;

                    try {
                        await executeLineObjects(
                            block.body,
                            allowReturn
                        );
                    }
                    catch (error) {
                        if (
                            error instanceof BreakSignal
                        ) {
                            shouldBreak = true;
                        }
                        else if (
                            !(error instanceof ContinueSignal)
                        ) {
                            throw error;
                        }
                    }

                    if (shouldBreak) {
                        break;
                    }

                    if (
                        parts[2].trim() !== ""
                    ) {
                        await parse(
                            ensureSemicolon(
                                parts[2]
                            ),
                            allowReturn
                        );
                    }

                    iterations++;

                    if (
                        iterations % 50 === 0
                    ) {
                        await yieldToBrowser();
                    }
                }
            }
            finally {
                activeLoopDepth--;
                scopeStack.pop();
                scopeTypeStack.pop();
            }

            index =
                block.endIndex + 1;

            continue;
        }

        // try / catch / finally
        if (
            errorControl.isTryStatement(
                cleanLine
            )
        ) {
            index =
                await executeTryChain(
                    sourceLines,
                    index,
                    allowReturn
                );

            continue;
        }

        // switch
        const switchMatch =
            cleanLine.match(
                /^switch\s*\((.*)\)\s*\{\s*$/
            );

        if (switchMatch) {
            const block =
                readSourceBlock(
                    sourceLines,
                    index,
                    "switch"
                );

            await executeSwitchBlock(
                switchMatch[1],
                block.body,
                allowReturn
            );

            index =
                block.endIndex + 1;

            continue;
        }

        // Stray else statements are invalid
        if (
            conditionControl.isElseIfStatement(
                cleanLine
            ) ||
            conditionControl.isElseStatement(
                cleanLine
            )
        ) {
            throw new Error(
                `'${cleanLine.startsWith("else if")
                    ? "else if"
                    : "else"}' has no matching if`
            );
        }

        // Stray error-chain statements are invalid
        if (
            errorControl.isCatchStatement(
                cleanLine
            ) ||
            errorControl.isFinallyStatement(
                cleanLine
            )
        ) {
            throw new Error(
                `'${cleanLine.startsWith("catch")
                    ? "catch"
                    : "finally"}' has no matching try`
            );
        }

        await parse(
            cleanLine,
            allowReturn
        );

        index++;
    }
}

// Find the next non-empty, non-comment source line
function nextExecutableLineIndex(
    sourceLines,
    startIndex
) {
    for (
        let i = startIndex;
        i < sourceLines.length;
        i++
    ) {
        const cleanLine =
            sourceLines[i].text.trim();

        if (
            cleanLine !== "" &&
            !cleanLine.startsWith("//")
        ) {
            return i;
        }
    }

    return -1;
}

// Convert a caught runtime error into an Orin value
function getCaughtErrorValue(error) {
    if (
        errorControl &&
        error instanceof errorControl.OrinThrownError
    ) {
        return error.value;
    }

    if (
        error instanceof Error
    ) {
        return error.message;
    }

    return error;
}

// Execute try / catch / finally as one control chain
async function executeTryChain(
    sourceLines,
    tryIndex,
    allowReturn
) {
    const tryBlock =
        readSourceBlock(
            sourceLines,
            tryIndex,
            "try"
        );

    let nextIndex =
        nextExecutableLineIndex(
            sourceLines,
            tryBlock.endIndex + 1
        );

    let catchBlock = null;
    let catchVariableName = null;
    let finallyBlock = null;

    if (
        nextIndex !== -1 &&
        errorControl.isCatchStatement(
            sourceLines[nextIndex].text.trim()
        )
    ) {
        const catchInfo =
            errorControl.parseCatchStatement(
                sourceLines[nextIndex].text.trim()
            );

        catchVariableName =
            catchInfo.variableName;

        catchBlock =
            readSourceBlock(
                sourceLines,
                nextIndex,
                "catch"
            );

        nextIndex =
            nextExecutableLineIndex(
                sourceLines,
                catchBlock.endIndex + 1
            );
    }

    if (
        nextIndex !== -1 &&
        errorControl.isFinallyStatement(
            sourceLines[nextIndex].text.trim()
        )
    ) {
        finallyBlock =
            readSourceBlock(
                sourceLines,
                nextIndex,
                "finally"
            );
    }

    if (
        catchBlock === null &&
        finallyBlock === null
    ) {
        throw new Error(
            "try must be followed by catch or finally"
        );
    }

    let caughtError = null;

    try {
        await executeLineObjects(
            tryBlock.body,
            allowReturn
        );
    }
    catch (error) {
        caughtError = error;

        const isControlSignal =
            error instanceof ReturnSignal ||
            error instanceof BreakSignal ||
            error instanceof ContinueSignal;

        if (
            catchBlock !== null &&
            !isControlSignal
        ) {
            scopeStack.push({});
            scopeTypeStack.push({});

            try {
                storeVariable(
                    catchVariableName,
                    getCaughtErrorValue(
                        error
                    ),
                    null
                );

                await executeLineObjects(
                    catchBlock.body,
                    allowReturn
                );

                caughtError = null;
            }
            finally {
                scopeStack.pop();
                scopeTypeStack.pop();
            }
        }
    }
    finally {
        if (
            finallyBlock !== null
        ) {
            await executeLineObjects(
                finallyBlock.body,
                allowReturn
            );
        }
    }

    if (
        caughtError !== null
    ) {
        throw caughtError;
    }

    if (
        finallyBlock !== null
    ) {
        return finallyBlock.endIndex + 1;
    }

    return catchBlock.endIndex + 1;
}

// Execute a block returned by one of the control modules
async function executeControlBody(
    body,
    parentSourceLines,
    headerPosition,
    allowReturn
) {
    const headerIndex =
        Math.max(
            0,
            headerPosition - 1
        );

    const headerLineNumber =
        parentSourceLines[headerIndex]
            ? parentSourceLines[headerIndex].lineNumber
            : lineNum;

    const bodyLines =
        body.map(
            (text, index) => ({
                text:
                    text,

                lineNumber:
                    headerLineNumber +
                    index +
                    1
            })
        );

    await executeLineObjects(
        bodyLines,
        allowReturn
    );
}

// Read a brace-based control block from source-line objects
function readSourceBlock(
    sourceLines,
    startIndex,
    description
) {
    const body = [];
    let braceDepth = 1;

    for (
        let i = startIndex + 1;
        i < sourceLines.length;
        i++
    ) {
        const sourceLine =
            sourceLines[i];

        braceDepth +=
            countBraceChange(
                sourceLine.text
            );

        if (
            braceDepth <= 0
        ) {
            return {
                body:
                    body,

                endIndex:
                    i
            };
        }

        body.push(
            sourceLine
        );
    }

    throw new Error(
        `${description} is missing a closing brace`
    );
}

// Split the three sections of a for header
function splitForHeader(text) {
    const parts = [];
    let current = "";
    let quote = null;
    let escaped = false;
    let parentheses = 0;

    for (
        let i = 0;
        i < text.length;
        i++
    ) {
        const char =
            text[i];

        if (
            quote !== null
        ) {
            current += char;

            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote = char;
            current += char;
            continue;
        }

        if (
            char === "("
        ) {
            parentheses++;
            current += char;
            continue;
        }

        if (
            char === ")"
        ) {
            parentheses--;
            current += char;
            continue;
        }

        if (
            char === ";" &&
            parentheses === 0
        ) {
            parts.push(
                current.trim()
            );

            current = "";
            continue;
        }

        current += char;
    }

    parts.push(
        current.trim()
    );

    return parts;
}

// Add a semicolon when a for component needs one
function ensureSemicolon(statement) {
    const clean =
        statement.trim();

    if (
        clean.endsWith(";")
    ) {
        return clean;
    }

    return clean + ";";
}

// Yield occasionally so End can interrupt long loops
async function yieldToBrowser() {
    await new Promise(
        resolve =>
            setTimeout(
                resolve,
                0
            )
    );
}

// Evaluate an Orin boolean condition
async function evaluateBooleanCondition(
    expression
) {
    expression =
        stripExpressionOuterParentheses(
            expression.trim()
        );

    const orParts =
        splitTopLevelCondition(
            expression,
            "|"
        );

    if (
        orParts.length > 1
    ) {
        for (
            const part
            of orParts
        ) {
            if (
                await evaluateBooleanCondition(
                    part
                )
            ) {
                return true;
            }
        }

        return false;
    }

    const andParts =
        splitTopLevelCondition(
            expression,
            "&"
        );

    if (
        andParts.length > 1
    ) {
        for (
            const part
            of andParts
        ) {
            if (
                !await evaluateBooleanCondition(
                    part
                )
            ) {
                return false;
            }
        }

        return true;
    }

    if (
        expression.startsWith("!")
    ) {
        return !await evaluateBooleanCondition(
            expression.slice(1)
        );
    }

    const comparison =
        findTopLevelComparison(
            expression
        );

    if (comparison) {
        const left =
            getRawValue(
                await evaluateExpression(
                    expression.slice(
                        0,
                        comparison.index
                    )
                )
            );

        const right =
            getRawValue(
                await evaluateExpression(
                    expression.slice(
                        comparison.index +
                        comparison.operator.length
                    )
                )
            );

        switch (
            comparison.operator
        ) {
            case "==":
                return left === right;

            case "!=":
                return left !== right;

            case ">=":
                return left >= right;

            case "<=":
                return left <= right;

            case ">":
                return left > right;

            case "<":
                return left < right;
        }
    }

    return Boolean(
        getRawValue(
            await evaluateExpression(
                expression
            )
        )
    );
}

// Split a boolean condition at a top-level operator
function splitTopLevelCondition(
    expression,
    operator
) {
    const parts = [];

    let current = "";
    let quote = null;
    let escaped = false;
    let depth = 0;

    for (
        let i = 0;
        i < expression.length;
        i++
    ) {
        const char =
            expression[i];

        if (
            quote !== null
        ) {
            current += char;

            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote = char;
            current += char;
            continue;
        }

        if (
            char === "("
        ) {
            depth++;
            current += char;
            continue;
        }

        if (
            char === ")"
        ) {
            depth--;
            current += char;
            continue;
        }

        if (
            depth === 0 &&
            char === operator
        ) {
            parts.push(
                current.trim()
            );

            current = "";
            continue;
        }

        current += char;
    }

    parts.push(
        current.trim()
    );

    return parts;
}

// Find a comparison outside strings and parentheses
function findTopLevelComparison(
    expression
) {
    const operators = [
        "==",
        "!=",
        ">=",
        "<=",
        ">",
        "<"
    ];

    let quote = null;
    let escaped = false;
    let depth = 0;

    for (
        let i = 0;
        i < expression.length;
        i++
    ) {
        const char =
            expression[i];

        if (
            quote !== null
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote = char;
            continue;
        }

        if (
            char === "("
        ) {
            depth++;
            continue;
        }

        if (
            char === ")"
        ) {
            depth--;
            continue;
        }

        if (
            depth !== 0
        ) {
            continue;
        }

        for (
            const operator
            of operators
        ) {
            if (
                expression.startsWith(
                    operator,
                    i
                )
            ) {
                return {
                    operator:
                        operator,

                    index:
                        i
                };
            }
        }
    }

    return null;
}

// Execute a switch statement
async function executeSwitchBlock(
    expression,
    body,
    allowReturn
) {
    const switchValue =
        getRawValue(
            await evaluateExpression(
                expression
            )
        );

    const cases = [];
    let defaultCase = null;

    for (
        let i = 0;
        i < body.length;
        i++
    ) {
        const sourceLine =
            body[i];

        const cleanLine =
            sourceLine.text.trim();

        if (
            cleanLine === "" ||
            cleanLine.startsWith("//")
        ) {
            continue;
        }

        const caseMatch =
            cleanLine.match(
                /^case\s+(.+?)\s*\{\s*$/
            );

        if (caseMatch) {
            const block =
                readSourceBlock(
                    body,
                    i,
                    "case"
                );

            cases.push({
                expression:
                    caseMatch[1],

                body:
                    block.body
            });

            i =
                block.endIndex;

            continue;
        }

        if (
            /^default\s*\{\s*$/.test(
                cleanLine
            )
        ) {
            if (
                defaultCase !== null
            ) {
                throw new Error(
                    "switch can only contain one default block"
                );
            }

            const block =
                readSourceBlock(
                    body,
                    i,
                    "default"
                );

            defaultCase =
                block.body;

            i =
                block.endIndex;

            continue;
        }

        throw new Error(
            `invalid switch member '${cleanLine}'`
        );
    }

    let selectedBody =
        defaultCase;

    for (
        const caseDefinition
        of cases
    ) {
        const caseValue =
            getRawValue(
                await evaluateExpression(
                    caseDefinition.expression
                )
            );

        if (
            switchValue === caseValue
        ) {
            selectedBody =
                caseDefinition.body;

            break;
        }
    }

    if (
        selectedBody === null
    ) {
        return;
    }

    activeSwitchDepth++;

    try {
        await executeLineObjects(
            selectedBody,
            allowReturn
        );
    }
    catch (error) {
        if (
            !(error instanceof BreakSignal)
        ) {
            throw error;
        }
    }
    finally {
        activeSwitchDepth--;
    }
}

// Find and register user-defined functions and objects
// Find and register user-defined functions, SQL definitions and objects
function registerFunctionsFromSource(
    source,
    sourceName
) {
    const lines =
        source.split(/\r?\n/);

    const topLevelLines = [];


    const sqlEnabled =
        lines.some(
            line =>
                /^\s*import\s+database\.sql\s*;\s*$/.test(
                    line
                )
        );


    for (
        let i = 0;
        i < lines.length;
        i++
    ) {
        const originalLine =
            lines[i];

        const cleanLine =
            originalLine.trim();


        // Object definition
        const objectMatch =
            cleanLine.match(
                /^define\s+object\s+([A-Za-z_$][\w$]*)\s*\{$/
            );

        if (objectMatch) {
            const objectName =
                objectMatch[1];

            const result =
                readDefinitionBlock(
                    lines,
                    i,
                    `object '${objectName}'`
                );

            if (!result) {
                return [];
            }

            registerUserObjectType(
                objectName,
                result.body,
                sourceName
            );

            if (errorEncountered) {
                return [];
            }

            i =
                result.endIndex;

            continue;
        }


        // SQL definition
        const sqlMatch =
            cleanLine.match(
                /^define\s+sql\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{$/
            );

        if (sqlMatch) {
            if (!sqlEnabled) {
                lineNum =
                    i + 1;

                orinError(
                    "'define sql' requires 'database.sql' to be imported"
                );

                return [];
            }


            const sqlName =
                sqlMatch[1];

            const parameterText =
                sqlMatch[2]
                    .trim();

            const parameters =
                parseFunctionParameters(
                    parameterText
                );

            if (
                parameters === null
            ) {
                return [];
            }


            const result =
                readDefinitionBlock(
                    lines,
                    i,
                    `SQL definition '${sqlName}'`
                );

            if (!result) {
                return [];
            }


            registerSQLDefinition(
                sqlName,
                parameters,
                result.body,
                sourceName,
                i + 1
            );

            if (errorEncountered) {
                return [];
            }


            i =
                result.endIndex;

            continue;
        }


        // Function definition
        const functionMatch =
            cleanLine.match(
                /^define\s+function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{$/
            );

        if (!functionMatch) {
            topLevelLines.push({
                text:
                    originalLine,

                lineNumber:
                    i + 1
            });

            continue;
        }


        const functionName =
            functionMatch[1];

        const parameterText =
            functionMatch[2]
                .trim();

        const parameters =
            parseFunctionParameters(
                parameterText
            );

        if (
            parameters === null
        ) {
            return [];
        }


        const result =
            readDefinitionBlock(
                lines,
                i,
                `function '${functionName}'`
            );

        if (!result) {
            return [];
        }


        registerUserFunction(
            functionName,
            parameters,
            result.body,
            sourceName
        );

        if (errorEncountered) {
            return [];
        }


        i =
            result.endIndex;
    }


    return topLevelLines;
}

// Read a brace-based definition
function readDefinitionBlock(
    lines,
    startIndex,
    description
) {
    const body = [];

    let braceDepth = 1;

    for (
        let i = startIndex + 1;
        i < lines.length;
        i++
    ) {
        const line =
            lines[i];

        braceDepth +=
            countBraceChange(
                line
            );

        if (
            braceDepth <= 0
        ) {
            return {
                body:
                    body,

                endIndex:
                    i
            };
        }

        body.push({
            text:
                line,

            lineNumber:
                i + 1
        });
    }

    lineNum =
        startIndex + 1;

    orinError(
        `${description} is missing a closing brace`
    );

    return null;
}

// Register a user-defined object type
function registerUserObjectType(
    name,
    body,
    sourceName
) {
    if (
        userObjectTypes[name] !==
        undefined
    ) {
        orinError(
            `object '${name}' has already been defined`
        );

        return;
    }

    if (
        userFunctions[name] !==
        undefined
    ) {
        orinError(
            `name '${name}' is already in use`
        );

        return;
    }

    const fields = {};
    const methods = {};

    let constructorDefinition =
        null;

    for (
        let i = 0;
        i < body.length;
        i++
    ) {
        const sourceLine =
            body[i];

        const cleanLine =
            sourceLine.text.trim();

        if (
            cleanLine === "" ||
            cleanLine.startsWith("//")
        ) {
            continue;
        }

        // Field
        const fieldMatch =
            cleanLine.match(
                /^create\s+(private|public)\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*)\s*;$/
            );

        if (fieldMatch) {
            const visibility =
                fieldMatch[1];

            const type =
                fieldMatch[2];

            const fieldName =
                fieldMatch[3];

            if (
                fields[fieldName] !==
                undefined
            ) {
                lineNum =
                    sourceLine.lineNumber;

                orinError(
                    `field '${fieldName}' has already been defined`
                );

                return;
            }

            fields[fieldName] = {
                name:
                    fieldName,

                type:
                    type,

                visibility:
                    visibility
            };

            continue;
        }

        // Constructor
        const constructorMatch =
            cleanLine.match(
                /^constructor\s*\(([^)]*)\)\s*\{$/
            );

        if (constructorMatch) {
            if (
                constructorDefinition !==
                null
            ) {
                lineNum =
                    sourceLine.lineNumber;

                orinError(
                    `object '${name}' can only have one constructor`
                );

                return;
            }

            const parameters =
                parseFunctionParameters(
                    constructorMatch[1]
                        .trim()
                );

            if (
                parameters === null
            ) {
                return;
            }

            const result =
                readObjectMemberBlock(
                    body,
                    i,
                    "constructor"
                );

            if (!result) {
                return;
            }

            constructorDefinition = {
                parameters:
                    parameters,

                body:
                    result.body,

                sourceName:
                    sourceName
            };

            i =
                result.endIndex;

            continue;
        }

        // Method
        const methodMatch =
            cleanLine.match(
                /^define\s+function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{$/
            );

        if (methodMatch) {
            const methodName =
                methodMatch[1];

            if (
                methods[methodName] !==
                undefined
            ) {
                lineNum =
                    sourceLine.lineNumber;

                orinError(
                    `method '${methodName}' has already been defined`
                );

                return;
            }

            const parameters =
                parseFunctionParameters(
                    methodMatch[2]
                        .trim()
                );

            if (
                parameters === null
            ) {
                return;
            }

            const result =
                readObjectMemberBlock(
                    body,
                    i,
                    `method '${methodName}'`
                );

            if (!result) {
                return;
            }

            methods[methodName] = {
                name:
                    methodName,

                parameters:
                    parameters,

                body:
                    result.body,

                sourceName:
                    sourceName
            };

            i =
                result.endIndex;

            continue;
        }

        lineNum =
            sourceLine.lineNumber;

        orinError(
            `invalid object member '${cleanLine}'`
        );

        return;
    }

    userObjectTypes[name] = {
        name:
            name,

        fields:
            fields,

        constructor:
            constructorDefinition,

        methods:
            methods,

        sourceName:
            sourceName
    };
}

// Read a constructor or method body
function readObjectMemberBlock(
    body,
    startIndex,
    description
) {
    const memberBody = [];

    let braceDepth = 1;

    for (
        let i = startIndex + 1;
        i < body.length;
        i++
    ) {
        const sourceLine =
            body[i];

        braceDepth +=
            countBraceChange(
                sourceLine.text
            );

        if (
            braceDepth <= 0
        ) {
            return {
                body:
                    memberBody,

                endIndex:
                    i
            };
        }

        memberBody.push(
            sourceLine
        );
    }

    lineNum =
        body[startIndex]
            .lineNumber;

    orinError(
        `${description} is missing a closing brace`
    );

    return null;
}

// Parse function/method/constructor parameters
function parseFunctionParameters(
    parameterText
) {
    if (
        parameterText === ""
    ) {
        return [];
    }

    const rawParameters =
        parameterText.split(",");

    const parameters = [];

    for (
        const rawParameter
        of rawParameters
    ) {
        const parameter =
            rawParameter.trim();

        const match =
            parameter.match(
                /^(?:([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+)?([A-Za-z_$][\w$]*)$/
            );

        if (!match) {
            orinError(
                `invalid function parameter '${parameter}'`
            );

            return null;
        }

        const type =
            match[1] || null;

        const name =
            match[2];

        if (
            parameters.some(
                existing =>
                    existing.name === name
            )
        ) {
            orinError(
                `duplicate function parameter '${name}'`
            );

            return null;
        }

        parameters.push({
            type:
                type,

            name:
                name
        });
    }

    return parameters;
}

// Register a user-defined SQL definition
function registerSQLDefinition(
    name,
    parameters,
    body,
    sourceName,
    definitionLine
) {
    if (
        sqlDefinitions[name] !==
        undefined
    ) {
        orinError(
            `SQL definition '${name}' has already been defined`,
            definitionLine
        );

        return;
    }


    if (
        userFunctions[name] !==
            undefined ||
        userObjectTypes[name] !==
            undefined
    ) {
        orinError(
            `name '${name}' is already in use`,
            definitionLine
        );

        return;
    }


    const source =
        body
            .map(
                sourceLine =>
                    sourceLine.text
            )
            .join("\n");


    sqlDefinitions[name] = {
        __orinSQLDefinition:
            true,

        __orinModuleType:
            "database.sql",

        name:
            name,

        parameters:
            parameters.map(
                parameter =>
                    parameter.name
            ),

        source:
            source,

        sourceName:
            sourceName
    };
}

// Register a user-defined function
function registerUserFunction(
    name,
    parameters,
    body,
    sourceName
) {
    if (
        userFunctions[name] !==
        undefined
    ) {
        orinError(
            `function '${name}' has already been defined`
        );

        return;
    }

    userFunctions[name] = {
        name:
            name,

        parameters:
            parameters,

        body:
            body,

        sourceName:
            sourceName
    };
}

// Count braces while ignoring strings, chars and comments
function countBraceChange(text) {
    let change = 0;
    let quote = null;
    let escaped = false;

    for (
        let i = 0;
        i < text.length;
        i++
    ) {
        const char =
            text[i];

        if (
            quote !== null
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote =
                char;

            continue;
        }

        if (
            char === "/" &&
            text[i + 1] === "/"
        ) {
            break;
        }

        if (
            char === "{"
        ) {
            change++;
        }
        else if (
            char === "}"
        ) {
            change--;
        }
    }

    return change;
}

// Parse one simple statement
async function parse(
    line,
    allowReturn = false
) {
    if (
        line === "break;"
    ) {
        if (
            activeLoopDepth === 0 &&
            activeSwitchDepth === 0
        ) {
            throw new Error(
                "break can only be used inside a loop or switch"
            );
        }

        throw new BreakSignal();
    }

    if (
        line === "continue;"
    ) {
        if (
            activeLoopDepth === 0
        ) {
            throw new Error(
                "continue can only be used inside a loop"
            );
        }

        throw new ContinueSignal();
    }

    if (
        errorControl.isThrowStatement(
            line
        )
    ) {
        const throwInfo =
            errorControl.parseThrowStatement(
                line
            );

        if (
            throwInfo.expression === null
        ) {
            throw new Error(
                "throw requires a value"
            );
        }

        throw new errorControl.OrinThrownError(
            await evaluateExpression(
                throwInfo.expression
            )
        );
    }

    if (
        line.startsWith("import ")
    ) {
        await parseImport(
            line
        );

        return;
    }

    if (
        line.startsWith("create ")
    ) {
        await parseCreate(
            line
        );

        return;
    }

    const returnMatch =
        line.match(
            /^return(?:\s+(.+))?;$/
        );

    if (returnMatch) {
        if (!allowReturn) {
            throw new Error(
                "return can only be used inside a function"
            );
        }

        const returnExpression =
            returnMatch[1];

        if (
            returnExpression ===
            undefined
        ) {
            throw new ReturnSignal(
                null
            );
        }

        throw new ReturnSignal(
            await evaluateExpression(
                returnExpression
            )
        );
    }

    const fieldAssignmentMatch =
        line.match(
            /^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*=\s*(\S(?:.*\S)?);$/
        );

    if (fieldAssignmentMatch) {
        await parseObjectFieldAssignment(
            fieldAssignmentMatch[1],
            fieldAssignmentMatch[2],
            fieldAssignmentMatch[3]
        );

        return;
    }

    const assignmentMatch =
        line.match(
            /^([A-Za-z_$][\w$]*)\s*=\s*(\S(?:.*\S)?);$/
        );

    if (assignmentMatch) {
        await parseAssignment(
            assignmentMatch[1],
            assignmentMatch[2]
        );

        return;
    }

    if (
        isFunctionCall(
            line
        )
    ) {
        await evaluateExpression(
            removeSemicolon(
                line
            )
        );

        return;
    }

    throw new Error(
        "unknown command"
    );
}

// Handle imports
async function parseImport(line) {
    const match =
        line.match(
            /^import\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*);$/
        );

    if (!match) {
        throw new Error(
            "invalid import"
        );
    }

    const importName =
        match[1];

    const projectImported =
        await tryImportProjectPath(
            importName
        );

    if (projectImported) {
        return;
    }

    if (
        standardLibraryModules[
            importName
        ]
    ) {
        await importStandardModule(
            importName
        );

        return;
    }

    const folderModules =
        getStandardFolderModules(
            importName
        );

    if (
        folderModules.length > 0
    ) {
        for (
            const moduleName
            of folderModules
        ) {
            await importStandardModule(
                moduleName
            );

            if (errorEncountered) {
                return;
            }
        }

        return;
    }

    throw new Error(
        `unable to import '${importName}'`
    );
}

// Import one standard-library JavaScript module
async function importStandardModule(
    moduleName
) {
    if (
        callableModuleNames.has(
            moduleName
        )
    ) {
        return;
    }

    const location =
        standardLibraryModules[
            moduleName
        ];

    if (!location) {
        throw new Error(
            `standard module '${moduleName}' does not exist`
        );
    }

    const module =
        await import(
            location
        );

    modules[moduleName] =
        module;

    callableModuleNames.add(
        moduleName
    );
}

// Get direct child modules of a standard-library folder
function getStandardFolderModules(
    folderName
) {
    const prefix =
        folderName + ".";

    const matches = [];

    for (
        const moduleName
        in standardLibraryModules
    ) {
        if (
            !moduleName.startsWith(
                prefix
            )
        ) {
            continue;
        }

        const remaining =
            moduleName.slice(
                prefix.length
            );

        if (
            !remaining.includes(".")
        ) {
            matches.push(
                moduleName
            );
        }
    }

    return matches;
}

function setModuleValueType(
    value,
    typeName
){
    if(
        value !== null &&
        typeof value === "object" &&
        builtInTypes[typeName] ===
            undefined
    ){
        value.__orinModuleType =
            typeName;
    }

    return value;
}

function isModuleValueType(
    value,
    typeName
){
    return (
        value !== null &&
        typeof value === "object" &&
        value.__orinModuleType ===
            typeName
    );
}

// Attempt to import a project path
async function tryImportProjectPath(
    importName
) {
    if (
        typeof orinProject === "undefined" ||
        !orinProject
    ) {
        return false;
    }

    const target =
        resolveProjectPath(
            importName
        );

    if (!target) {
        return false;
    }

    if (
        target.type === "file"
    ) {
        await loadProjectFileDefinitions(
            target
        );

        return true;
    }

    if (
        target.type === "folder"
    ) {
        await loadProjectFolder(
            target
        );

        return true;
    }

    return false;
}

// Resolve dotted project imports
function resolveProjectPath(
    importName
) {
    const parts =
        importName.split(".");

    let current =
        orinProject;

    for (
        let i = 0;
        i < parts.length;
        i++
    ) {
        if (
            current.type !== "folder" ||
            !Array.isArray(
                current.children
            )
        ) {
            return null;
        }

        const part =
            parts[i];

        const isFinal =
            i ===
            parts.length - 1;

        if (!isFinal) {
            const folder =
                current.children.find(
                    child =>
                        child.type === "folder" &&
                        child.name === part
                );

            if (!folder) {
                return null;
            }

            current =
                folder;

            continue;
        }

        const folder =
            current.children.find(
                child =>
                    child.type === "folder" &&
                    child.name === part
            );

        if (folder) {
            return folder;
        }

        const file =
            current.children.find(
                child =>
                    child.type === "file" &&
                    (
                        child.name === part ||
                        child.name ===
                            `${part}.orin`
                    )
            );

        return (
            file ||
            null
        );
    }

    return current;
}

// Import every direct Orin file in a folder
async function loadProjectFolder(
    folder
) {
    for (
        const child
        of folder.children
    ) {
        if (
            child.type !== "file" ||
            !child.name.endsWith(".orin")
        ) {
            continue;
        }

        await loadProjectFileDefinitions(
            child
        );

        if (errorEncountered) {
            return;
        }
    }
}

// Register definitions/imports from one project file
async function loadProjectFileDefinitions(
    file
) {
    if (
        loadedProjectFiles.has(
            file.id
        ) ||
        loadingProjectFiles.has(
            file.id
        )
    ) {
        return;
    }

    loadingProjectFiles.add(
        file.id
    );

    const previousSource =
        currentSourceName;

    const previousLine =
        lineNum;

    currentSourceName =
        file.name;

    try {
        const topLevelLines =
            registerFunctionsFromSource(
                file.content || "",
                file.name
            );

        if (!errorEncountered) {
            for (
                const sourceLine
                of topLevelLines
            ) {
                const cleanLine =
                    sourceLine.text.trim();

                if (
                    !cleanLine.startsWith(
                        "import "
                    )
                ) {
                    continue;
                }

                lineNum =
                    sourceLine.lineNumber;

                await parseImport(
                    cleanLine
                );
            }
        }

        loadedProjectFiles.add(
            file.id
        );
    }
    finally {
        loadingProjectFiles.delete(
            file.id
        );

        currentSourceName =
            previousSource;

        lineNum =
            previousLine;
    }
}

// Load root project files automatically
async function loadRootProjectFiles() {
    if (
        typeof orinProject === "undefined" ||
        !orinProject ||
        !Array.isArray(
            orinProject.children
        )
    ) {
        return;
    }

    for (
        const child
        of orinProject.children
    ) {
        if (
            child.type !== "file" ||
            !child.name.endsWith(".orin")
        ) {
            continue;
        }

        if (
            typeof activeFile !== "undefined" &&
            activeFile &&
            child.id === activeFile.id
        ) {
            continue;
        }

        await loadProjectFileDefinitions(
            child
        );

        if (errorEncountered) {
            return;
        }
    }
}

// Handle creation
async function parseCreate(line) {
    const valueMatch =
        line.match(
            /^create\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*)\s*=\s*(\S(?:.*\S)?);$/
        );

    if (valueMatch) {
        const typeName =
            valueMatch[1];

        const variableName =
            valueMatch[2];

        const expression =
            valueMatch[3];

        if (
            userObjectTypes[typeName] !==
            undefined
        ) {
            if (
                nameTaken(
                    variableName
                )
            ) {
                throw new Error(
                    `name '${variableName}' is already in use`
                );
            }

            const value =
                await evaluateExpression(
                    expression
                );

            if (
                value !== null &&
                (
                    !isUserObjectInstance(
                        value
                    ) ||
                    value.__orinTypeName !==
                        typeName
                )
            ) {
                throw new Error(
                    `value must be ${typeName}`
                );
            }

            storeVariable(
                variableName,
                value,
                typeName
            );

            return;
        }

        if (
            !modules[typeName]
        ) {
            throw new Error(
                `type or module '${typeName}' does not exist`
            );
        }

        if (
            typeof modules[typeName].create !==
            "function"
        ) {
            throw new Error(
                `'${typeName}' cannot create values`
            );
        }

        if (
            nameTaken(
                variableName
            )
        ) {
            throw new Error(
                `name '${variableName}' is already in use`
            );
        }

        const value =
            await evaluateExpression(
                expression
            );

        let createdValue =
            value === null
                ? null
                : await modules[
                    typeName
                ].create(
                    value
                );

        createdValue =
            setModuleValueType(
                createdValue,
                typeName
            );

        storeVariable(
            variableName,
            createdValue,
            typeName
        );

        return;
    }

    const objectMatch =
        line.match(
            /^create\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*);$/
        );

    if (!objectMatch) {
        throw new Error(
            "invalid create statement"
        );
    }

    const moduleName =
        objectMatch[1];

    const objectName =
        objectMatch[2];

    if (
        !modules[moduleName]
    ) {
        throw new Error(
            `module '${moduleName}' has not been imported`
        );
    }

    if (
        nameTaken(
            objectName
        )
    ) {
        throw new Error(
            `name '${objectName}' is already in use`
        );
    }

    if (
        typeof modules[moduleName].create ===
        "function"
    ) {
        let createdValue =
            await modules[
                moduleName
            ].create();

        createdValue =
            setModuleValueType(
                createdValue,
                moduleName
            );

        storeVariable(
            objectName,
            createdValue,
            moduleName
        );

        return;
    }

    objects[objectName] =
        modules[moduleName];
}

// Assign an existing variable
async function parseAssignment(
    variableName,
    expression
) {
    const variable =
        findVariable(
            variableName
        );

    if (!variable.found) {
        throw new Error(
            `variable '${variableName}' does not exist`
        );
    }

    const value =
        await evaluateExpression(
            expression
        );

    await assignVariable(
        variableName,
        value
    );
}

// Assign a field on a user object
async function parseObjectFieldAssignment(
    receiverName,
    fieldName,
    expression
) {
    const receiverVariable =
        findVariable(
            receiverName
        );

    if (
        !receiverVariable.found ||
        !isUserObjectInstance(
            receiverVariable.value
        )
    ) {
        throw new Error(
            `object '${receiverName}' does not exist`
        );
    }

    const value =
        await evaluateExpression(
            expression
        );

    await setUserObjectField(
        receiverVariable.value,
        fieldName,
        value,
        receiverName === "this"
    );
}

// Evaluate an Orin expression
// Evaluate an Orin expression
async function evaluateExpression(
    expression
) {
    expression =
        expression.trim();

    if (
        expression === ""
    ) {
        throw new Error(
            "expression cannot be empty"
        );
    }

    expression =
        stripExpressionOuterParentheses(
            expression
        );

    // Array literal
    if (
        expression.startsWith("[") &&
        expression.endsWith("]")
    ) {
        const contents =
            expression
                .slice(
                    1,
                    -1
                )
                .trim();

        if (
            contents === ""
        ) {
            return [];
        }

        const parts =
            splitArguments(
                contents
            );

        const values = [];

        for (
            const part
            of parts
        ) {
            values.push(
                await evaluateExpression(
                    part
                )
            );
        }

        return values;
    }

    // Special numeric values
    if (
        expression === "Infinity"
    ) {
        return Infinity;
    }

    if (
        expression === "-Infinity"
    ) {
        return -Infinity;
    }

    if (
        expression === "NaN"
    ) {
        return NaN;
    }

    const addSubtract =
        findTopLevelArithmeticOperator(
            expression,
            ["+", "-"]
        );

    if (addSubtract) {
        const left =
            await evaluateExpression(
                expression.slice(
                    0,
                    addSubtract.index
                )
            );

        const right =
            await evaluateExpression(
                expression.slice(
                    addSubtract.index + 1
                )
            );

        if (
            addSubtract.operator === "+"
        ) {
            return (
                left + right
            );
        }

        if (
            typeof left !== "number" ||
            typeof right !== "number"
        ) {
            throw new Error(
                "subtraction requires numbers"
            );
        }

        return (
            left - right
        );
    }

    const multiplyDivide =
        findTopLevelArithmeticOperator(
            expression,
            ["*", "/", "%"]
        );

    if (multiplyDivide) {
        const left =
            await evaluateExpression(
                expression.slice(
                    0,
                    multiplyDivide.index
                )
            );

        const right =
            await evaluateExpression(
                expression.slice(
                    multiplyDivide.index + 1
                )
            );

        if (
            typeof left !== "number" ||
            typeof right !== "number"
        ) {
            throw new Error(
                "arithmetic operators require numbers"
            );
        }

        if (
            multiplyDivide.operator === "*"
        ) {
            return (
                left * right
            );
        }

        if (
            multiplyDivide.operator === "/"
        ) {
            if (
                right === 0
            ) {
                throw new Error(
                    "cannot divide by zero"
                );
            }

            return (
                left / right
            );
        }

        if (
            right === 0
        ) {
            throw new Error(
                "cannot divide by zero"
            );
        }

        return (
            left % right
        );
    }

    // Typed empty array
    const arrayType =
        expression.match(
            /^([A-Za-z_$][\w$]*)\[\]$/
        );

    if (arrayType) {
        const elementType =
            arrayType[1];

        if (
            !modules[elementType]
        ) {
            throw new Error(
                `array type '${elementType}' does not exist`
            );
        }

        return elementType;
    }

    // String
    if (
        expression.startsWith('"') &&
        expression.endsWith('"')
    ) {
        let value =
            expression.slice(
                1,
                -1
            );

        value = value
            .replaceAll("\\n", "\n")
            .replaceAll("\\r", "\r")
            .replaceAll("\\t", "\t")
            .replaceAll('\\"', '"')
            .replaceAll("\\\\", "\\");

        return value;
    }

    // Char
    if (
        expression.startsWith("'") &&
        expression.endsWith("'")
    ) {
        return expression.slice(
            1,
            -1
        );
    }

    // Boolean
    if (
        expression === "true"
    ) {
        return true;
    }

    if (
        expression === "false"
    ) {
        return false;
    }

    // Null
    if (
        expression === "null"
    ) {
        return null;
    }

    // Number
    if (
        isNumberLiteral(
            expression
        )
    ) {
        return Number(
            expression
        );
    }

    // Existing variable
    const variable =
        findVariable(
            expression
        );

    if (
        variable.found
    ) {
        return getRawValue(
            variable.value
        );
    }


    // SQL definition
    if (
        sqlDefinitions[
            expression
        ] !== undefined
    ) {
        return sqlDefinitions[
            expression
        ];
    }


    // Field access and method call chains
    if (
        /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*(?:\(.*\))?)+$/.test(
            expression
        )
    ) {
        return await evaluateMemberChain(
            expression
        );
    }

    // Function/object call
    const functionCall =
        expression.match(
            /^([A-Za-z_$][\w$]*)\((.*)\)$/
        );

    if (functionCall) {
        const functionName =
            functionCall[1];

        const argumentText =
            functionCall[2];

        // User-defined object constructor
        if (
            userObjectTypes[
                functionName
            ] !== undefined
        ) {
            const args =
                await evaluateArguments(
                    argumentText,
                    true
                );

            return await createUserObjectInstance(
                functionName,
                args
            );
        }

        // User-defined function
        if (
            userFunctions[
                functionName
            ] !== undefined
        ) {
            const args =
                await evaluateArguments(
                    argumentText,
                    true
                );

            return await callUserFunction(
                functionName,
                args
            );
        }

        // Imported standalone function
        const args =
            await evaluateArguments(
                argumentText
            );

        const matches = [];

        for (
            const moduleName
            of callableModuleNames
        ) {
            const module =
                modules[
                    moduleName
                ];

            if (
                module &&
                typeof module[
                    functionName
                ] === "function"
            ) {
                matches.push({
                    moduleName:
                        moduleName,

                    module:
                        module,

                    func:
                        module[
                            functionName
                        ]
                });
            }
        }

        if (
            matches.length === 0
        ) {
            throw new Error(
                `function '${functionName}' does not exist`
            );
        }

        if (
            matches.length > 1
        ) {
            throw new Error(
                `function '${functionName}' is ambiguous; use its object name`
            );
        }

        const match =
            matches[0];

        let result =
            await match.func(
                ...args
            );

        // Preserve the module type of functions which
        // explicitly declare that they return a module value.
        if (
            match.module.__orinReturnTypes &&
            typeof match.module.__orinReturnTypes ===
                "object" &&
            match.module.__orinReturnTypes[
                functionName
            ]
        ) {
            result =
                setModuleValueType(
                    result,
                    match.module.__orinReturnTypes[
                        functionName
                    ]
                );
        }

        return result;
    }

    throw new Error(
        `invalid expression '${expression}'`
    );
}

// Find a top-level arithmetic operator
function findTopLevelArithmeticOperator(
    expression,
    operators
) {
    let depth = 0;
    let quote = null;
    let escaped = false;

    for (
        let i =
            expression.length - 1;
        i >= 0;
        i--
    ) {
        const char =
            expression[i];

        if (
            quote !== null
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote =
                char;

            continue;
        }

        if (
            char === ")"
        ) {
            depth++;
            continue;
        }

        if (
            char === "("
        ) {
            depth--;
            continue;
        }

        if (
            depth !== 0 ||
            !operators.includes(
                char
            )
        ) {
            continue;
        }

        if (
            (
                char === "+" ||
                char === "-"
            ) &&
            isUnaryArithmeticOperator(
                expression,
                i
            )
        ) {
            continue;
        }

        return {
            operator:
                char,

            index:
                i
        };
    }

    return null;
}

// Distinguish unary + / - from arithmetic + / -
function isUnaryArithmeticOperator(
    expression,
    index
) {
    let previousIndex =
        index - 1;

    while (
        previousIndex >= 0 &&
        /\s/.test(
            expression[
                previousIndex
            ]
        )
    ) {
        previousIndex--;
    }

    if (
        previousIndex < 0
    ) {
        return true;
    }

    return (
        "(,+-*/%".includes(
            expression[
                previousIndex
            ]
        )
    );
}

// Remove parentheses wrapping an entire expression
function stripExpressionOuterParentheses(
    expression
) {
    let result =
        expression.trim();

    while (
        result.startsWith("(") &&
        result.endsWith(")") &&
        expressionParenthesesWrapAll(
            result
        )
    ) {
        result =
            result
                .slice(
                    1,
                    -1
                )
                .trim();
    }

    return result;
}

// Check whether outer parentheses contain the entire expression
function expressionParenthesesWrapAll(
    expression
) {
    let depth = 0;
    let quote = null;
    let escaped = false;

    for (
        let i = 0;
        i < expression.length;
        i++
    ) {
        const char =
            expression[i];

        if (
            quote !== null
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote =
                char;

            continue;
        }

        if (
            char === "("
        ) {
            depth++;
        }
        else if (
            char === ")"
        ) {
            depth--;

            if (
                depth === 0 &&
                i !==
                expression.length - 1
            ) {
                return false;
            }
        }

        if (
            depth < 0
        ) {
            return false;
        }
    }

    return (
        depth === 0
    );
}

// Validate a typed parameter
function validateFunctionArgument(
    parameter,
    value,
    functionName
) {
    if (
        parameter.type === null
    ) {
        return;
    }

    if (
        value === null
    ) {
        return;
    }

    if (
        userObjectTypes[
            parameter.type
        ] !== undefined
    ) {
        if (
            !isUserObjectInstance(
                value
            ) ||
            value.__orinTypeName !==
                parameter.type
        ) {
            throw new Error(
                `function '${functionName}' parameter '${parameter.name}' must be ${parameter.type}`
            );
        }

        return;
    }

    if (
        !modules[
            parameter.type
        ]
    ) {
        throw new Error(
            `type '${parameter.type}' does not exist`
        );
    }

    if (
        builtInTypes[
            parameter.type
        ] === undefined
    ) {
        if (
            !isModuleValueType(
                value,
                parameter.type
            )
        ) {
            throw new Error(
                `function '${functionName}' parameter '${parameter.name}' must be ${parameter.type}`
            );
        }

        return;
    }

    value =
        getRawValue(
            value
        );

    let valid = false;

    switch (
        parameter.type
    ) {
        case "integer":
            valid =
                typeof value === "number" &&
                Number.isSafeInteger(
                    value
                );
            break;

        case "double":
            valid =
                typeof value === "number" &&
                Number.isFinite(
                    value
                );
            break;

        case "string":
            valid =
                typeof value === "string";
            break;

        case "boolean":
            valid =
                typeof value === "boolean";
            break;

        case "char":
            valid =
                typeof value === "string" &&
                [...value].length === 1;
            break;

        case "array":
            valid =
                Array.isArray(
                    value
                );
            break;
    }

    if (!valid) {
        throw new Error(
            `function '${functionName}' parameter '${parameter.name}' must be ${parameter.type}`
        );
    }
}

// Call a user-defined function
async function callUserFunction(
    functionName,
    args
) {
    const definition =
        userFunctions[
            functionName
        ];

    if (!definition) {
        throw new Error(
            `function '${functionName}' does not exist`
        );
    }

    if (
        args.length !==
        definition.parameters.length
    ) {
        throw new Error(
            `function '${functionName}' expects ${definition.parameters.length} arguments but received ${args.length}`
        );
    }

    const scope = {};
    const scopeTypes = {};

    for (
        let i = 0;
        i < definition.parameters.length;
        i++
    ) {
        const parameter =
            definition.parameters[i];

        const value =
            args[i];

        validateFunctionArgument(
            parameter,
            value,
            functionName
        );

        if (
            value === null
        ) {
            scope[
                parameter.name
            ] =
                null;

            scopeTypes[
                parameter.name
            ] =
                parameter.type;
        }
        else if (
            parameter.type &&
            builtInTypes[
                parameter.type
            ] !== undefined &&
            modules[
                parameter.type
            ] &&
            typeof modules[
                parameter.type
            ].create === "function"
        ) {
            scope[
                parameter.name
            ] =
                await modules[
                    parameter.type
                ].create(
                    getRawValue(
                        value
                    )
                );

            scopeTypes[
                parameter.name
            ] =
                parameter.type;
        }
        else {
            scope[
                parameter.name
            ] =
                value;

            scopeTypes[
                parameter.name
            ] =
                parameter.type;
        }
    }

    scopeStack.push(
        scope
    );

    scopeTypeStack.push(
        scopeTypes
    );

    const previousSource =
        currentSourceName;

    const previousLine =
        lineNum;

    currentSourceName =
        definition.sourceName;

    try {
        await executeLineObjects(
            definition.body,
            true
        );

        return null;
    }
    catch (error) {
        if (
            error instanceof
            ReturnSignal
        ) {
            return error.value;
        }

        throw error;
    }
    finally {
        scopeStack.pop();
        scopeTypeStack.pop();

        currentSourceName =
            previousSource;

        lineNum =
            previousLine;
    }
}

// Evaluate function arguments
async function evaluateArguments(
    argumentText,
    preserveOrinValues = false
) {
    const rawArguments =
        splitArguments(
            argumentText
        );

    const args = [];

    for (
        const argument
        of rawArguments
    ) {
        if (
            argument.trim() ===
            ""
        ) {
            continue;
        }

        if (preserveOrinValues) {
            const cleanArgument =
                argument.trim();

            const variable =
                findVariable(
                    cleanArgument
                );

            if (variable.found) {
                args.push(
                    variable.value
                );

                continue;
            }
        }

        args.push(
            await evaluateExpression(
                argument
            )
        );
    }

    return args;
}

// Split function arguments
function splitArguments(text) {
    const args = [];

    let current = "";
    let quote = null;
    let escaped = false;
    let parentheses = 0;
    let brackets = 0;

    for (
        let i = 0;
        i < text.length;
        i++
    ) {
        const char =
            text[i];

        if (
            quote !== null
        ) {
            current +=
                char;

            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote =
                    null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote =
                char;

            current +=
                char;

            continue;
        }

        if (
            char === "("
        ) {
            parentheses++;
        }
        else if (
            char === ")"
        ) {
            parentheses--;
        }
        else if (
            char === "["
        ) {
            brackets++;
        }
        else if (
            char === "]"
        ) {
            brackets--;
        }

        if (
            char === "," &&
            parentheses === 0 &&
            brackets === 0
        ) {
            args.push(
                current.trim()
            );

            current =
                "";

            continue;
        }

        current +=
            char;
    }

    if (
        current.trim() !== ""
    ) {
        args.push(
            current.trim()
        );
    }

    return args;
}

// Find a variable from innermost scope outward
function findVariable(name) {
    for (
        let i =
            scopeStack.length - 1;
        i >= 0;
        i--
    ) {
        if (
            Object.prototype
                .hasOwnProperty
                .call(
                    scopeStack[i],
                    name
                )
        ) {
            return {
                found:
                    true,

                value:
                    scopeStack[i][name],

                scopeIndex:
                    i,

                global:
                    false
            };
        }
    }

    if (
        Object.prototype
            .hasOwnProperty
            .call(
                variables,
                name
            )
    ) {
        return {
            found:
                true,

            value:
                variables[name],

            scopeIndex:
                -1,

            global:
                true
        };
    }

    const windowRuntime =
        window[
            "orinWindowRuntime"
        ];

    if (
        windowRuntime &&
        Object.prototype
            .hasOwnProperty
            .call(
                windowRuntime.values,
                name
            )
    ) {
        return {
            found:
                true,

            value:
                windowRuntime.values[
                    name
                ],

            scopeIndex:
                -1,

            global:
                true
        };
    }

    return {
        found:
            false,

        value:
            undefined,

        scopeIndex:
            -1,

        global:
            false
    };
}

// Store a variable
function storeVariable(
    name,
    value,
    type = null
) {
    if (
        scopeStack.length > 0
    ) {
        const index =
            scopeStack.length - 1;

        scopeStack[index][name] =
            value;

        scopeTypeStack[index][name] =
            type;

        return;
    }

    variables[name] =
        value;

    variableTypes[name] =
        type;

    if (
        value !== null &&
        typeof value === "object" &&
        (
            value.__orinWindowElement === true ||
            value.__orinWindowPage === true
        )
    ) {
        window[
            "orinWindowRuntime"
        ].register(
            name,
            value
        );
    }
}

// Assign while preserving declared type
async function assignVariable(
    name,
    value
) {
    const variable =
        findVariable(
            name
        );

    if (!variable.found) {
        throw new Error(
            `variable '${name}' does not exist`
        );
    }

    let type = null;

    if (
        variable.global
    ) {
        type =
            variableTypes[
                name
            ] ||
            null;
    }
    else {
        type =
            scopeTypeStack[
                variable.scopeIndex
            ][name] ||
            null;
    }

    let storedValue =
        value;

    if (
        value === null
    ) {
        storedValue =
            null;
    }
    else if (
        type &&
        userObjectTypes[
            type
        ] !== undefined
    ) {
        if (
            !isUserObjectInstance(
                value
            ) ||
            value.__orinTypeName !==
                type
        ) {
            throw new Error(
                `value must be ${type}`
            );
        }
    }
    else if (
        type &&
        modules[type] &&
        builtInTypes[type] ===
            undefined
    ) {
        if (
            !isModuleValueType(
                value,
                type
            )
        ) {
            throw new Error(
                `value must be ${type}`
            );
        }

        storedValue =
            value;
    }
    else if (
        type &&
        builtInTypes[type] !==
            undefined &&
        modules[type] &&
        typeof modules[type].create ===
            "function"
    ) {
        storedValue =
            await modules[
                type
            ].create(
                getRawValue(
                    value
                )
            );
    }

    if (
        variable.global
    ) {
        variables[name] =
            storedValue;
    }
    else {
        scopeStack[
            variable.scopeIndex
        ][name] =
            storedValue;
    }
}

// Get raw value from built-in wrapper
function getRawValue(value) {
    if (
        value !== null &&
        typeof value === "object" &&
        value.__orinWindowElement !== true &&
        value.__orinWindowPage !== true &&
        value.__orinModuleType === undefined &&
        typeof value.getValue ===
            "function"
    ) {
        return value.getValue();
    }

    return value;
}

// Check whether name is in use
function nameTaken(name) {
    if (
        scopeStack.length > 0
    ) {
        const currentScope =
            scopeStack[
                scopeStack.length - 1
            ];

        return (
            Object.prototype
                .hasOwnProperty
                .call(
                    currentScope,
                    name
                )
        );
    }

    return (
        variables[name] !== undefined ||
        objects[name] !== undefined ||
        userFunctions[name] !== undefined ||
        sqlDefinitions[name] !== undefined ||
        userObjectTypes[name] !== undefined
    );
}

// Evaluate a dotted field/method chain
async function evaluateMemberChain(
    expression
) {
    const rootMatch =
        expression.match(
            /^([A-Za-z_$][\w$]*)/
        );

    if (!rootMatch) {
        throw new Error(
            `invalid expression '${expression}'`
        );
    }

    const rootName =
        rootMatch[1];

    let current;

    const variable =
        findVariable(
            rootName
        );

    if (variable.found) {
        current =
            variable.value;
    }
    else if (
        objects[
            rootName
        ] !== undefined
    ) {
        current =
            objects[
                rootName
            ];
    }
    else {
        throw new Error(
            `object '${rootName}' does not exist`
        );
    }

    let index =
        rootMatch[0].length;

    let segmentIndex = 0;

    while (
        index < expression.length
    ) {
        if (
            expression[index] !== "."
        ) {
            throw new Error(
                `invalid member expression '${expression}'`
            );
        }

        index++;

        const nameMatch =
            expression
                .slice(index)
                .match(
                    /^([A-Za-z_$][\w$]*)/
                );

        if (!nameMatch) {
            throw new Error(
                `invalid member expression '${expression}'`
            );
        }

        const memberName =
            nameMatch[1];

        index +=
            memberName.length;

        if (
            expression[index] === "("
        ) {
            const call =
                readCallArguments(
                    expression,
                    index
                );

            if (
                isUserObjectInstance(
                    current
                )
            ) {
                const args =
                    await evaluateArguments(
                        call.argumentText,
                        true
                    );

                current =
                    await callUserObjectMethod(
                        current,
                        memberName,
                        args
                    );
            }
            else {
                const args =
                    await evaluateArguments(
                        call.argumentText
                    );

                const func =
                    current &&
                    current[
                        memberName
                    ];

                if (
                    typeof func !== "function"
                ) {
                    throw new Error(
                        `'${memberName}' is not a callable method`
                    );
                }

                current =
                    await func.apply(
                        current,
                        args
                    );
            }

            index =
                call.endIndex + 1;
        }
        else {
            if (
                !isUserObjectInstance(
                    current
                )
            ) {
                throw new Error(
                    `'${memberName}' is not an accessible field`
                );
            }

            current =
                getUserObjectField(
                    current,
                    memberName,
                    rootName === "this" &&
                    segmentIndex === 0
                );
        }

        segmentIndex++;
    }

    return getRawValue(
        current
    );
}

// Find the end of method arguments
function readCallArguments(
    expression,
    openingIndex
) {
    let depth = 0;
    let quote = null;
    let escaped = false;

    for (
        let i = openingIndex;
        i < expression.length;
        i++
    ) {
        const char =
            expression[i];

        if (
            quote !== null
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (
                char === "\\"
            ) {
                escaped = true;
                continue;
            }

            if (
                char === quote
            ) {
                quote = null;
            }

            continue;
        }

        if (
            char === '"' ||
            char === "'"
        ) {
            quote = char;
            continue;
        }

        if (
            char === "("
        ) {
            depth++;
            continue;
        }

        if (
            char === ")"
        ) {
            depth--;

            if (
                depth === 0
            ) {
                return {
                    argumentText:
                        expression.slice(
                            openingIndex + 1,
                            i
                        ),

                    endIndex:
                        i
                };
            }
        }
    }

    throw new Error(
        "method call is missing a closing parenthesis"
    );
}

// Check whether a value is a user object
function isUserObjectInstance(
    value
) {
    return (
        value !== null &&
        typeof value === "object" &&
        value.__orinObjectInstance === true &&
        typeof value.__orinTypeName === "string" &&
        value.__orinFields !== null &&
        typeof value.__orinFields === "object"
    );
}

// Construct a user-defined object
async function createUserObjectInstance(
    typeName,
    args
) {
    const definition =
        userObjectTypes[
            typeName
        ];

    if (!definition) {
        throw new Error(
            `object type '${typeName}' does not exist`
        );
    }

    const instance = {
        __orinObjectInstance:
            true,

        __orinTypeName:
            typeName,

        __orinFields:
            {}
    };

    for (
        const fieldName
        in definition.fields
    ) {
        const field =
            definition.fields[
                fieldName
            ];

        instance.__orinFields[
            fieldName
        ] = {
            type:
                field.type,

            visibility:
                field.visibility,

            value:
                null
        };
    }

    const constructorDefinition =
        definition.constructor;

    if (
        constructorDefinition === null
    ) {
        if (
            args.length !== 0
        ) {
            throw new Error(
                `object '${typeName}' does not have a constructor that accepts arguments`
            );
        }

        return instance;
    }

    await callUserObjectMember(
        instance,
        constructorDefinition,
        args,
        `${typeName} constructor`
    );

    return instance;
}

// Call a user-object method
async function callUserObjectMethod(
    instance,
    methodName,
    args
) {
    if (
        !isUserObjectInstance(
            instance
        )
    ) {
        throw new Error(
            "value is not a user-defined object"
        );
    }

    const definition =
        userObjectTypes[
            instance.__orinTypeName
        ];

    if (!definition) {
        throw new Error(
            `object type '${instance.__orinTypeName}' does not exist`
        );
    }

    const method =
        definition.methods[
            methodName
        ];

    if (!method) {
        throw new Error(
            `'${instance.__orinTypeName}' has no method '${methodName}'`
        );
    }

    return await callUserObjectMember(
        instance,
        method,
        args,
        `${instance.__orinTypeName}.${methodName}`
    );
}

// Execute constructor or object method
async function callUserObjectMember(
    instance,
    definition,
    args,
    memberName
) {
    if (
        args.length !==
        definition.parameters.length
    ) {
        throw new Error(
            `'${memberName}' expects ${definition.parameters.length} arguments but received ${args.length}`
        );
    }

    const scope = {
        this:
            instance
    };

    const scopeTypes = {
        this:
            instance.__orinTypeName
    };

    for (
        let i = 0;
        i < definition.parameters.length;
        i++
    ) {
        const parameter =
            definition.parameters[i];

        const value =
            args[i];

        validateFunctionArgument(
            parameter,
            value,
            memberName
        );

        if (
            value === null
        ) {
            scope[
                parameter.name
            ] =
                null;
        }
        else if (
            parameter.type &&
            userObjectTypes[
                parameter.type
            ] !== undefined
        ) {
            scope[
                parameter.name
            ] =
                value;
        }
        else if (
            parameter.type &&
            builtInTypes[
                parameter.type
            ] !== undefined &&
            modules[
                parameter.type
            ] &&
            typeof modules[
                parameter.type
            ].create === "function"
        ) {
            scope[
                parameter.name
            ] =
                await modules[
                    parameter.type
                ].create(
                    getRawValue(
                        value
                    )
                );
        }
        else {
            scope[
                parameter.name
            ] =
                value;
        }

        scopeTypes[
            parameter.name
        ] =
            parameter.type;
    }

    scopeStack.push(
        scope
    );

    scopeTypeStack.push(
        scopeTypes
    );

    const previousSource =
        currentSourceName;

    const previousLine =
        lineNum;

    currentSourceName =
        definition.sourceName;

    try {
        await executeLineObjects(
            definition.body,
            true
        );

        return null;
    }
    catch (error) {
        if (
            error instanceof ReturnSignal
        ) {
            return error.value;
        }

        throw error;
    }
    finally {
        scopeStack.pop();
        scopeTypeStack.pop();

        currentSourceName =
            previousSource;

        lineNum =
            previousLine;
    }
}
// Read a field
function getUserObjectField(
    instance,
    fieldName,
    internalAccess = false
) {
    const field =
        instance.__orinFields[
            fieldName
        ];

    if (!field) {
        throw new Error(
            `'${instance.__orinTypeName}' has no field '${fieldName}'`
        );
    }

    if (
        field.visibility === "private" &&
        !internalAccess
    ) {
        throw new Error(
            `field '${fieldName}' is private`
        );
    }

    return getRawValue(
        field.value
    );
}

// Write a field
async function setUserObjectField(
    instance,
    fieldName,
    value,
    internalAccess = false
) {
    const field =
        instance.__orinFields[
            fieldName
        ];

    if (!field) {
        throw new Error(
            `'${instance.__orinTypeName}' has no field '${fieldName}'`
        );
    }

    if (
        field.visibility === "private" &&
        !internalAccess
    ) {
        throw new Error(
            `field '${fieldName}' is private`
        );
    }

    if (
        value === null
    ) {
        field.value =
            null;

        return;
    }

    if (
        userObjectTypes[
            field.type
        ] !== undefined
    ) {
        if (
            !isUserObjectInstance(
                value
            ) ||
            value.__orinTypeName !==
                field.type
        ) {
            throw new Error(
                `field '${fieldName}' must be ${field.type}`
            );
        }

        field.value =
            value;

        return;
    }

    if (
        modules[
            field.type
        ] &&
        builtInTypes[
            field.type
        ] === undefined
    ) {
        if (
            !isModuleValueType(
                value,
                field.type
            )
        ) {
            throw new Error(
                `field '${fieldName}' must be ${field.type}`
            );
        }

        field.value =
            value;

        return;
    }

    if (
        builtInTypes[
            field.type
        ] === undefined ||
        !modules[
            field.type
        ] ||
        typeof modules[
            field.type
        ].create !== "function"
    ) {
        throw new Error(
            `field type '${field.type}' does not exist`
        );
    }

    field.value =
        await modules[
            field.type
        ].create(
            getRawValue(
                value
            )
        );
}

// Check number literal
function isNumberLiteral(value) {
    if (
        value.trim() === ""
    ) {
        return false;
    }

    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(
        value
    );
}

// Check whether line is a function/method call
function isFunctionCall(line) {
    return /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\(.*\);$/.test(
        line
    );
}

// Remove final semicolon
function removeSemicolon(line) {
    if (
        line.endsWith(";")
    ) {
        return line.slice(
            0,
            -1
        );
    }

    return line;
}

// Display Orin error
function orinError(
    message,
    errorLine = lineNum
) {
    appendTerminalOutput(
        `Error, line ${errorLine}: ${message}\n`
    );

    errorEncountered = true;
}