// Read everything inside a brace block
export function readBlock(
    lines,
    headerIndex
) {
    const header =
        lines[headerIndex];

    const openingBrace =
        findOpeningBrace(
            header
        );

    if (
        openingBrace === -1
    ) {
        throw new Error(
            `Expected '{' on line ${headerIndex + 1}`
        );
    }

    let depth = 1;

    let quote = null;

    let escaped = false;

    const body = [];

    for (
        let lineIndex = headerIndex;
        lineIndex < lines.length;
        lineIndex++
    ) {
        const line =
            lines[lineIndex];

        const start =
            lineIndex === headerIndex
                ? openingBrace + 1
                : 0;

        let bodyPart = "";

        for (
            let i = start;
            i < line.length;
            i++
        ) {
            const char =
                line[i];

            // Inside a string or char
            if (
                quote !== null
            ) {
                bodyPart +=
                    char;

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

            // Start string or char
            if (
                char === '"' ||
                char === "'"
            ) {
                quote =
                    char;

                bodyPart +=
                    char;

                continue;
            }

            // Ignore braces inside comments
            if (
                char === "/" &&
                line[i + 1] === "/"
            ) {
                bodyPart +=
                    line.slice(i);

                break;
            }

            // Nested block
            if (
                char === "{"
            ) {
                depth++;

                bodyPart +=
                    char;

                continue;
            }

            // End block
            if (
                char === "}"
            ) {
                depth--;

                if (
                    depth === 0
                ) {
                    if (
                        bodyPart.trim() !==
                        ""
                    ) {
                        body.push(
                            bodyPart
                        );
                    }

                    return {
                        body:
                            body,

                        endIndex:
                            lineIndex
                    };
                }

                if (
                    depth < 0
                ) {
                    throw new Error(
                        `Unexpected '}' on line ${lineIndex + 1}`
                    );
                }

                bodyPart +=
                    char;

                continue;
            }

            bodyPart +=
                char;
        }

        if (
            lineIndex !== headerIndex ||
            bodyPart.trim() !== ""
        ) {
            body.push(
                bodyPart
            );
        }
    }

    throw new Error(
        `Block starting on line ${headerIndex + 1} is missing '}'`
    );
}


// Find the opening brace of a block
export function findOpeningBrace(
    line
) {
    let quote = null;

    let escaped = false;

    for (
        let i = 0;
        i < line.length;
        i++
    ) {
        const char =
            line[i];

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
            char === "/" &&
            line[i + 1] === "/"
        ) {
            return -1;
        }

        if (
            char === "{"
        ) {
            return i;
        }
    }

    return -1;
}


// Skip blank and comment-only lines
export function skipEmptyLines(
    lines,
    startIndex
) {
    let index =
        startIndex;

    while (
        index <
        lines.length
    ) {
        const trimmed =
            lines[index].trim();

        if (
            trimmed === "" ||
            trimmed.startsWith("//")
        ) {
            index++;
            continue;
        }

        break;
    }

    return index;
}