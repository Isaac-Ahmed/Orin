export function writeText(path, content){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(typeof content !== "string"){throw new Error("content must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].writeText(path, content);
}

export function appendText(path, content){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(typeof content !== "string"){throw new Error("content must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].appendText(path, content);
}

export function writeLines(path, lines){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(!Array.isArray(lines)){throw new Error("lines must be an array");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    for(let line of lines){
        if(typeof line !== "string"){throw new Error("lines must contain only strings");}
    }

    return window["orinProjectFiles"].writeText(path, lines.join("\n"));
}