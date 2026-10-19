// Return a line of text
export function getLine() {
    return waitForInput();
}


// Return an integer
export async function getInt() {
    const input =
        await waitForInput();

    if (
        !/^[+-]?\d+$/.test(
            input.trim()
        )
    ) {
        throw new Error(
            "Input must be an integer"
        );
    }

    const value =
        Number(
            input
        );

    if (
        !Number.isSafeInteger(
            value
        )
    ) {
        throw new Error(
            "Integer is outside the supported range"
        );
    }

    return value;
}


// Return a double
export async function getDouble() {
    const input =
        await waitForInput();

    if (
        input.trim() === ""
    ) {
        throw new Error(
            "Input must be a number"
        );
    }

    const value =
        Number(
            input
        );

    if (
        !Number.isFinite(
            value
        )
    ) {
        throw new Error(
            "Input must be a number"
        );
    }

    return value;
}


// Return a boolean
export async function getBoolean() {
    const input =
        (
            await waitForInput()
        )
            .trim()
            .toLowerCase();

    if (
        input === "true"
    ) {
        return true;
    }

    if (
        input === "false"
    ) {
        return false;
    }

    throw new Error(
        "Input must be true or false"
    );
}


// Return one character
export async function getChar() {
    const input =
        await waitForInput();

    if (
        [...input].length !== 1
    ) {
        throw new Error(
            "Input must be exactly one character"
        );
    }

    return input;
}


// Wait for terminal input
function waitForInput() {
    return new Promise(
        (resolve, reject) => {
            if (
                typeof terminalEditor === "undefined" ||
                !terminalEditor
            ) {
                reject(
                    new Error(
                        "Terminal is not available"
                    )
                );

                return;
            }

            const model =
                terminalEditor.getModel();

            if (!model) {
                reject(
                    new Error(
                        "Terminal model is not available"
                    )
                );

                return;
            }

            const previousMode =
                typeof terminalMode !== "undefined"
                    ? terminalMode
                    : "running";

            let finished = false;

            if (
                typeof terminalMode !== "undefined"
            ) {
                terminalMode =
                    "input";
            }

            terminalEditor.updateOptions({
                readOnly: false
            });

            const inputStart =
                model.getValueLength();

            moveInputCursorToEnd();

            terminalEditor.focus();


            // Keep the cursor inside the current input
            const cursorListener =
                terminalEditor.onDidChangeCursorPosition(
                    function () {
                        const position =
                            terminalEditor.getPosition();

                        if (!position) {
                            return;
                        }

                        const offset =
                            model.getOffsetAt(
                                position
                            );

                        if (
                            offset <
                            inputStart
                        ) {
                            terminalEditor.setPosition(
                                model.getPositionAt(
                                    inputStart
                                )
                            );
                        }
                    }
                );


            // Handle input keys
            const keyListener =
                terminalEditor.onKeyDown(
                    function (event) {
                        const selection =
                            terminalEditor.getSelection();

                        if (!selection) {
                            return;
                        }

                        const startOffset =
                            model.getOffsetAt(
                                selection.getStartPosition()
                            );

                        const endOffset =
                            model.getOffsetAt(
                                selection.getEndPosition()
                            );


                        // Submit input
                        if (
                            event.keyCode ===
                            monaco.KeyCode.Enter
                        ) {
                            event.preventDefault();
                            event.stopPropagation();

                            const input =
                                model
                                    .getValue()
                                    .slice(
                                        inputStart
                                    );

                            appendInputText(
                                "\n"
                            );

                            finishInput();

                            resolve(
                                input
                            );

                            return;
                        }


                        // Protect previous output from Backspace
                        if (
                            event.keyCode ===
                                monaco.KeyCode.Backspace &&
                            startOffset <=
                                inputStart &&
                            endOffset <=
                                inputStart
                        ) {
                            event.preventDefault();
                            event.stopPropagation();

                            return;
                        }


                        // Protect previous output from Delete
                        if (
                            event.keyCode ===
                                monaco.KeyCode.Delete &&
                            startOffset <
                                inputStart
                        ) {
                            event.preventDefault();
                            event.stopPropagation();

                            return;
                        }


                        // Keep Home inside current input
                        if (
                            event.keyCode ===
                            monaco.KeyCode.Home
                        ) {
                            event.preventDefault();
                            event.stopPropagation();

                            terminalEditor.setPosition(
                                model.getPositionAt(
                                    inputStart
                                )
                            );

                            return;
                        }


                        // Stop Left moving into previous output
                        if (
                            event.keyCode ===
                                monaco.KeyCode.LeftArrow &&
                            startOffset <=
                                inputStart &&
                            endOffset <=
                                inputStart
                        ) {
                            event.preventDefault();
                            event.stopPropagation();

                            return;
                        }


                        // Stop typing over previous output
                        if (
                            startOffset <
                            inputStart
                        ) {
                            const browserEvent =
                                event.browserEvent;

                            if (
                                browserEvent &&
                                browserEvent.key &&
                                browserEvent.key.length === 1
                            ) {
                                event.preventDefault();
                                event.stopPropagation();

                                moveInputCursorToEnd();
                            }
                        }
                    }
                );


            // Finish input and restore previous terminal state
            function finishInput() {
                if (finished) {
                    return;
                }

                finished = true;

                keyListener.dispose();
                cursorListener.dispose();

                if (
                    window.orinTerminal &&
                    typeof window.orinTerminal.clearInputCancel ===
                        "function"
                ) {
                    window.orinTerminal.clearInputCancel();
                }

                terminalEditor.updateOptions({
                    readOnly: true
                });

                if (
                    typeof terminalMode !== "undefined"
                ) {
                    terminalMode =
                        previousMode;
                }
            }


            // Cancel input when End is pressed
            function cancelInput() {
                if (finished) {
                    return;
                }

                finishInput();

                const error =
                    new Error(
                        "Program ended"
                    );

                error.name =
                    "OrinProgramEnded";

                reject(
                    error
                );
            }


            // Register input cancellation
            if (
                window.orinTerminal &&
                typeof window.orinTerminal.setInputCancel ===
                    "function"
            ) {
                window.orinTerminal.setInputCancel(
                    cancelInput
                );
            }


            // Move cursor to terminal end
            function moveInputCursorToEnd() {
                const endPosition =
                    model.getPositionAt(
                        model.getValueLength()
                    );

                terminalEditor.setPosition(
                    endPosition
                );

                terminalEditor.revealPosition(
                    endPosition
                );
            }


            // Append text directly to Monaco model
            function appendInputText(text) {
                const endPosition =
                    model.getPositionAt(
                        model.getValueLength()
                    );

                model.applyEdits(
                    [
                        {
                            range:
                                new monaco.Range(
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
                    ]
                );

                moveInputCursorToEnd();
            }
        }
    );
}