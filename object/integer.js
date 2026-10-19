class OrinInteger {
    constructor(value) {
        if (
            typeof value !== "number" ||
            !Number.isSafeInteger(value)
        ) {
            throw new Error(
                "integer value must be a safe integer"
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

    // Convert to integer
    toInt() {
        return this.value;
    }

    // Convert to double
    toDouble() {
        return this.value;
    }

    // Check whether the value is positive
    isPositive() {
        return this.value > 0;
    }

    // Check whether the value is negative
    isNegative() {
        return this.value < 0;
    }

    // Check whether the value is zero
    isZero() {
        return this.value === 0;
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

// Create an Orin integer
export function create(value) {
    return new OrinInteger(value);
}

// Convert a value to string
export function toString(value) {
    return String(getRawValue(value));
}

// Convert a value to integer
export function toInt(value) {
    value = getRawValue(value);

    if (
        typeof value !== "number" ||
        !Number.isSafeInteger(value)
    ) {
        throw new Error(
            "value cannot be converted to an integer"
        );
    }

    return value;
}

// Convert a value to double
export function toDouble(value) {
    value = getRawValue(value);

    if (
        typeof value !== "number" ||
        !Number.isFinite(value)
    ) {
        throw new Error(
            "value cannot be converted to a double"
        );
    }

    return value;
}