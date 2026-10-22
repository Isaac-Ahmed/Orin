let editor;
let terminalEditor;
let editorCallDecorations = [];
let terminalCallDecorations = [];

const ORIN_IDENTIFIER = "[A-Za-z_$][\\w$]*";
const FUNCTION_DEFINITION_REGEX = /^\s*define\s+function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/;
const OBJECT_DEFINITION_REGEX = /^\s*define\s+object\s+([A-Za-z_$][\w$]*)\s*\{/;
const CONSTRUCTOR_DEFINITION_REGEX = /^\s*constructor\s*\(([^)]*)\)\s*\{/;
const IMPORT_REGEX = /^\s*import\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*;\s*$/;
const CREATE_OBJECT_REGEX = /^\s*create\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*)\s*;\s*$/;
const CREATE_VALUE_REGEX = /^\s*create\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*)\s*=\s*(\S(?:.*\S)?)\s*;\s*$/;
const OBJECT_FIELD_REGEX = /^\s*create\s+(?:private|public)\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+([A-Za-z_$][\w$]*)\s*;\s*$/;
const METHOD_CALL_REGEX = /([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\.([A-Za-z_$][\w$]*)\s*\(/g;
const FUNCTION_CALL_REGEX = /[A-Za-z_$][\w$]*\s*\(/g;
const FIELD_ACCESS_REGEX = /([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\.([A-Za-z_$][\w$]*)\b(?!\s*\()/g;

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
    }
});

require([
    "vs/editor/editor.main",
    "vs/language/css/monaco.contribution"
], function () {
    monaco.languages.register({
        id: "orin"
    });

    monaco.languages.setLanguageConfiguration("orin", {
        comments: {
            lineComment: "//"
        },

        brackets: [
            ["{", "}"],
            ["[", "]"],
            ["(", ")"]
        ],

        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"' },
            { open: "'", close: "'" }
        ],

        surroundingPairs: [
            { open: "{", close: "}" },
            { open: "[", close: "]" },
            { open: "(", close: ")" },
            { open: '"', close: '"' },
            { open: "'", close: "'" }
        ]
    });

    monaco.languages.setMonarchTokensProvider("orin", {
        keywords: [
            "import",
            "create",
            "define",
            "function",
            "return",
            "object",
            "constructor",
            "private",
            "public",
            "break",
            "continue",
            "switch",
            "case",
            "default",
            "if",
            "while",
            "for",
            "repeat",
            "try",
            "catch",
            "finally",
            "throw",
            "this"
        ],

        tokenizer: {
            root: [
                [/orin>/, "terminalPrompt"],
                [/\.\.\./, "terminalPrompt"],
                [/\/\/.*$/, "comment"],

                [
                    /(import)(\s+)([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)(\s*;)/,
                    ["keyword", "", "importPath", "delimiter"]
                ],

                [
                    /[A-Za-z_$][\w$]*/,
                    {
                        cases: {
                            "@keywords": "keyword",

                            "true": "literal.boolean",
                            "false": "literal.boolean",
                            "null": "literal.null",

                            "integer": "type.integer",
                            "double": "type.double",
                            "string": "type.string",
                            "boolean": "type.boolean",
                            "char": "type.char",
                            "array": "type.array",

                            "Infinity": "number.special",
                            "NaN": "number.special",

                            "@default": "identifier"
                        }
                    }
                ],

                [/[-+]?(?:\d+(?:\.\d*)?|\.\d+)/, "number"],

                [
                    /"/,
                    {
                        token: "string.quote",
                        next: "@doubleString"
                    }
                ],

                [
                    /'/,
                    {
                        token: "char.quote",
                        next: "@singleString"
                    }
                ],

                [/[{}()\[\]]/, "@brackets"],
                [/[=+\-*\/%<>!]/, "operator"],
                [/[;,.]/, "delimiter"]
            ],

            doubleString: [
                [/[^\\"]+/, "string"],
                [/\\./, "string.escape"],
                [
                    /"/,
                    {
                        token: "string.quote",
                        next: "@pop"
                    }
                ]
            ],

            singleString: [
                [/[^\\']+/, "char"],
                [/\\./, "char.escape"],
                [
                    /'/,
                    {
                        token: "char.quote",
                        next: "@pop"
                    }
                ]
            ]
        }
    });

    monaco.editor.defineTheme("orin-dark", {
        base: "vs-dark",
        inherit: true,

        rules: [
            {
                token: "terminalPrompt",
                foreground: "6A9955"
            },
            {
                token: "keyword",
                foreground: "569CD6"
            },
            {
                token: "literal.boolean",
                foreground: "C586C0"
            },
            {
                token: "literal.null",
                foreground: "D16D9E"
            },

            {
                token: "type.integer",
                foreground: "4FC1FF"
            },
            {
                token: "type.double",
                foreground: "B5CEA8"
            },
            {
                token: "type.string",
                foreground: "CE9178"
            },
            {
                token: "type.boolean",
                foreground: "C586C0"
            },
            {
                token: "type.char",
                foreground: "D7BA7D"
            },
            {
                token: "type.array",
                foreground: "D16D9E"
            },

            {
                token: "number",
                foreground: "B5CEA8"
            },
            {
                token: "number.special",
                foreground: "B5CEA8"
            },

            {
                token: "string",
                foreground: "CE9178"
            },
            {
                token: "string.quote",
                foreground: "CE9178"
            },
            {
                token: "string.escape",
                foreground: "D7BA7D"
            },

            {
                token: "char",
                foreground: "D7BA7D"
            },
            {
                token: "char.quote",
                foreground: "D7BA7D"
            },
            {
                token: "char.escape",
                foreground: "D7BA7D"
            },

            {
                token: "comment",
                foreground: "6A9955"
            }
        ],

        colors: {}
    });

    installOrinDecorationStyles();

    monaco.languages.registerCompletionItemProvider("orin", {
        triggerCharacters: ["."],

        provideCompletionItems: function (model, position) {
            return buildCompletionItems(
                model,
                position
            );
        }
    });

    editor = monaco.editor.create(
        document.getElementById("codeArea"),
        {
            value: "",
            language: "orin",
            theme: "orin-dark",
            automaticLayout: true,
            fixedOverflowWidgets: true,
            fontSize: 14,
            lineNumbers: "on",

            minimap: {
                enabled: false
            },

            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            suggestOnTriggerCharacters: true,

            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            },

            padding: {
                top: 8,
                bottom: 8
            }
        }
    );

    terminalEditor = monaco.editor.create(
        document.getElementById("terminal"),
        {
            value: "",
            language: "orin",
            theme: "orin-dark",
            automaticLayout: true,
            fixedOverflowWidgets: true,
            fontSize: 14,
            lineNumbers: "off",
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,

            guides: {
                indentation: false,
                bracketPairs: false
            },

            minimap: {
                enabled: false
            },

            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            insertSpaces: true,
            suggestOnTriggerCharacters: true,

            quickSuggestions: {
                other: true,
                comments: false,
                strings: false
            },

            padding: {
                top: 8,
                bottom: 8
            }
        }
    );

    window.terminalEditor =
        terminalEditor;

    editor.onDidChangeModelContent(
        function () {
            if (
                typeof activeFile !== "undefined" &&
                activeFile
            ) {
                activeFile.content =
                    editor.getValue();

                saveProject();
            }

            refreshOrinAnalysis(
                editor,
                "editor"
            );
        }
    );

    terminalEditor.onDidChangeModelContent(
        function () {
            refreshOrinAnalysis(
                terminalEditor,
                "terminal"
            );
        }
    );

    initialiseProjectManager();

    refreshOrinAnalysis(
        editor,
        "editor"
    );

    refreshOrinAnalysis(
        terminalEditor,
        "terminal"
    );
});

function installOrinDecorationStyles() {
    if (
        document.getElementById(
            "orin-decoration-styles"
        )
    ) {
        return;
    }

    const style =
        document.createElement(
            "style"
        );

    style.id =
        "orin-decoration-styles";

    style.textContent = `
        .monaco-editor .orin-valid-function {
            color: #DCDCAA !important;
        }

        .monaco-editor .orin-valid-method {
            color: #DCDCAA !important;
        }

        .monaco-editor .orin-variable {
            color: #9CDCFE !important;
        }

        .monaco-editor .orin-parameter {
            color: #98C379 !important;
        }

        .monaco-editor .orin-object-type {
            color: #4EC9B0 !important;
        }

        .monaco-editor .orin-field {
            color: #E06C75 !important;
        }

        .monaco-editor .orin-invalid-call {
            color: #F44747 !important;
        }
    `;

    document.head.appendChild(
        style
    );
}

function refreshOrinAnalysis(
    targetEditor,
    targetName
) {
    if(!targetEditor){
        return;
    }

    const model =
        targetEditor.getModel();

    if(!model){
        return;
    }

    if(
        model.getLanguageId() !==
        "orin"
    ){
        const oldDecorations =
            targetName === "terminal"
                ? terminalCallDecorations
                : editorCallDecorations;

        const newDecorations =
            targetEditor.deltaDecorations(
                oldDecorations,
                []
            );

        if(
            targetName === "terminal"
        ){
            terminalCallDecorations =
                newDecorations;
        }
        else{
            editorCallDecorations =
                newDecorations;
        }

        monaco.editor.setModelMarkers(
            model,
            "orin-analysis",
            []
        );

        return;
    }

    const result =
        analyseOrinModel(
            model,
            targetName
        );

    const oldDecorations =
        targetName === "terminal"
            ? terminalCallDecorations
            : editorCallDecorations;

    const newDecorations =
        targetEditor.deltaDecorations(
            oldDecorations,
            result.decorations
        );

    if(
        targetName === "terminal"
    ){
        terminalCallDecorations =
            newDecorations;
    }
    else{
        editorCallDecorations =
            newDecorations;
    }

    monaco.editor.setModelMarkers(
        model,
        "orin-analysis",
        result.markers
    );
}

function analyseOrinModel(
    model,
    targetName
) {
    const decorations = [];
    const markers = [];

    const state =
        createInitialAnalysisState(
            model
        );

    for (
        let lineNumber = 1;
        lineNumber <= model.getLineCount();
        lineNumber++
    ) {
        const originalLine =
            model.getLineContent(
                lineNumber
            );

        const logicalLineInfo =
            getLogicalLine(
                originalLine
            );

        if (
            targetName === "terminal" &&
            !logicalLineInfo.isPrompt
        ) {
            continue;
        }

        const logicalLine =
            logicalLineInfo.text;

        const lineOffset =
            logicalLineInfo.offset;

        const maskedLine =
            maskStringsAndComments(
                logicalLine
            );

        const importMatch =
            logicalLine.match(
                IMPORT_REGEX
            );

        if (importMatch) {
            applyImportToAnalysisState(
                state,
                importMatch[1]
            );
        }

        const objectMatch =
            logicalLine.match(
                CREATE_OBJECT_REGEX
            );

        if (objectMatch) {
            state.objectTypes.set(
                objectMatch[2],
                objectMatch[1]
            );
        }

        const valueMatch =
            logicalLine.match(
                CREATE_VALUE_REGEX
            );

        if (valueMatch) {
            state.objectTypes.set(
                valueMatch[2],
                valueMatch[1]
            );
        }

        const lineState =
            cloneAnalysisState(
                state
            );

        const currentObjectType =
            findObjectTypeAtLine(
                model.getValue(),
                lineNumber
            );

        if (currentObjectType) {
            lineState.objectTypes.set(
                "this",
                currentObjectType
            );
        }

        const localTypes =
            findLocalTypesAtLine(
                model.getValue(),
                lineNumber
            );

        for (
            const [name, type]
            of localTypes
        ) {
            lineState.objectTypes.set(
                name,
                type
            );
        }

        const localParameters =
            findLocalParametersAtLine(
                model.getValue(),
                lineNumber
            );

        analyseIdentifierColoursOnLine(
            maskedLine,
            logicalLine,
            lineOffset,
            lineNumber,
            lineState,
            currentObjectType,
            localParameters,
            decorations
        );

        analyseFieldReferencesOnLine(
            maskedLine,
            lineOffset,
            lineNumber,
            lineState,
            decorations
        );

        analyseMethodCallsOnLine(
            maskedLine,
            logicalLine,
            lineOffset,
            lineNumber,
            lineState,
            localParameters,
            decorations,
            markers
        );

        analyseFunctionCallsOnLine(
            maskedLine,
            logicalLine,
            lineOffset,
            lineNumber,
            lineState,
            decorations,
            markers
        );
    }

    return {
        decorations:
            decorations,

        markers:
            markers
    };
}

function createInitialAnalysisState(model) {
    const state = {
        availableFunctions:
            new Set(),

        importedModules:
            new Set(),

        objectTypes:
            new Map(),

        userObjectTypes:
            new Set(),

        userObjectMethods:
            new Map(),

        userObjectFields:
            new Map()
    };

    addDefinitionsDefinedInText(
        model.getValue(),
        state
    );

    addRootProjectDefinitions(
        state
    );

    return state;
}

function addDefinitionsDefinedInText(
    text,
    state
) {
    const lines =
        text.split(/\r?\n/);

    let currentObject = null;
    let objectDepth = 0;

    for (
        const originalLine of lines
    ) {
        const logicalLine =
            getLogicalLine(
                originalLine
            ).text;

        if (currentObject === null) {
            const objectMatch =
                logicalLine.match(
                    OBJECT_DEFINITION_REGEX
                );

            if (objectMatch) {
                currentObject =
                    objectMatch[1];

                state.userObjectTypes.add(
                    currentObject
                );

                if (
                    !state.userObjectMethods.has(
                        currentObject
                    )
                ) {
                    state.userObjectMethods.set(
                        currentObject,
                        new Map()
                    );
                }

                if (
                    !state.userObjectFields.has(
                        currentObject
                    )
                ) {
                    state.userObjectFields.set(
                        currentObject,
                        new Map()
                    );
                }

                objectDepth =
                    countAnalysisBraceChange(
                        logicalLine
                    );

                if (objectDepth <= 0) {
                    currentObject = null;
                    objectDepth = 0;
                }

                continue;
            }

            const functionMatch =
                logicalLine.match(
                    FUNCTION_DEFINITION_REGEX
                );

            if (functionMatch) {
                state.availableFunctions.add(
                    functionMatch[1]
                );
            }

            continue;
        }

        const fieldMatch =
            logicalLine.match(
                OBJECT_FIELD_REGEX
            );

        if (fieldMatch) {
            state.userObjectFields
                .get(currentObject)
                .set(
                    fieldMatch[2],
                    fieldMatch[1]
                );
        }

        const methodMatch =
            logicalLine.match(
                FUNCTION_DEFINITION_REGEX
            );

        if (methodMatch) {
            state.userObjectMethods
                .get(currentObject)
                .set(
                    methodMatch[1],
                    {
                        name: methodMatch[1],
                        parameters: parseParameterNames(
                            methodMatch[2]
                        )
                    }
                );
        }

        objectDepth +=
            countAnalysisBraceChange(
                logicalLine
            );

        if (objectDepth <= 0) {
            currentObject = null;
            objectDepth = 0;
        }
    }
}

function addRootProjectDefinitions(state) {
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

        addDefinitionsDefinedInText(
            child.content || "",
            state
        );
    }
}

function countAnalysisBraceChange(text) {
    let change = 0;
    let quote = null;
    let escaped = false;

    for (
        let i = 0;
        i < text.length;
        i++
    ) {
        const char = text[i];

        if (quote !== null) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === "\\") {
                escaped = true;
                continue;
            }

            if (char === quote) {
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
            char === "/" &&
            text[i + 1] === "/"
        ) {
            break;
        }

        if (char === "{") {
            change++;
        }
        else if (char === "}") {
            change--;
        }
    }

    return change;
}

function parseParameterNames(parameterText) {
    const trimmed =
        parameterText.trim();

    if (trimmed === "") {
        return [];
    }

    return trimmed
        .split(",")
        .map(parameter => {
            const parts =
                parameter
                    .trim()
                    .split(/\s+/);

            return parts[
                parts.length - 1
            ];
        });
}

function parseTypedParameters(parameterText) {
    const types = new Map();

    const trimmed =
        parameterText.trim();

    if (trimmed === "") {
        return types;
    }

    const parameters =
        trimmed.split(",");

    for (
        const rawParameter
        of parameters
    ) {
        const parameter =
            rawParameter.trim();

        const match =
            parameter.match(
                /^(?:([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s+)?([A-Za-z_$][\w$]*)$/
            );

        if (!match) {
            continue;
        }

        types.set(
            match[2],
            match[1] || null
        );
    }

    return types;
}

function findLocalTypesAtLine(
    text,
    targetLineNumber
) {
    const lines =
        text.split(/\r?\n/);

    const limit =
        Math.min(
            targetLineNumber,
            lines.length
        );

    let depth = 0;
    let activeScope = null;

    for (
        let i = 0;
        i < limit;
        i++
    ) {
        const logicalLine =
            getLogicalLine(
                lines[i]
            ).text;

        if (
            activeScope === null
        ) {
            const functionMatch =
                logicalLine.match(
                    FUNCTION_DEFINITION_REGEX
                );
            const constructorMatch =
                logicalLine.match(
                    CONSTRUCTOR_DEFINITION_REGEX
                );

            const parameterText =
                functionMatch
                    ? functionMatch[2]
                    : constructorMatch
                        ? constructorMatch[1]
                        : null;

            if (
                parameterText !== null
            ) {
                const change =
                    countAnalysisBraceChange(
                        logicalLine
                    );

                activeScope = {
                    bodyDepth:
                        depth + change,

                    types:
                        parseTypedParameters(
                            parameterText
                        )
                };
            }
        }
        else if (
            i < targetLineNumber - 1
        ) {
            const objectMatch =
                logicalLine.match(
                    CREATE_OBJECT_REGEX
                );

            if (objectMatch) {
                activeScope.types.set(
                    objectMatch[2],
                    objectMatch[1]
                );
            }

            const valueMatch =
                logicalLine.match(
                    CREATE_VALUE_REGEX
                );

            if (valueMatch) {
                activeScope.types.set(
                    valueMatch[2],
                    valueMatch[1]
                );
            }
        }

        depth +=
            countAnalysisBraceChange(
                logicalLine
            );

        if (
            activeScope !== null &&
            depth < activeScope.bodyDepth
        ) {
            activeScope = null;
        }
    }

    if (
        activeScope === null
    ) {
        return new Map();
    }

    return new Map(
        activeScope.types
    );
}

function findLocalParametersAtLine(
    text,
    targetLineNumber
) {
    const lines =
        text.split(/\r?\n/);

    const limit =
        Math.min(
            targetLineNumber,
            lines.length
        );

    let depth = 0;
    let activeScope = null;

    for (
        let i = 0;
        i < limit;
        i++
    ) {
        const logicalLine =
            getLogicalLine(
                lines[i]
            ).text;

        if (
            activeScope === null
        ) {
            const functionMatch =
                logicalLine.match(
                    FUNCTION_DEFINITION_REGEX
                );

            const constructorMatch =
                logicalLine.match(
                    CONSTRUCTOR_DEFINITION_REGEX
                );

            const parameterText =
                functionMatch
                    ? functionMatch[2]
                    : constructorMatch
                        ? constructorMatch[1]
                        : null;

            if (
                parameterText !== null
            ) {
                const change =
                    countAnalysisBraceChange(
                        logicalLine
                    );

                activeScope = {
                    bodyDepth:
                        depth + change,

                    parameters:
                        new Set(
                            parseParameterNames(
                                parameterText
                            )
                        )
                };
            }
        }

        depth +=
            countAnalysisBraceChange(
                logicalLine
            );

        if (
            activeScope !== null &&
            depth < activeScope.bodyDepth
        ) {
            activeScope = null;
        }
    }

    if (
        activeScope === null
    ) {
        return new Set();
    }

    return new Set(
        activeScope.parameters
    );
}

function cloneAnalysisState(state) {
    const userObjectMethods =
        new Map();

    for (
        const [typeName, methods]
        of state.userObjectMethods
    ) {
        userObjectMethods.set(
            typeName,
            new Map(methods)
        );
    }

    const userObjectFields =
        new Map();

    for (
        const [typeName, fields]
        of state.userObjectFields
    ) {
        userObjectFields.set(
            typeName,
            new Map(fields)
        );
    }

    return {
        availableFunctions:
            new Set(
                state.availableFunctions
            ),

        importedModules:
            new Set(
                state.importedModules
            ),

        objectTypes:
            new Map(
                state.objectTypes
            ),

        userObjectTypes:
            new Set(
                state.userObjectTypes
            ),

        userObjectMethods:
            userObjectMethods,

        userObjectFields:
            userObjectFields
    };
}

function resolveReceiverType(
    receiverExpression,
    state
) {
    const parts =
        receiverExpression.split(".");

    if (
        parts.length === 0
    ) {
        return null;
    }

    let currentType =
        state.objectTypes.get(
            parts[0]
        );

    if (!currentType) {
        return null;
    }

    for (
        let i = 1;
        i < parts.length;
        i++
    ) {
        if (
            !state.userObjectTypes.has(
                currentType
            )
        ) {
            return null;
        }

        const fields =
            state.userObjectFields.get(
                currentType
            );

        if (!fields) {
            return null;
        }

        currentType =
            fields.get(
                parts[i]
            );

        if (!currentType) {
            return null;
        }
    }

    return currentType;
}

function applyImportToAnalysisState(
    state,
    importName
) {
    const projectTarget =
        resolveProjectImport(
            importName
        );

    if (projectTarget) {
        const visited =
            new Set();

        addProjectTargetToState(
            projectTarget,
            state,
            visited
        );

        return;
    }

    const exactCategory =
        getCommandCategory(
            importName
        );

    if (exactCategory) {
        state.importedModules.add(
            importName
        );

        addStandaloneCommandsFromCategory(
            exactCategory,
            state.availableFunctions
        );

        return;
    }

    const prefix =
        importName + ".";

    for (
        const categoryName in orinCommandData
    ) {
        if (
            !categoryName.startsWith(
                prefix
            )
        ) {
            continue;
        }

        const remaining =
            categoryName.slice(
                prefix.length
            );

        if (
            remaining.includes(".")
        ) {
            continue;
        }

        const category =
            getCommandCategory(
                categoryName
            );

        if (!category) {
            continue;
        }

        state.importedModules.add(
            categoryName
        );

        addStandaloneCommandsFromCategory(
            category,
            state.availableFunctions
        );
    }
}

function resolveProjectImport(importName) {
    if (
        typeof orinProject === "undefined" ||
        !orinProject
    ) {
        return null;
    }

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
                        child.name === `${part}.orin`
                    )
            );

        return file || null;
    }

    return current;
}

function addProjectTargetToState(
    target,
    state,
    visited
) {
    if (!target) {
        return;
    }

    if (
        target.id &&
        visited.has(target.id)
    ) {
        return;
    }

    if (target.id) {
        visited.add(
            target.id
        );
    }

    if (
        target.type === "file"
    ) {
        addDefinitionsDefinedInText(
            target.content || "",
            state
        );

        addImportsFromProjectFile(
            target,
            state,
            visited
        );

        return;
    }

    if (
        target.type !== "folder" ||
        !Array.isArray(
            target.children
        )
    ) {
        return;
    }

    for (
        const child of target.children
    ) {
        if (
            child.type !== "file" ||
            !child.name.endsWith(".orin")
        ) {
            continue;
        }

        addProjectTargetToState(
            child,
            state,
            visited
        );
    }
}

function addImportsFromProjectFile(
    file,
    state,
    visited
) {
    const lines =
        (file.content || "")
            .split(/\r?\n/);

    for (
        const originalLine of lines
    ) {
        const logicalLine =
            getLogicalLine(
                originalLine
            ).text;

        const match =
            logicalLine.match(
                IMPORT_REGEX
            );

        if (!match) {
            continue;
        }

        const importName =
            match[1];

        const projectTarget =
            resolveProjectImport(
                importName
            );

        if (projectTarget) {
            addProjectTargetToState(
                projectTarget,
                state,
                visited
            );

            continue;
        }

        const category =
            getCommandCategory(
                importName
            );

        if (category) {
            state.importedModules.add(
                importName
            );

            addStandaloneCommandsFromCategory(
                category,
                state.availableFunctions
            );

            continue;
        }

        const prefix =
            importName + ".";

        for (
            const categoryName in orinCommandData
        ) {
            if (
                !categoryName.startsWith(
                    prefix
                )
            ) {
                continue;
            }

            const remaining =
                categoryName.slice(
                    prefix.length
                );

            if (
                remaining.includes(".")
            ) {
                continue;
            }

            const childCategory =
                getCommandCategory(
                    categoryName
                );

            if (!childCategory) {
                continue;
            }

            state.importedModules.add(
                categoryName
            );

            addStandaloneCommandsFromCategory(
                childCategory,
                state.availableFunctions
            );
        }
    }
}

function getCommandCategory(categoryName) {
    if (
        typeof orinCommandData === "undefined" ||
        !orinCommandData
    ) {
        return null;
    }

    return (
        orinCommandData[categoryName] ||
        null
    );
}

function addStandaloneCommandsFromCategory(
    category,
    output
) {
    if (
        !category ||
        !Array.isArray(
            category.commands
        )
    ) {
        return;
    }

    for (
        const command of category.commands
    ) {
        if (
            !command ||
            !command.name
        ) {
            continue;
        }

        if (
            command.syntax &&
            command.syntax.startsWith("<")
        ) {
            continue;
        }

        output.add(
            command.name
        );
    }
}

function analyseIdentifierColoursOnLine(
    maskedLine,
    originalLine,
    lineOffset,
    lineNumber,
    state,
    currentObjectType,
    localParameters,
    decorations
) {
    const identifierRegex =
        /[A-Za-z_$][\w$]*/g;

    let match;

    while (
        (
            match =
                identifierRegex.exec(
                    maskedLine
                )
        ) !== null
    ) {
        const name =
            match[0];

        if (
            name === "this"
        ) {
            continue;
        }

        let className = null;

        if (
            state.userObjectTypes.has(
                name
            )
        ) {
            className =
                "orin-object-type";
        }
        else if (
            state.objectTypes.has(
                name
            )
        ) {
            className =
                localParameters.has(
                    name
                )
                    ? "orin-parameter"
                    : "orin-variable";
        }
        else if (
            state.availableFunctions.has(
                name
            )
        ) {
            className =
                "orin-valid-function";
        }

        if (!className) {
            continue;
        }

        const startColumn =
            lineOffset +
            match.index +
            1;

        const endColumn =
            startColumn +
            name.length;

        decorations.push({
            range: new monaco.Range(
                lineNumber,
                startColumn,
                lineNumber,
                endColumn
            ),

            options: {
                inlineClassName:
                    className
            }
        });
    }

    const functionMatch =
        originalLine.match(
            FUNCTION_DEFINITION_REGEX
        );

    if (functionMatch) {
        const functionName =
            functionMatch[1];

        const nameIndex =
            originalLine.indexOf(
                functionName
            );

        if (
            nameIndex !== -1
        ) {
            const startColumn =
                lineOffset +
                nameIndex +
                1;

            decorations.push({
                range: new monaco.Range(
                    lineNumber,
                    startColumn,
                    lineNumber,
                    startColumn +
                        functionName.length
                ),

                options: {
                    inlineClassName:
                        currentObjectType
                            ? "orin-valid-method"
                            : "orin-valid-function"
                }
            });
        }
    }

    const fieldMatch =
        originalLine.match(
            OBJECT_FIELD_REGEX
        );

    if (
        currentObjectType &&
        fieldMatch
    ) {
        const fieldName =
            fieldMatch[2];

        const fieldIndex =
            originalLine.lastIndexOf(
                fieldName
            );

        if (
            fieldIndex !== -1
        ) {
            const startColumn =
                lineOffset +
                fieldIndex +
                1;

            decorations.push({
                range: new monaco.Range(
                    lineNumber,
                    startColumn,
                    lineNumber,
                    startColumn +
                        fieldName.length
                ),

                options: {
                    inlineClassName:
                        "orin-field"
                }
            });
        }
    }
}

function analyseFieldReferencesOnLine(
    maskedLine,
    lineOffset,
    lineNumber,
    state,
    decorations
) {
    FIELD_ACCESS_REGEX.lastIndex = 0;

    let match;

    while (
        (
            match =
                FIELD_ACCESS_REGEX.exec(
                    maskedLine
                )
        ) !== null
    ) {
        const receiverExpression =
            match[1];

        const fieldName =
            match[2];

        const objectType =
            resolveReceiverType(
                receiverExpression,
                state
            );

        if (
            !objectType ||
            !state.userObjectTypes.has(
                objectType
            )
        ) {
            continue;
        }

        const fields =
            state.userObjectFields.get(
                objectType
            );

        if (
            !fields ||
            !fields.has(
                fieldName
            )
        ) {
            continue;
        }

        const fieldStart =
            match.index +
            match[0].lastIndexOf(
                fieldName
            );

        const startColumn =
            lineOffset +
            fieldStart +
            1;

        decorations.push({
            range: new monaco.Range(
                lineNumber,
                startColumn,
                lineNumber,
                startColumn +
                    fieldName.length
            ),

            options: {
                inlineClassName:
                    "orin-field"
            }
        });
    }
}

function analyseMethodCallsOnLine(
    maskedLine,
    originalLine,
    lineOffset,
    lineNumber,
    state,
    localParameters,
    decorations,
    markers
) {
    METHOD_CALL_REGEX.lastIndex = 0;

    let match;

    while (
        (
            match =
                METHOD_CALL_REGEX.exec(
                    maskedLine
                )
        ) !== null
    ) {
        if (
            isIdentifierCharacter(
                maskedLine[match.index - 1]
            )
        ) {
            continue;
        }

        const receiverExpression =
            match[1];

        const methodName =
            match[2];

        const methodStart =
            match.index +
            match[0].indexOf(methodName);

        const startColumn =
            lineOffset +
            methodStart +
            1;

        const endColumn =
            startColumn +
            methodName.length;

        const objectType =
            resolveReceiverType(
                receiverExpression,
                state
            );

        const rootReceiver =
            receiverExpression
                .split(".")[0];

        const untypedParameter =
            !objectType &&
            localParameters.has(
                rootReceiver
            );

        if (untypedParameter) {
            continue;
        }

        const valid =
            isMethodValidForType(
                objectType,
                methodName,
                state
            );

        decorations.push({
            range: new monaco.Range(
                lineNumber,
                startColumn,
                lineNumber,
                endColumn
            ),

            options: {
                inlineClassName:
                    valid
                        ? "orin-valid-method"
                        : "orin-invalid-call"
            }
        });

        if (!valid) {
            markers.push({
                severity:
                    monaco.MarkerSeverity.Error,

                message:
                    objectType
                        ? `'${objectType}' has no available method '${methodName}'.`
                        : `Cannot determine the type of '${receiverExpression}', so '${methodName}' cannot be resolved.`,

                startLineNumber:
                    lineNumber,

                startColumn:
                    startColumn,

                endLineNumber:
                    lineNumber,

                endColumn:
                    endColumn
            });
        }
    }
}

function analyseFunctionCallsOnLine(
    maskedLine,
    originalLine,
    lineOffset,
    lineNumber,
    state,
    decorations,
    markers
) {
    FUNCTION_CALL_REGEX.lastIndex = 0;

    let match;

    while (
        (
            match =
                FUNCTION_CALL_REGEX.exec(
                    maskedLine
                )
        ) !== null
    ) {
        if (
            isIdentifierCharacter(
                maskedLine[match.index - 1]
            )
        ) {
            continue;
        }

        const rawMatch =
            match[0];

        const functionName =
            rawMatch
                .slice(
                    0,
                    rawMatch.lastIndexOf("(")
                )
                .trim();

        const nameStart =
            match.index;

        const previousCharacter =
            getPreviousNonWhitespaceCharacter(
                maskedLine,
                nameStart
            );

        if (
            previousCharacter === "."
        ) {
            continue;
        }

        if (
            isFunctionDefinitionAt(
                originalLine,
                nameStart,
                functionName
            )
        ) {
            continue;
        }

        if (
            isNonFunctionKeyword(
                functionName
            )
        ) {
            continue;
        }

        const valid =
            state.availableFunctions.has(
                functionName
            ) ||
            state.userObjectTypes.has(
                functionName
            );
        const startColumn =
            lineOffset +
            nameStart +
            1;

        const endColumn =
            startColumn +
            functionName.length;

        decorations.push({
            range: new monaco.Range(
                lineNumber,
                startColumn,
                lineNumber,
                endColumn
            ),

            options: {
                inlineClassName:
                    valid
                        ? state.userObjectTypes.has(
                            functionName
                        )
                            ? "orin-object-type"
                            : "orin-valid-function"
                            : "orin-invalid-call"
            }
        });

        if (!valid) {
            markers.push({
                severity:
                    monaco.MarkerSeverity.Error,

                message:
                    `Function '${functionName}' is not available here. Define it or import the module/file that provides it.`,

                startLineNumber:
                    lineNumber,

                startColumn:
                    startColumn,

                endLineNumber:
                    lineNumber,

                endColumn:
                    endColumn
            });
        }
    }
}

function isMethodValidForType(
    objectType,
    methodName,
    state
) {
    if (!objectType) {
        return false;
    }

    if (
        state.userObjectTypes.has(
            objectType
        )
    ) {
        const methods =
            state.userObjectMethods.get(
                objectType
            );

        return (
            methods &&
            methods.has(
                methodName
            )
        );
    }

    if (
        !isBuiltInTypeName(objectType) &&
        !state.importedModules.has(
            objectType
        )
    ) {
        return false;
    }

    return getMethodCommandsForType(
        objectType
    ).some(
        command =>
            command.name === methodName
    );
}

function getMethodCommandsForType(typeName){
    if(typeof orinCommandData === "undefined" || !orinCommandData){return [];}

    const exactCategory = getCommandCategory(typeName);

    // Imported module objects can call any function in their module
    if(exactCategory && !isBuiltInTypeName(typeName)){
        return exactCategory.commands.filter(command =>
            command &&
            command.name &&
            command.syntax
        );
    }

    const aliases = new Set([
        typeName,
        typeName.split(".").pop()
    ]);

    const commands = [];
    const seen = new Set();

    const categories = exactCategory ? [exactCategory] : Object.values(orinCommandData);

    for(const category of categories){
        if(!category || !Array.isArray(category.commands)){continue;}

        for(const command of category.commands){
            if(!command || !command.name || !command.syntax){continue;}

            const syntax = command.syntax.trim();

            if(!syntax.startsWith("<")){continue;}

            const closingBracket = syntax.indexOf(">");

            if(closingBracket <= 1){continue;}

            const receiverName = syntax.slice(1, closingBracket);

            if(!aliases.has(receiverName)){continue;}

            const key = `${receiverName}:${command.name}`;

            if(seen.has(key)){continue;}

            seen.add(key);
            commands.push(command);
        }
    }

    return commands;
}

function isBuiltInTypeName(name) {
    return [
        "integer",
        "double",
        "string",
        "boolean",
        "char",
        "array"
    ].includes(name);
}

function isFunctionDefinitionAt(
    line,
    startIndex,
    functionName
) {
    const before =
        line.slice(
            0,
            startIndex
        );

    return (
        before.trimEnd()
            .endsWith(
                "define function"
            )
    );
}

function isNonFunctionKeyword(name) {
    return [
        "if",
        "while",
        "for",
        "switch",
        "catch",
        "repeat",
        "constructor"
    ].includes(name);
}


function isIdentifierCharacter(char) {
    if (!char) {
        return false;
    }

    return /[A-Za-z0-9_$]/.test(
        char
    );
}

function getPreviousNonWhitespaceCharacter(
    text,
    index
) {
    for (
        let i = index - 1;
        i >= 0;
        i--
    ) {
        if (
            !/\s/.test(
                text[i]
            )
        ) {
            return text[i];
        }
    }

    return "";
}

function getLogicalLine(line) {
    const leadingWhitespaceLength =
        line.length -
        line.trimStart().length;

    const afterWhitespace =
        line.slice(
            leadingWhitespaceLength
        );

    if (
        afterWhitespace.startsWith(
            "orin>"
        )
    ) {
        let offset =
            leadingWhitespaceLength + 5;

        while (
            offset < line.length &&
            line[offset] === " "
        ) {
            offset++;
        }

        return {
            text:
                line.slice(offset),

            offset:
                offset,

            isPrompt:
                true
        };
    }

    if (
        afterWhitespace.startsWith(
            "..."
        )
    ) {
        let offset =
            leadingWhitespaceLength + 3;

        while (
            offset < line.length &&
            line[offset] === " "
        ) {
            offset++;
        }

        return {
            text:
                line.slice(offset),

            offset:
                offset,

            isPrompt:
                true
        };
    }

    return {
        text:
            line,

        offset:
            0,

        isPrompt:
            false
    };
}

function maskStringsAndComments(line) {
    let output = "";
    let quote = null;
    let escaped = false;

    for (
        let i = 0;
        i < line.length;
        i++
    ) {
        const char =
            line[i];

        if (quote !== null) {
            output += " ";

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
            output += " ";
            continue;
        }

        if (
            char === "/" &&
            line[i + 1] === "/"
        ) {
            output +=
                " ".repeat(
                    line.length - i
                );

            break;
        }

        output += char;
    }

    return output;
}

function findObjectTypeAtLine(
    text,
    targetLineNumber
) {
    const lines =
        text.split(/\r?\n/);

    let currentObject = null;
    let objectDepth = 0;

    const limit =
        Math.min(
            targetLineNumber,
            lines.length
        );

    for (
        let i = 0;
        i < limit;
        i++
    ) {
        const line =
            getLogicalLine(
                lines[i]
            ).text;

        if (currentObject === null) {
            const objectMatch =
                line.match(
                    OBJECT_DEFINITION_REGEX
                );

            if (!objectMatch) {
                continue;
            }

            currentObject =
                objectMatch[1];

            objectDepth =
                countAnalysisBraceChange(
                    line
                );

            if (objectDepth <= 0) {
                currentObject = null;
                objectDepth = 0;
            }

            continue;
        }

        objectDepth +=
            countAnalysisBraceChange(
                line
            );

        if (objectDepth <= 0) {
            currentObject = null;
            objectDepth = 0;
        }
    }

    return currentObject;
}

function buildCompletionItems(
    model,
    position
) {
    const state =
        createInitialAnalysisState(
            model
        );

    for (
        let lineNumber = 1;
        lineNumber <= position.lineNumber;
        lineNumber++
    ) {
        const originalLine =
            model.getLineContent(
                lineNumber
            );

        const logicalLine =
            getLogicalLine(
                originalLine
            ).text;

        const importMatch =
            logicalLine.match(
                IMPORT_REGEX
            );

        if (importMatch) {
            applyImportToAnalysisState(
                state,
                importMatch[1]
            );
        }

        const objectMatch =
            logicalLine.match(
                CREATE_OBJECT_REGEX
            );

        if (objectMatch) {
            state.objectTypes.set(
                objectMatch[2],
                objectMatch[1]
            );
        }

        const valueMatch =
            logicalLine.match(
                CREATE_VALUE_REGEX
            );

        if (valueMatch) {
            state.objectTypes.set(
                valueMatch[2],
                valueMatch[1]
            );
        }
    }

    const currentObjectType =
        findObjectTypeAtLine(
            model.getValue(),
            position.lineNumber
        );

    if (currentObjectType) {
        state.objectTypes.set(
            "this",
            currentObjectType
        );
    }
    else {
        state.objectTypes.delete(
            "this"
        );
    }

    const localTypes =
        findLocalTypesAtLine(
            model.getValue(),
            position.lineNumber
        );

    for (
        const [name, type]
        of localTypes
    ) {
        state.objectTypes.set(
            name,
            type
        );
    }

    const lineText =
        model.getLineContent(
            position.lineNumber
        );

    const beforeCursor =
        lineText.slice(
            0,
            position.column - 1
        );

    const dotIndex =
        beforeCursor.lastIndexOf(".");

    if (
        dotIndex !== -1
    ) {
        const receiverExpression =
            getMemberPathBeforeIndex(
                beforeCursor,
                dotIndex
            );

        if (
            receiverExpression
        ) {
            return buildMethodCompletionItems(
                receiverExpression,
                state,
                position,
                model
            );
        }
    }

    return buildFunctionCompletionItems(
        state,
        position,
        model
    );
}

function getMemberPathBeforeIndex(
    text,
    index
) {
    let end =
        index;

    let start =
        end;

    while (
        start > 0 &&
        /[A-Za-z0-9_$.]/.test(
            text[start - 1]
        )
    ) {
        start--;
    }

    const value =
        text.slice(
            start,
            end
        );

    if (
        !new RegExp(
            `^${ORIN_IDENTIFIER}(?:\\.${ORIN_IDENTIFIER})*$`
        ).test(value)
    ) {
        return null;
    }

    return value;
}

function getIdentifierBeforeIndex(
    text,
    index
) {
    let end =
        index;

    let start =
        end;

    while (
        start > 0 &&
        /[A-Za-z0-9_$]/.test(
            text[start - 1]
        )
    ) {
        start--;
    }

    const value =
        text.slice(
            start,
            end
        );

    if (
        !new RegExp(
            `^${ORIN_IDENTIFIER}$`
        ).test(value)
    ) {
        return null;
    }

    return value;
}

function buildMethodCompletionItems(
    receiverExpression,
    state,
    position,
    model
) {
    const objectType =
        resolveReceiverType(
            receiverExpression,
            state
        );

    if (!objectType) {
        return {
            suggestions: []
        };
    }

    const userMethods =
        state.userObjectMethods.get(
            objectType
        );

    if (userMethods) {
        return buildUserObjectMethodCompletionItems(
            userMethods,
            position,
            model
        );
    }

    if (
        !isBuiltInTypeName(objectType) &&
        !state.importedModules.has(
            objectType
        )
    ) {
        return {
            suggestions: []
        };
    }

    const methodCommands =
        getMethodCommandsForType(
            objectType
        );

    if (
        methodCommands.length === 0
    ) {
        return {
            suggestions: []
        };
    }

    const word =
        model.getWordUntilPosition(
            position
        );

    const range = {
        startLineNumber:
            position.lineNumber,

        endLineNumber:
            position.lineNumber,

        startColumn:
            word.startColumn,

        endColumn:
            position.column
    };

    const suggestions = [];

    for (
        const command of methodCommands
    ) {
        if (
            !command.syntax ||
            !command.syntax.startsWith("<")
        ) {
            continue;
        }

        suggestions.push(
            createCompletionItem(
                command,
                range,
                monaco.languages.CompletionItemKind.Method
            )
        );
    }

    return {
        suggestions:
            suggestions
    };
}

function buildUserObjectMethodCompletionItems(
    methods,
    position,
    model
) {
    const word =
        model.getWordUntilPosition(
            position
        );

    const range = {
        startLineNumber:
            position.lineNumber,

        endLineNumber:
            position.lineNumber,

        startColumn:
            word.startColumn,

        endColumn:
            position.column
    };

    const suggestions = [];

    for (
        const method
        of methods.values()
    ) {
        suggestions.push({
            label:
                method.name,

            kind:
                monaco.languages.CompletionItemKind.Method,

            detail:
                `User object method: ${method.name}`,

            insertText:
                createUserFunctionSnippet(
                    method.name,
                    method.parameters
                ),

            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,

            range:
                range
        });
    }

    return {
        suggestions:
            suggestions
    };
}

function buildFunctionCompletionItems(
    state,
    position,
    model
) {
    const word =
        model.getWordUntilPosition(
            position
        );

    const range = {
        startLineNumber:
            position.lineNumber,

        endLineNumber:
            position.lineNumber,

        startColumn:
            word.startColumn,

        endColumn:
            position.column
    };

    const suggestions = [];

    for (
        const functionName
        of state.availableFunctions
    ) {
        const command =
            findAvailableCommandDefinition(
                functionName,
                state
            );

        if (command) {
            suggestions.push(
                createCompletionItem(
                    command,
                    range,
                    monaco.languages.CompletionItemKind.Function
                )
            );

            continue;
        }

        suggestions.push({
            label:
                functionName,

            kind:
                monaco.languages.CompletionItemKind.Function,

            insertText:
                `${functionName}($0)`,

            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,

            range:
                range
        });
    }

    for (
        const objectType
        of state.userObjectTypes
    ) {
        suggestions.push({
            label:
                objectType,

            kind:
                monaco.languages.CompletionItemKind.Constructor,

            detail:
                `User object constructor: ${objectType}`,

            insertText:
                `${objectType}($0)`,

            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,

            range:
                range
        });
    }

    return {
        suggestions:
            suggestions
    };
}

function createUserFunctionSnippet(
    name,
    parameters
) {
    if (
        !parameters ||
        parameters.length === 0
    ) {
        return `${name}()`;
    }

    const placeholders = [];

    for (
        let i = 0;
        i < parameters.length;
        i++
    ) {
        placeholders.push(
            `\${${i + 1}:${parameters[i]}}`
        );
    }

    return (
        `${name}(` +
        placeholders.join(", ") +
        ")"
    );
}

function findAvailableCommandDefinition(
    functionName,
    state
) {
    for (
        const moduleName
        of state.importedModules
    ) {
        const category =
            getCommandCategory(
                moduleName
            );

        if (
            !category ||
            !Array.isArray(
                category.commands
            )
        ) {
            continue;
        }

        const command =
            category.commands.find(
                current =>
                    current &&
                    current.name === functionName &&
                    (
                        !current.syntax ||
                        !current.syntax.startsWith("<")
                    )
            );

        if (command) {
            return command;
        }
    }

    return null;
}

function createCompletionItem(
    command,
    range,
    kind
) {
    return {
        label:
            command.name,

        kind:
            kind,

        detail:
            command.syntax || command.name,

        documentation:
            command.description || "",

        insertText:
            createCommandSnippet(
                command
            ),

        insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,

        range:
            range
    };
}

function createCommandSnippet(command) {
    if (
        !command.syntax
    ) {
        return `${command.name}($0)`;
    }

    const syntax =
        command.syntax.trim();

    const openingBracket =
        syntax.indexOf("(");

    const closingBracket =
        syntax.lastIndexOf(")");

    if (
        openingBracket === -1 ||
        closingBracket === -1 ||
        closingBracket < openingBracket
    ) {
        return command.name;
    }

    const parameterText =
        syntax
            .slice(
                openingBracket + 1,
                closingBracket
            )
            .trim();

    if (
        parameterText === ""
    ) {
        return `${command.name}()`;
    }

    const parameters =
        parameterText.split(",");

    const placeholders = [];

    for (
        let i = 0;
        i < parameters.length;
        i++
    ) {
        const parameter =
            parameters[i].trim();

        placeholders.push(
            `\${${i + 1}:${parameter}}`
        );
    }

    return (
        `${command.name}(` +
        placeholders.join(", ") +
        ")"
    );
}