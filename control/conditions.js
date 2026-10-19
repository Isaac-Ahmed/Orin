import {
    readBlock,
    skipEmptyLines
} from "./blocks.js";


const IF_REGEX =
    /^\s*if\s*\((.*)\)\s*\{\s*$/;

const ELSE_IF_REGEX =
    /^\s*else\s+if\s*\((.*)\)\s*\{\s*$/;

const ELSE_REGEX =
    /^\s*else\s*\{\s*$/;


// Check for if
export function isIfStatement(
    line
) {
    return (
        IF_REGEX.test(
            line
        )
    );
}


// Check for else if
export function isElseIfStatement(
    line
) {
    return (
        ELSE_IF_REGEX.test(
            line
        )
    );
}


// Check for else
export function isElseStatement(
    line
) {
    return (
        ELSE_REGEX.test(
            line
        )
    );
}


// Get an if condition
export function getIfCondition(
    line
) {
    const match =
        line.match(
            IF_REGEX
        );

    if (
        !match
    ) {
        throw new Error(
            "Invalid if statement"
        );
    }

    return (
        match[1].trim()
    );
}


// Get an else-if condition
export function getElseIfCondition(
    line
) {
    const match =
        line.match(
            ELSE_IF_REGEX
        );

    if (
        !match
    ) {
        throw new Error(
            "Invalid else if statement"
        );
    }

    return (
        match[1].trim()
    );
}


// Evaluate an Orin condition
export async function evaluateCondition(
    expression,
    evaluateExpression
) {
    const result =
        await evaluateLogicalExpression(
            expression.trim(),
            evaluateExpression
        );

    if (
        typeof result !==
        "boolean"
    ) {
        throw new Error(
            "Condition must evaluate to a boolean"
        );
    }

    return result;
}


// Evaluate logical operators
async function evaluateLogicalExpression(
    expression,
    evaluateExpression
) {
    expression =
        stripOuterParentheses(
            expression.trim()
        );

    if (
        expression === ""
    ) {
        throw new Error(
            "Condition cannot be empty"
        );
    }

    // OR
    const orParts =
        splitAtTopLevelOperator(
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
            const result =
                await evaluateLogicalExpression(
                    part,
                    evaluateExpression
                );

            if (
                ensureBoolean(
                    result
                )
            ) {
                return true;
            }
        }

        return false;
    }

    // AND
    const andParts =
        splitAtTopLevelOperator(
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
            const result =
                await evaluateLogicalExpression(
                    part,
                    evaluateExpression
                );

            if (
                !ensureBoolean(
                    result
                )
            ) {
                return false;
            }
        }

        return true;
    }

    // NOT
    if (
        expression.startsWith("!") &&
        !expression.startsWith("!=")
    ) {
        const remaining =
            expression
                .slice(1)
                .trim();

        if (
            remaining === ""
        ) {
            throw new Error(
                "Expected expression after '!'"
            );
        }

        const result =
            await evaluateLogicalExpression(
                remaining,
                evaluateExpression
            );

        return (
            !ensureBoolean(
                result
            )
        );
    }

    // Comparisons
    const comparison =
        findTopLevelComparison(
            expression
        );

    if (
        comparison
    ) {
        const leftText =
            expression
                .slice(
                    0,
                    comparison.index
                )
                .trim();

        const rightText =
            expression
                .slice(
                    comparison.index +
                    comparison.operator.length
                )
                .trim();

        if (
            leftText === "" ||
            rightText === ""
        ) {
            throw new Error(
                `Invalid comparison using '${comparison.operator}'`
            );
        }

        const left =
            await evaluateExpression(
                leftText
            );

        const right =
            await evaluateExpression(
                rightText
            );

        return compareValues(
            left,
            right,
            comparison.operator
        );
    }

    // Boolean variable or function
    return (
        await evaluateExpression(
            expression
        )
    );
}


// Compare values
function compareValues(
    left,
    right,
    operator
) {
    switch (
        operator
    ) {
        case "==":
            return (
                left === right
            );

        case "!=":
            return (
                left !== right
            );

        case ">":
            return (
                left > right
            );

        case "<":
            return (
                left < right
            );

        case ">=":
            return (
                left >= right
            );

        case "<=":
            return (
                left <= right
            );

        default:
            throw new Error(
                `Unknown comparison operator '${operator}'`
            );
    }
}


// Require boolean values
function ensureBoolean(
    value
) {
    if (
        typeof value !==
        "boolean"
    ) {
        throw new Error(
            "Logical operators require boolean values"
        );
    }

    return value;
}


// Find comparison outside nested brackets and strings
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
                    "Unexpected ')'"
                );
            }

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

    if (
        depth !== 0
    ) {
        throw new Error(
            "Unclosed parentheses in condition"
        );
    }

    return null;
}


// Split around | or &
function splitAtTopLevelOperator(
    expression,
    operator
) {
    const parts = [];

    let start = 0;

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
                    "Unexpected ')'"
                );
            }

            continue;
        }

        if (
            depth === 0 &&
            char === operator
        ) {
            const part =
                expression
                    .slice(
                        start,
                        i
                    )
                    .trim();

            if (
                part === ""
            ) {
                throw new Error(
                    `Missing expression before '${operator}'`
                );
            }

            parts.push(
                part
            );

            start =
                i + 1;
        }
    }

    if (
        depth !== 0
    ) {
        throw new Error(
            "Unclosed parentheses in condition"
        );
    }

    if (
        parts.length === 0
    ) {
        return [
            expression
        ];
    }

    const finalPart =
        expression
            .slice(
                start
            )
            .trim();

    if (
        finalPart === ""
    ) {
        throw new Error(
            `Missing expression after '${operator}'`
        );
    }

    parts.push(
        finalPart
    );

    return parts;
}


// Remove wrapping parentheses
function stripOuterParentheses(
    expression
) {
    let result =
        expression.trim();

    while (
        result.startsWith("(") &&
        result.endsWith(")") &&
        parenthesesWrapEntireExpression(
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


// Check wrapping parentheses
function parenthesesWrapEntireExpression(
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

            if (
                depth < 0
            ) {
                return false;
            }
        }
    }

    return (
        depth === 0
    );
}


// Read if / else-if / else
export function readConditionalChain(
    lines,
    startIndex
) {
    const branches = [];

    let index =
        startIndex;

    const firstLine =
        lines[index];

    if (
        !isIfStatement(
            firstLine
        )
    ) {
        throw new Error(
            "Conditional chain must begin with an if statement"
        );
    }

    const firstBlock =
        readBlock(
            lines,
            index
        );

    branches.push({
        type:
            "if",

        condition:
            getIfCondition(
                firstLine
            ),

        body:
            firstBlock.body,

        line:
            index + 1
    });

    index =
        firstBlock.endIndex + 1;

    while (
        index <
        lines.length
    ) {
        index =
            skipEmptyLines(
                lines,
                index
            );

        if (
            index >=
            lines.length
        ) {
            break;
        }

        const line =
            lines[index];

        if (
            isElseIfStatement(
                line
            )
        ) {
            const block =
                readBlock(
                    lines,
                    index
                );

            branches.push({
                type:
                    "else if",

                condition:
                    getElseIfCondition(
                        line
                    ),

                body:
                    block.body,

                line:
                    index + 1
            });

            index =
                block.endIndex + 1;

            continue;
        }

        if (
            isElseStatement(
                line
            )
        ) {
            const block =
                readBlock(
                    lines,
                    index
                );

            branches.push({
                type:
                    "else",

                condition:
                    null,

                body:
                    block.body,

                line:
                    index + 1
            });

            index =
                block.endIndex + 1;
        }

        break;
    }

    return {
        branches:
            branches,

        nextIndex:
            index
    };
}


// Execute if / else-if / else
export async function executeConditionalChain(
    lines,
    startIndex,
    evaluateExpression,
    executeBlock
) {
    const chain =
        readConditionalChain(
            lines,
            startIndex
        );

    for (
        const branch
        of chain.branches
    ) {
        if (
            branch.type ===
            "else"
        ) {
            await executeBlock(
                branch.body,
                branch.line
            );

            return (
                chain.nextIndex
            );
        }

        const result =
            await evaluateCondition(
                branch.condition,
                evaluateExpression
            );

        if (
            result
        ) {
            await executeBlock(
                branch.body,
                branch.line
            );

            return (
                chain.nextIndex
            );
        }
    }

    return (
        chain.nextIndex
    );
}