let terminalMode = "repl";

let replInputStartOffset = 0;
let replBuffer = "";
let replBraceDepth = 0;

let terminalProgramRunning = false;
let terminalStopRequested = false;
let terminalInputCancel = null;

const REPL_PROMPT = "orin> ";
const REPL_CONTINUE_PROMPT = "... ";

// Start the terminal once Monaco is ready
function initialiseTerminalRunner() {
    if (
        typeof terminalEditor === "undefined" ||
        !terminalEditor
    ) {
        setTimeout(
            initialiseTerminalRunner,
            50
        );

        return;
    }

    terminalEditor.onKeyDown(
        handleTerminalKeyDown
    );

    terminalEditor.onDidChangeCursorPosition(
        keepCursorInsideInput
    );

    terminalEditor.onDidChangeModelContent(
        protectTerminalHistory
    );

    resetTerminalSession(
        true
    );
}

// Handle keyboard input in the REPL
function handleTerminalKeyDown(event) {
    if (
        terminalMode !== "repl"
    ) {
        return;
    }

    const keyCode =
        event.keyCode;

    if (
        keyCode === monaco.KeyCode.Enter
    ) {
        event.preventDefault();
        event.stopPropagation();

        submitCurrentTerminalInput();

        return;
    }

    if (
        keyCode === monaco.KeyCode.Backspace
    ) {
        const offset =
            getTerminalCursorOffset();

        if (
            offset <= replInputStartOffset
        ) {
            event.preventDefault();
            event.stopPropagation();
        }

        return;
    }

    if (
        keyCode === monaco.KeyCode.Delete
    ) {
        const selection =
            terminalEditor.getSelection();

        if (
            selection &&
            getOffsetAtPosition(
                selection.getStartPosition()
            ) < replInputStartOffset
        ) {
            event.preventDefault();
            event.stopPropagation();
        }

        return;
    }

    if (
        keyCode === monaco.KeyCode.Home
    ) {
        event.preventDefault();
        event.stopPropagation();

        moveCursorToInputStart();
    }
}

// Execute what the user typed after the prompt
async function submitCurrentTerminalInput() {
    if (
        terminalMode !== "repl"
    ) {
        return;
    }

    const model =
        terminalEditor.getModel();

    if (!model) {
        return;
    }

    const fullText =
        model.getValue();

    const line =
        fullText.slice(
            replInputStartOffset
        );

    appendTerminalText(
        "\n"
    );

    setTerminalReadOnly(
        true
    );

    try {
        await submitTerminalLine(
            line
        );
    }
    catch (error) {
        console.error(error);

        appendTerminalText(
            `Error: ${error.message}\n`
        );

        resetReplBuffer();
        errorEncountered = false;
    }

    if (
        terminalMode === "repl"
    ) {
        setTerminalReadOnly(
            false
        );

        showReplPrompt();
    }
}

// Submit one REPL line
async function submitTerminalLine(line) {
    const cleanLine =
        line.trim();

    // Empty command
    if (
        cleanLine === "" &&
        replBuffer === ""
    ) {
        return;
    }

    // Clear the whole REPL session
    if (
        cleanLine === "clear();" &&
        replBuffer === ""
    ) {
        await resetTerminalSession(
            true
        );

        return;
    }

    // Previous REPL errors must not block new commands
    if (
        replBuffer === ""
    ) {
        errorEncountered = false;
        lineNum = 1;
    }

    if (
        replBuffer !== ""
    ) {
        replBuffer +=
            "\n" + line;
    }
    else {
        replBuffer =
            line;
    }

    replBraceDepth +=
        countBraceChange(
            line
        );

    // Too many closing braces
    if (
        replBraceDepth < 0
    ) {
        appendTerminalText(
            "Error: unexpected closing brace\n"
        );

        resetReplBuffer();
        errorEncountered = false;

        return;
    }

    // Wait for the rest of a block
    if (
        replBraceDepth > 0
    ) {
        showContinuePrompt();

        return;
    }

    const source =
        replBuffer;

    resetReplBuffer();

    await executeSource(
        source,
        "<terminal>"
    );

    // Keep the REPL alive after an error
    errorEncountered = false;
}

// Reset unfinished multi-line input
function resetReplBuffer() {
    replBuffer = "";
    replBraceDepth = 0;
}

// Show normal prompt
function showReplPrompt() {
    if (
        terminalMode !== "repl"
    ) {
        return;
    }

    const model =
        terminalEditor.getModel();

    if (!model) {
        return;
    }

    const currentText =
        model.getValue();

    if (
        currentText !== "" &&
        !currentText.endsWith("\n")
    ) {
        appendTerminalText(
            "\n"
        );
    }

    appendTerminalText(
        REPL_PROMPT
    );

    replInputStartOffset =
        model.getValueLength();

    moveCursorToEnd();

    terminalEditor.focus();
}

// Show continuation prompt
function showContinuePrompt() {
    appendTerminalText(
        REPL_CONTINUE_PROMPT
    );

    const model =
        terminalEditor.getModel();

    if (!model) {
        return;
    }

    replInputStartOffset =
        model.getValueLength();

    setTerminalReadOnly(
        false
    );

    moveCursorToEnd();

    terminalEditor.focus();
}

// Stop cursor moving into protected history
function keepCursorInsideInput() {
    if (
        terminalMode !== "repl"
    ) {
        return;
    }

    const offset =
        getTerminalCursorOffset();

    if (
        offset < replInputStartOffset
    ) {
        moveCursorToInputStart();
    }
}

// Protect old terminal text
function protectTerminalHistory(event) {
    if (
        terminalMode !== "repl"
    ) {
        return;
    }

    if (
        terminalEditor.getOption(
            monaco.editor.EditorOption.readOnly
        )
    ) {
        return;
    }

    const model =
        terminalEditor.getModel();

    if (!model) {
        return;
    }

    for (
        const change of event.changes
    ) {
        if (
            change.rangeOffset < replInputStartOffset
        ) {
            restoreReplCursor();

            break;
        }
    }
}

// Move cursor back to valid REPL input
function restoreReplCursor() {
    moveCursorToInputStart();
}

// Get current cursor position as a model offset
function getTerminalCursorOffset() {
    const position =
        terminalEditor.getPosition();

    if (!position) {
        return 0;
    }

    return getOffsetAtPosition(
        position
    );
}

// Convert Monaco position to model offset
function getOffsetAtPosition(position) {
    const model =
        terminalEditor.getModel();

    if (!model) {
        return 0;
    }

    return model.getOffsetAt(
        position
    );
}

// Convert model offset to Monaco position
function getPositionAtOffset(offset) {
    const model =
        terminalEditor.getModel();

    if (!model) {
        return {
            lineNumber: 1,
            column: 1
        };
    }

    return model.getPositionAt(
        offset
    );
}

// Move cursor to start of editable input
function moveCursorToInputStart() {
    terminalEditor.setPosition(
        getPositionAtOffset(
            replInputStartOffset
        )
    );

    terminalEditor.revealPosition(
        getPositionAtOffset(
            replInputStartOffset
        )
    );
}

// Move cursor to end of terminal
function moveCursorToEnd() {
    const model =
        terminalEditor.getModel();

    if (!model) {
        return;
    }

    const position =
        model.getPositionAt(
            model.getValueLength()
        );

    terminalEditor.setPosition(
        position
    );

    terminalEditor.revealPosition(
        position
    );
}

// Add text to the Monaco terminal
function appendTerminalText(text) {
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
                text,

            forceMoveMarkers:
                true
        }
    ]);

    moveCursorToEnd();
}

// Set terminal read-only state
function setTerminalReadOnly(value) {
    terminalEditor.updateOptions({
        readOnly: value
    });
}

// Reset the whole REPL session
async function resetTerminalSession(
    clearDisplay = true
) {
    resetReplBuffer();

    clearObject(modules);
    clearObject(objects);
    clearObject(variables);
    clearObject(userFunctions);
    clearObject(userObjectTypes);

    callableModuleNames.clear();
    loadedProjectFiles.clear();
    loadingProjectFiles.clear();

    scopeStack.length = 0;

    errorEncountered = false;
    lineNum = 0;

    await loadControlModules();

    await loadBuiltInTypes();

    await loadRootDefinitionsForTerminal();

    if (
        clearDisplay
    ) {
        terminalEditor.setValue("");
    }

    terminalMode =
        "repl";

    setTerminalReadOnly(
        false
    );

    showReplPrompt();
}

// Load root-level project functions into the REPL
async function loadRootDefinitionsForTerminal() {
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
        const child of orinProject.children
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

        if (
            errorEncountered
        ) {
            break;
        }
    }

    errorEncountered = false;
}

// Run or end the Monaco file
async function toggleProgramRun() {
    if (
        terminalProgramRunning
    ) {
        endProgramRun();

        return;
    }

    await startProgramRun();
}

// Start current editor file
async function startProgramRun() {
    if (
        terminalProgramRunning
    ) {
        return;
    }

    terminalProgramRunning =
        true;

    terminalStopRequested =
        false;
    terminalInputCancel =
        null;

    terminalMode =
        "running";

    resetReplBuffer();

    setTerminalReadOnly(
        true
    );

    updateRunButton();

    try {
        await runCode();
    }
    catch (error) {
        console.error(error);

        appendTerminalText(
            `Error: ${error.message}\n`
        );
    }
    finally {
        terminalProgramRunning =
            false;

        terminalStopRequested =
            false;
        terminalInputCancel =
        null;
        
        await returnToTerminalMode();
    }
}

// Request the running program to stop
function endProgramRun() {
    if (
        !terminalProgramRunning
    ) {
        return;
    }

    terminalStopRequested =
        true;

    updateRunButton();

    if (
        typeof terminalInputCancel === "function"
    ) {
        terminalInputCancel();
        terminalInputCancel = null;
    }
}

// Return to interactive terminal mode
async function returnToTerminalMode() {
    terminalMode =
        "repl";

    clearObject(modules);
    clearObject(objects);
    clearObject(variables);
    clearObject(userFunctions);
    clearObject(userObjectTypes);

    callableModuleNames.clear();
    loadedProjectFiles.clear();
    loadingProjectFiles.clear();

    scopeStack.length = 0;

    errorEncountered = false;
    lineNum = 0;

    await loadBuiltInTypes();

    await loadRootDefinitionsForTerminal();

    errorEncountered = false;

    setTerminalReadOnly(
        false
    );

    const model =
        terminalEditor.getModel();

    if (
        model &&
        model.getValue() !== "" &&
        !model.getValue().endsWith("\n")
    ) {
        appendTerminalText(
            "\n"
        );
    }

    showReplPrompt();

    updateRunButton();
}

// Let codePlayer know whether End was pressed
function shouldEndProgram() {
    return terminalStopRequested;
}

// Change Run button text
function updateRunButton() {
    const button =
        document.getElementById(
            "runButton"
        );

    if (!button) {
        return;
    }

    if (
        terminalProgramRunning &&
        terminalStopRequested
    ) {
        button.textContent =
            "Ending...";

        return;
    }

    if (
        terminalProgramRunning
    ) {
        button.textContent =
            "■ End";

        return;
    }

    button.textContent =
        "▶ Run";
}

// Make terminal operations available to imported Orin modules
window.orinTerminal = {
    write: function (text) {
        appendTerminalText(
            String(text)
        );
    },

    clearDisplay: function () {
        if (
            window.terminalEditor
        ) {
            window.terminalEditor.setValue("");
        }
    },

    reset: async function () {
        await resetTerminalSession(
            true
        );
    },

    setInputCancel: function (cancelFunction) {
        terminalInputCancel =
            cancelFunction;
    },

    clearInputCancel: function () {
        terminalInputCancel =
            null;
    },
};

// Initialise once the page has loaded
window.addEventListener(
    "load",
    initialiseTerminalRunner
);