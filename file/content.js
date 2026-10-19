export function getContent(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].getContent(path);
}

export function getContentPaths(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].getContentPaths(path);
}

export function getAll(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].getAll(path);
}