class OrinString {
    constructor(value) {
        if (typeof value !== "string") {
            throw new Error(
                "string value must be text"
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

    // Convert to integer
    toInt() {
        const text =
            this.value.trim();

        if (
            !/^[+-]?\d+$/.test(text)
        ) {
            throw new Error(
                "string cannot be converted to an integer"
            );
        }

        const value =
            Number(text);

        if (!Number.isSafeInteger(value)) {
            throw new Error(
                "string cannot be safely converted to an integer"
            );
        }

        return value;
    }

    // Convert to double
    toDouble() {
        const text =
            this.value.trim();

        if (text === "") {
            throw new Error(
                "string cannot be converted to a double"
            );
        }

        const value =
            Number(text);

        if (!Number.isFinite(value)) {
            throw new Error(
                "string cannot be converted to a double"
            );
        }

        return value;
    }

    // Convert to boolean
    toBoolean() {
        const text =
            this.value.trim().toLowerCase();

        if (text === "true") {
            return true;
        }

        if (text === "false") {
            return false;
        }

        throw new Error(
            "string cannot be converted to a boolean"
        );
    }

    // Convert to char
    toChar() {
        if ([...this.value].length !== 1) {
            throw new Error(
                "string must contain exactly one character"
            );
        }

        return this.value;
    }

    // Return the number of characters
    length() {
        return [...this.value].length;
    }

    // Check whether the string is empty
    isEmpty() {
        return this.value.length === 0;
    }

    // Check whether text occurs inside the string
    contains(text) {
        return this.value.includes(
            String(getRawValue(text))
        );
    }

    // Check the beginning of the string
    startsWith(text) {
        return this.value.startsWith(
            String(getRawValue(text))
        );
    }

    // Check the end of the string
    endsWith(text) {
        return this.value.endsWith(
            String(getRawValue(text))
        );
    }

    // Convert to uppercase
    toUpper() {
        return this.value.toUpperCase();
    }

    // Convert to lowercase
    toLower() {
        return this.value.toLowerCase();
    }

    // Remove whitespace from both ends
    trim() {
        return this.value.trim();
    }

    // Return the character at an index
    charAt(index) {
        const characters =
            [...this.value];

        validateIndex(
            index,
            characters.length
        );

        return characters[index];
    }

    // Find the first index of text
    indexOf(text) {
        return this.value.indexOf(
            String(getRawValue(text))
        );
    }

    // Find the last index of text
    lastIndexOf(text) {
        return this.value.lastIndexOf(
            String(getRawValue(text))
        );
    }

    // Replace the first occurrence
    replace(search, replacement) {
        return this.value.replace(
            String(getRawValue(search)),
            String(getRawValue(replacement))
        );
    }

    // Replace every occurrence
    replaceAll(search, replacement) {
        return this.value.replaceAll(
            String(getRawValue(search)),
            String(getRawValue(replacement))
        );
    }

    // Return part of the string
    substring(start, end) {
        const characters =
            [...this.value];

        if (
            !Number.isInteger(start) ||
            start < 0 ||
            start > characters.length
        ) {
            throw new Error(
                "invalid substring start index"
            );
        }

        if (end === undefined) {
            return characters
                .slice(start)
                .join("");
        }

        if (
            !Number.isInteger(end) ||
            end < start ||
            end > characters.length
        ) {
            throw new Error(
                "invalid substring end index"
            );
        }

        return characters
            .slice(start, end)
            .join("");
    }

    // Split the string into an array
    split(separator) {
        return this.value.split(
            String(getRawValue(separator))
        );
    }

    // Repeat the string
    repeat(amount) {
        if (
            !Number.isInteger(amount) ||
            amount < 0
        ) {
            throw new Error(
                "repeat amount must be a non-negative integer"
            );
        }

        return this.value.repeat(
            amount
        );
    }
}

// Validate a string index
function validateIndex(index, length) {
    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= length
    ) {
        throw new Error(
            "string index is out of range"
        );
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

// Create an Orin string
export function create(value) {
    return new OrinString(value);
}

// Convert to string
export function toString(value) {
    return String(
        getRawValue(value)
    );
}

// Convert to integer
export function toInt(value) {
    return create(
        String(getRawValue(value))
    ).toInt();
}

// Convert to double
export function toDouble(value) {
    return create(
        String(getRawValue(value))
    ).toDouble();
}