import {
    readBlock
} from "./blocks.js";

import {
    evaluateCondition
} from "./conditions.js";


const REPEAT_REGEX =
    /^\s*repeat\s*\((.*)\)\s*\{\s*$/;

const FOR_REGEX =
    /^\s*for\s*\((.*)\)\s*\{\s*$/;


// Check for repeat
export function isRepeatStatement(
    line
) {
    return (
        REPEAT_REGEX.test(
            line
        )
    );
}


// Check for for
export function isForStatement(
    line
) {
    return (
        FOR_REGEX.test(
            line
        )
    );
}


// Get repeat count expression
export function getRepeatExpression(
    line
) {
    const match =
        line.match(
            REPEAT_REGEX
        );

    if (
        !match
    ) {
        throw new Error(
            "Invalid repeat statement"
        );
    }

    return (
        match[1].trim()
    );
}


// Get for-loop header
export function getForParts(
    line
) {
    const match =
        line.match(
            FOR_REGEX
        );

    if (
        !match
    ) {
        throw new Error(
            "Invalid for statement"
        );
    }

    const parts =
        splitForHeader(
            match[1]
        );

    if (
        parts.length !== 3
    ) {
        throw new Error(
            "For loop requires an initialiser, condition and update"
        );
    }

    return {
        initialiser:
            parts[0].trim(),

        condition:
            parts[1].trim(),

        update:
            parts[2].trim()
    };
}


// Read a repeat loop
export function readRepeatLoop(
    lines,
    startIndex
) {
    const header =
        lines[startIndex];

    if (
        !isRepeatStatement(
            header
        )
    ) {
        throw new Error(
            "Invalid repeat statement"
        );
    }

    const block =
        readBlock(
            lines,
            startIndex
        );

    return {
        countExpression:
            getRepeatExpression(
                header
            ),

        body:
            block.body,

        line:
            startIndex + 1,

        nextIndex:
            block.endIndex + 1
    };
}


// Read a for loop
export function readForLoop(
    lines,
    startIndex
) {
    const header =
        lines[startIndex];

    if (
        !isForStatement(
            header
        )
    ) {
        throw new Error(
            "Invalid for statement"
        );
    }

    const parts =
        getForParts(
            header
        );

    const block =
        readBlock(
            lines,
            startIndex
        );

    return {
        initialiser:
            parts.initialiser,

        condition:
            parts.condition,

        update:
            parts.update,

        body:
            block.body,

        line:
            startIndex + 1,

        nextIndex:
            block.endIndex + 1
    };
}


// Execute repeat
export async function executeRepeatLoop(
    lines,
    startIndex,
    evaluateExpression,
    executeBlock,
    shouldStop
) {
    const loop =
        readRepeatLoop(
            lines,
            startIndex
        );

    const count =
        await evaluateExpression(
            loop.countExpression
        );

    if (
        !Number.isInteger(
            count
        )
    ) {
        throw new Error(
            "repeat() requires an integer"
        );
    }

    if (
        count < 0
    ) {
        throw new Error(
            "repeat() cannot use a negative value"
        );
    }

    for (
        let i = 0;
        i < count;
        i++
    ) {
        if (
            typeof shouldStop ===
                "function" &&
            shouldStop()
        ) {
            break;
        }

        await executeBlock(
            loop.body,
            loop.line
        );

        if (
            typeof shouldStop ===
                "function" &&
            shouldStop()
        ) {
            break;
        }

        if (
            (i + 1) % 50 === 0
        ) {
            await yieldToBrowser();
        }
    }

    return (
        loop.nextIndex
    );
}


// Execute for
export async function executeForLoop(
    lines,
    startIndex,
    evaluateExpression,
    executeStatement,
    executeBlock,
    shouldStop
) {
    const loop =
        readForLoop(
            lines,
            startIndex
        );

    if (
        loop.initialiser !==
        ""
    ) {
        await executeStatement(
            ensureSemicolon(
                loop.initialiser
            )
        );
    }

    let iterations = 0;

    while (
        loop.condition === "" ||
        await evaluateCondition(
            loop.condition,
            evaluateExpression
        )
    ) {
        if (
            typeof shouldStop ===
                "function" &&
            shouldStop()
        ) {
            break;
        }

        await executeBlock(
            loop.body,
            loop.line
        );

        if (
            typeof shouldStop ===
                "function" &&
            shouldStop()
        ) {
            break;
        }

        if (
            loop.update !==
            ""
        ) {
            await executeStatement(
                ensureSemicolon(
                    loop.update
                )
            );
        }

        iterations++;

        if (
            iterations % 50 === 0
        ) {
            await yieldToBrowser();
        }
    }

    return (
        loop.nextIndex
    );
}


// Split for header around top-level semicolons
function splitForHeader(
    header
) {
    const parts = [];

    let start = 0;

    let depth = 0;

    let quote = null;

    let escaped = false;

    for (
        let i = 0;
        i < header.length;
        i++
    ) {
        const char =
            header[i];

        if (
            quote !== null
        ) {
            if (
                escaped
            ) {
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
            continue;
        }

        if (
            char === ")"
        ) {
            depth--;

            if (
                depth < 0
            ) {
                throw new Error(
                    "Unexpected ')' in for loop"
                );
            }

            continue;
        }

        if (
            depth === 0 &&
            char === ";"
        ) {
            parts.push(
                header
                    .slice(
                        start,
                        i
                    )
                    .trim()
            );

            start =
                i + 1;
        }
    }

    if (
        depth !== 0
    ) {
        throw new Error(
            "Unclosed parentheses in for loop"
        );
    }

    parts.push(
        header
            .slice(
                start
            )
            .trim()
    );

    return parts;
}


// Add semicolon if needed
function ensureSemicolon(
    statement
) {
    const trimmed =
        statement.trim();

    if (
        trimmed.endsWith(";")
    ) {
        return trimmed;
    }

    return (
        trimmed + ";"
    );
}

async function yieldToBrowser() {
    await new Promise(
        resolve => setTimeout(resolve, 0)
    );
}