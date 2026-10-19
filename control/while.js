import {
    readBlock
} from "./blocks.js";

import {
    evaluateCondition
} from "./conditions.js";


const WHILE_REGEX =
    /^\s*while\s*\((.*)\)\s*\{\s*$/;


// Check for while
export function isWhileStatement(
    line
) {
    return (
        WHILE_REGEX.test(
            line
        )
    );
}


// Get while condition
export function getWhileCondition(
    line
) {
    const match =
        line.match(
            WHILE_REGEX
        );

    if (
        !match
    ) {
        throw new Error(
            "Invalid while statement"
        );
    }

    return (
        match[1].trim()
    );
}


// Read a while loop
export function readWhileLoop(
    lines,
    startIndex
) {
    const header =
        lines[startIndex];

    if (
        !isWhileStatement(
            header
        )
    ) {
        throw new Error(
            "Invalid while statement"
        );
    }

    const block =
        readBlock(
            lines,
            startIndex
        );

    return {
        condition:
            getWhileCondition(
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


// Execute a while loop
export async function executeWhileLoop(
    lines,
    startIndex,
    evaluateExpression,
    executeBlock,
    shouldStop
) {
    const loop =
        readWhileLoop(
            lines,
            startIndex
        );

    let iterations = 0;

    while (
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

async function yieldToBrowser() {
    await new Promise(
        resolve => setTimeout(resolve, 0)
    );
}