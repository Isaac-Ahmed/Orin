// Print without a new line
export function print(value) {
    getTerminal().write(
        String(value)
    );
}

// Print with a new line
export function println(value) {
    getTerminal().write(
        String(value) + "\n"
    );
}

// Reset the interactive terminal
export async function clear() {
    await getTerminal().reset();
}

// Get the terminal interface
function getTerminal() {
    if (
        !window.orinTerminal
    ) {
        throw new Error(
            "Terminal is not available"
        );
    }

    return window.orinTerminal;
}