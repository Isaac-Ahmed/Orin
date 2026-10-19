export function chance(probability){
    if(
        typeof probability !== "number" ||
        probability < 0 ||
        probability > 1
    ){
        throw new Error(
            "probability must be a number between 0 and 1"
        );
    }

    return Math.random() < probability;
}

export function percentChance(percent){
    if(
        typeof percent !== "number" ||
        percent < 0 ||
        percent > 100
    ){
        throw new Error(
            "percent must be a number between 0 and 100"
        );
    }

    return Math.random() * 100 < percent;
}

export function coinFlip(){
    return Math.random() < 0.5;
}

export function weightedChoice(values, weights){
    if(
        !Array.isArray(values) ||
        !Array.isArray(weights)
    ){
        throw new Error(
            "values and weights must be arrays"
        );
    }

    if(values.length === 0){
        throw new Error(
            "values cannot be empty"
        );
    }

    if(values.length !== weights.length){
        throw new Error(
            "values and weights must have the same length"
        );
    }

    let totalWeight = 0;

    for(let weight of weights){
        if(
            typeof weight !== "number" ||
            weight < 0
        ){
            throw new Error(
                "weights must be non-negative numbers"
            );
        }

        totalWeight += weight;
    }

    if(totalWeight === 0){
        throw new Error(
            "total weight cannot be zero"
        );
    }

    let randomValue =
        Math.random() *
        totalWeight;

    let currentWeight = 0;

    for(
        let i = 0;
        i < values.length;
        i++
    ){
        currentWeight +=
            weights[i];

        if(
            randomValue <
            currentWeight
        ){
            return values[i];
        }
    }

    return values[
        values.length - 1
    ];
}

export function expectedSuccesses(
    probability,
    trials
){
    if(
        typeof probability !== "number" ||
        probability < 0 ||
        probability > 1
    ){
        throw new Error(
            "probability must be a number between 0 and 1"
        );
    }

    if(
        !Number.isSafeInteger(trials) ||
        trials < 0
    ){
        throw new Error(
            "trials must be a non-negative integer"
        );
    }

    return probability * trials;
}

export function binomialProbability(
    trials,
    successes,
    probability
){
    if(
        !Number.isSafeInteger(trials) ||
        trials < 0
    ){
        throw new Error(
            "trials must be a non-negative integer"
        );
    }

    if(
        !Number.isSafeInteger(successes) ||
        successes < 0
    ){
        throw new Error(
            "successes must be a non-negative integer"
        );
    }

    if(successes > trials){
        throw new Error(
            "successes cannot be greater than trials"
        );
    }

    if(
        typeof probability !== "number" ||
        probability < 0 ||
        probability > 1
    ){
        throw new Error(
            "probability must be a number between 0 and 1"
        );
    }

    const combinationsValue =
        combinations(
            trials,
            successes
        );

    return (
        combinationsValue *
        Math.pow(
            probability,
            successes
        ) *
        Math.pow(
            1 - probability,
            trials - successes
        )
    );
}

function combinations(n, k){
    if(k > n - k){
        k = n - k;
    }

    let output = 1;

    for(
        let i = 1;
        i <= k;
        i++
    ){
        output *=
            n - k + i;

        output /=
            i;
    }

    return output;
}