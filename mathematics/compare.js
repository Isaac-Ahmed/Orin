export function minimum(a, b){
    if(a <= b){
        return a;
    }
    else{
        return b;
    }
}

export function maximum(a, b){
    if(a >= b){
        return a;
    }
    else{
        return b;
    }
}

export function clamp(value, minimum, maximum){
    if(value >= minimum && value <= maximum){
        return value;
    }
    else if(value >= maximum){
        return maximum;
    }
    return minimum;
}

export function between(value, minimum, maximum){
    if(value >= minimum && value <= maximum){
        return true;
    }
    return false;
}

export function greaterThan(value, comparison){
    if(value > comparison){return true;}
    return false;
}

export function greaterThanOrEqual(value, comparison){
    if(value >= comparison){return true;}
    return false;
}

export function lessThan(value, comparison){
    if(value < comparison){return true;}
    return false;
}

export function lessThanOrEqual(value, comparison){
    if(value <= comparison){return true;}
    return false;
}