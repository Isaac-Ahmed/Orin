export function deleteFile(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].deleteFile(path);
}

export function deleteFolder(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].deleteDirectory(path);
}

export function deleteContents(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    if(!window["orinProjectFiles"].exists(path)){throw new Error("file does not exist");}

    return window["orinProjectFiles"].writeText(path, "");
}