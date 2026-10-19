export function readText(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].readText(path);
}

export function readLines(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].readText(path).split("\n");
}

export function exists(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].exists(path);
}

export function folderExists(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].directoryExists(path);
}