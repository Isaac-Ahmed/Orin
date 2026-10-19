class OrinDouble {
    constructor(value) {
        if (
            typeof value !== "number"
        ) {
            throw new Error(
                "double value must be a number"
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
        const otherValue =
            getRawValue(
                other
            );

        if (
            Number.isNaN(this.value) &&
            Number.isNaN(otherValue)
        ) {
            return true;
        }

        return this.value === otherValue;
    }

    // Convert to string
    toString() {
        return String(
            this.value
        );
    }

    // Convert to integer
    toInt() {
        if (
            !Number.isFinite(
                this.value
            )
        ) {
            throw new Error(
                "value cannot be converted to an integer"
            );
        }

        const value =
            Math.trunc(
                this.value
            );

        if (
            !Number.isSafeInteger(
                value
            )
        ) {
            throw new Error(
                "value cannot be safely converted to an integer"
            );
        }

        return value;
    }

    // Convert to double
    toDouble() {
        return this.value;
    }

    // Check whether the value is a whole number
    isWhole() {
        return Number.isInteger(
            this.value
        );
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

// Create an Orin double
export function create(value) {
    return new OrinDouble(
        value
    );
}

// Convert a value to string
export function toString(value) {
    return String(
        getRawValue(
            value
        )
    );
}

// Convert a value to integer
export function toInt(value) {
    value =
        getRawValue(
            value
        );

    if (
        typeof value !== "number" ||
        !Number.isFinite(
            value
        )
    ) {
        throw new Error(
            "value cannot be converted to an integer"
        );
    }

    const integer =
        Math.trunc(
            value
        );

    if (
        !Number.isSafeInteger(
            integer
        )
    ) {
        throw new Error(
            "value cannot be safely converted to an integer"
        );
    }

    return integer;
}

// Convert a value to double
export function toDouble(value) {
    value =
        getRawValue(
            value
        );

    if (
        typeof value !== "number"
    ) {
        throw new Error(
            "value cannot be converted to a double"
        );
    }

    return value;
}