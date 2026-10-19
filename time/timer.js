let startTime = 0;

export function startTimer(){
    startTime = performance.now();
}

export function elapsed(){
    let currentTime = performance.now();
    return currentTime - startTime;
}

export function elapsedSeconds(){
    let currentTime = performance.now();
    return (currentTime - startTime)/1000;
}

export async function sleep(time, units){
    if(typeof time !== "number"){
        throw new Error("time needs to be a number");
    }

    if(!Number.isFinite(time)){
        throw new Error("time needs to be a finite number");
    }

    if(time < 0){
        throw new Error("time cannot be negative");
    }

    if(typeof units !== "string"){
        throw new Error("units needs to be a string");
    }

    let timeInMs = time;

    switch(units){
        case "ms":
            break;

        case "cs":
            timeInMs *= 10;
            break;

        case "ds":
            timeInMs *= 100;
            break;

        case "s":
            timeInMs *= 1000;
            break;

        default:
            throw new Error("units must be 'ms', 'cs', 'ds', or 's'");
    }

    await new Promise(resolve => setTimeout(resolve, timeInMs));
}