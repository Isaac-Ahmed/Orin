export function createFile(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].createFile(path);
}

export function createFolder(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    return window["orinProjectFiles"].createDirectory(path);
}

export function createPath(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}
    if(path.trim() === ""){throw new Error("path cannot be empty");}

    path = path.trim().replaceAll("\\", "/");

    while(path.startsWith("/")){
        path = path.slice(1);
    }

    while(path.endsWith("/")){
        path = path.slice(0, -1);
    }

    let parts = path.split("/");
    let finalPart = parts[parts.length - 1];
    let finalIsFile = /\.[^/.]+$/.test(finalPart);

    let folderCount = finalIsFile ? parts.length - 1 : parts.length;
    let currentPath = "";

    for(let i = 0; i < folderCount; i++){
        currentPath += (currentPath === "" ? "" : "/") + parts[i];

        if(!window["orinProjectFiles"].directoryExists(currentPath)){
            window["orinProjectFiles"].createDirectory(currentPath);
        }
    }

    if(finalIsFile){
        if(window["orinProjectFiles"].exists(path)){throw new Error("file already exists");}
        window["orinProjectFiles"].createFile(path);
    }

    return true;
}