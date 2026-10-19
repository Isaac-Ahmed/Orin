class OrinBoolean {
    constructor(value) {
        if (typeof value !== "boolean") {
            throw new Error(
                "boolean value must be true or false"
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
        return String(this.value);
    }

    // Return the opposite boolean
    not() {
        return !this.value;
    }

    // Logical AND
    and(other) {
        validateBoolean(other);

        return (
            this.value &&
            getRawValue(other)
        );
    }

    // Logical OR
    or(other) {
        validateBoolean(other);

        return (
            this.value ||
            getRawValue(other)
        );
    }

    // Logical exclusive OR
    xor(other) {
        validateBoolean(other);

        return (
            this.value !==
            getRawValue(other)
        );
    }
}

// Validate a boolean value
function validateBoolean(value) {
    value =
        getRawValue(value);

    if (typeof value !== "boolean") {
        throw new Error(
            "value must be a boolean"
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

// Create an Orin boolean
export function create(value) {
    return new OrinBoolean(value);
}

// Convert to string
export function toString(value) {
    value =
        getRawValue(value);

    if (typeof value !== "boolean") {
        throw new Error(
            "value must be a boolean"
        );
    }

    return String(value);
}