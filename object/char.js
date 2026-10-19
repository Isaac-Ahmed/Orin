class OrinChar {
    constructor(value) {
        if (
            typeof value !== "string" ||
            [...value].length !== 1
        ) {
            throw new Error(
                "char must contain exactly one character"
            );
        }

        this.value = value;
    }

    // Return the raw value
    getValue() {
        return this.value;
    }

    // Compare with another value
    compare(other) {
        return this.value === getRawValue(other);
    }

    // Convert to string
    toString() {
        return this.value;
    }

    // Convert to uppercase
    toUpper() {
        return this.value.toUpperCase();
    }

    // Convert to lowercase
    toLower() {
        return this.value.toLowerCase();
    }

    // Check whether the char is a letter
    isLetter() {
        return /^\p{L}$/u.test(
            this.value
        );
    }

    // Check whether the char is a digit
    isDigit() {
        return /^\p{N}$/u.test(
            this.value
        );
    }

    // Check whether the char is whitespace
    isWhitespace() {
        return /^\s$/u.test(
            this.value
        );
    }

    // Return the Unicode code point
    codePoint() {
        return this.value.codePointAt(0);
    }
}

// Remove an Orin wrapper if one is supplied
function getRawValue(value) {
    if (
        value !== null &&
        typeof value === "object" &&
        typeof value.getValue === "function"
    ) {
        return value.getValue();
    }

    return value;
}

// Create an Orin char
export function create(value) {
    return new OrinChar(value);
}

// Convert to string
export function toString(value) {
    value =
        getRawValue(value);

    if (
        typeof value !== "string" ||
        [...value].length !== 1
    ) {
        throw new Error(
            "value must be a char"
        );
    }

    return value;
}