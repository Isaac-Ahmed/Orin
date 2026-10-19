export function mod(a, b){
    return a % b;
}

export function absolute(a){
    return Math.abs(a);
}

export function sign(a){
    if(a == 0){
        return 0;
    }
    else if(a > 0){
        return 1;
    }
    return -1;
}

export function percentage(value, total){
    if(total == 0){throw new Error("total cannot be 0");}
    return (value/total) * 100;
}

export function percentageChange(old, current){
    if(total == 0){throw new Error("old value cannot be 0");}
    return ((current - old) / old) * 100;
}

export function difference(a, b){
    return Math.abs(a - b);
}

export function average(a, b){
    return (a + b) / 2;
}

export function reciprocal(value){
    if(value == 0){throw new Error("value cannot be zero");}
    return 1/value;
}