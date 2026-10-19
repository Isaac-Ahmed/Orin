// Return the sum of all values
export function sum(list) {
    let total = 0;

    for (const value of list) {
        total += value;
    }

    return total;
}

// Return the mean average
export function mean(list) {
    if (list.length === 0) {
        throw new Error("cannot calculate mean of an empty list");
    }

    return sum(list) / list.length;
}

// Return the median value
export function median(list) {
    if (list.length === 0) {
        throw new Error("cannot calculate median of an empty list");
    }

    const sortedList =
        [...list].sort((a, b) => a - b);

    const middle =
        Math.floor(sortedList.length / 2);

    if (
        sortedList.length % 2 === 1
    ) {
        return sortedList[middle];
    }

    return (
        sortedList[middle - 1] +
        sortedList[middle]
    ) / 2;
}

// Return the first mode
export function mode(list) {
    if (list.length === 0) {
        throw new Error("cannot calculate mode of an empty list");
    }

    const counts = {};

    let modeValue = list[0];
    let highestCount = 0;

    for (const value of list) {
        if (counts[value] === undefined) {
            counts[value] = 0;
        }

        counts[value]++;

        if (
            counts[value] > highestCount
        ) {
            highestCount =
                counts[value];

            modeValue =
                value;
        }
    }

    return modeValue;
}

// Return the range
export function range(list) {
    if (list.length === 0) {
        throw new Error("cannot calculate range of an empty list");
    }

    let minimum =
        list[0];

    let maximum =
        list[0];

    for (const value of list) {
        if (value < minimum) {
            minimum = value;
        }

        if (value > maximum) {
            maximum = value;
        }
    }

    return maximum - minimum;
}

// Return the population variance
export function variance(list) {
    if (list.length === 0) {
        throw new Error("cannot calculate variance of an empty list");
    }

    const average =
        mean(list);

    let total = 0;

    for (const value of list) {
        const difference =
            value - average;

        total +=
            difference * difference;
    }

    return total / list.length;
}

// Return the population standard deviation
export function standardDeviation(list) {
    if (list.length === 0) {
        throw new Error(
            "cannot calculate standard deviation of an empty list"
        );
    }

    return Math.sqrt(
        variance(list)
    );
}