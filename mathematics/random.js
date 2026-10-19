export function random(){
    return Math.random();
}

export function randInt(min, max){
    let diff = (max - min) + 1;
    return Math.floor(Math.random() * diff) + min;
}

export function randDouble(min, max){
    let diff = max - min;
    return (Math.random() * diff) + min;
}