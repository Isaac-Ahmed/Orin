let orinProject = null;
let selectedProjectItem = null;
let activeFile = null;

const PROJECT_STORAGE_KEY = "orinProject";

// Create a unique ID
function createProjectId(){
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

// Create the default project
function createDefaultProject(){
    return {
        id: createProjectId(),
        type: "folder",
        name: "Orin Project",
        expanded: true,
        children: [
            {
                id: createProjectId(),
                type: "file",
                name: "main.orin",
                content: ""
            }
        ]
    };
}

// Start the project manager
function initialiseProjectManager(){
    loadProject();

    document.getElementById("projectName").value = orinProject.name;

    document.getElementById("projectName").addEventListener("input", function(){
        orinProject.name = this.value;
        saveProject();
    });

    renderProjectTree();

    const firstFile = findFirstFile(orinProject);

    if(firstFile){
        openProjectFile(firstFile.id);
    }
}

// Load project from browser storage
function loadProject(){
    const saved = localStorage.getItem(PROJECT_STORAGE_KEY);

    if(!saved){
        orinProject = createDefaultProject();
        saveProject();
        return;
    }

    try{
        orinProject = JSON.parse(saved);
    }
    catch(error){
        console.error(error);
        orinProject = createDefaultProject();
        saveProject();
    }
}

// Save the project
function saveProject(){
    if(activeFile && editor){
        activeFile.content = editor.getValue();
    }

    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(orinProject));
}

// Find the first file
function findFirstFile(folder){
    for(const item of folder.children){
        if(item.type === "file"){return item;}

        if(item.type === "folder"){
            const file = findFirstFile(item);
            if(file){return file;}
        }
    }

    return null;
}

// Find an item using its ID
function findProjectItem(parent, id){
    if(parent.id === id){return parent;}
    if(parent.type !== "folder"){return null;}

    for(const child of parent.children){
        const found = findProjectItem(child, id);
        if(found){return found;}
    }

    return null;
}

// Find the parent folder of an item
function findParentFolder(parent, id){
    if(parent.type !== "folder"){return null;}

    for(const child of parent.children){
        if(child.id === id){return parent;}

        if(child.type === "folder"){
            const found = findParentFolder(child, id);
            if(found){return found;}
        }
    }

    return null;
}

// Normalise a project path
function normaliseProjectPath(path){
    if(typeof path !== "string"){throw new Error("path must be a string");}

    path = path.trim().replaceAll("\\", "/");

    while(path.startsWith("/")){
        path = path.slice(1);
    }

    while(path.endsWith("/")){
        path = path.slice(0, -1);
    }

    if(path === ""){return [];}

    const parts = path.split("/");

    for(const part of parts){
        if(part === "" || part === "." || part === ".."){
            throw new Error("path is invalid");
        }
    }

    if(parts[0] === orinProject.name){
        parts.shift();
    }

    return parts;
}

// Find an item using its project path
function findProjectItemByPath(path){
    let parts;

    try{
        parts = normaliseProjectPath(path);
    }
    catch(error){
        return null;
    }

    let current = orinProject;

    for(const part of parts){
        if(current.type !== "folder"){return null;}

        const next = current.children.find(item => item.name === part);
        if(!next){return null;}

        current = next;
    }

    return current;
}

// Find a folder using its path
function findProjectFolderByPath(path){
    if(path === ""){return orinProject;}

    const item = findProjectItemByPath(path);

    if(!item || item.type !== "folder"){return null;}

    return item;
}

// Split a path into folder and file name
function splitProjectPath(path){
    const parts = normaliseProjectPath(path);

    if(parts.length === 0){throw new Error("path must contain a file name");}

    const name = parts.pop();

    return {
        folderPath: parts.join("/"),
        name: name
    };
}

// Determine where a new UI item should be created
function getSelectedFolder(){
    if(selectedProjectItem && selectedProjectItem.type === "folder"){
        return selectedProjectItem;
    }

    if(selectedProjectItem && selectedProjectItem.type === "file"){
        const parent = findParentFolder(orinProject, selectedProjectItem.id);
        if(parent){return parent;}
    }

    return orinProject;
}

// Add .orin when the UI filename has no extension
function addDefaultFileExtension(name){
    if(!name.includes(".")){
        return name + ".orin";
    }

    return name;
}

function uploadProjectFiles(){
    const folder =
        getSelectedFolder();

    const input =
        document.createElement(
            "input"
        );

    input.type =
        "file";

    input.multiple =
        true;

    input.addEventListener(
        "change",
        async function(){
            const files =
                Array.from(
                    input.files || []
                );

            for(const file of files){
                if(
                    folder.children.some(
                        item =>
                            item.name ===
                            file.name
                    )
                ){
                    alert(
                        `A file or folder named '${file.name}' already exists.`
                    );

                    continue;
                }

                const fileKind =
                    getProjectFileKind(
                        file.name
                    );

                let content;

                if(
                    fileKind ===
                    "image"
                ){
                    content =
                        await readProjectImageFile(
                            file
                        );
                }
                else{
                    content =
                        await readProjectTextFile(
                            file
                        );
                }

                const projectFile = {
                    id:
                        createProjectId(),

                    type:
                        "file",

                    fileKind:
                        fileKind,

                    name:
                        file.name,

                    content:
                        content
                };

                folder.children.push(
                    projectFile
                );
            }

            folder.expanded =
                true;

            saveProject();
            renderProjectTree();
        }
    );

    input.click();
}

function readProjectImageFile(file){
    return new Promise(
        (resolve, reject) => {
            const reader =
                new FileReader();

            reader.onload =
                function(){
                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                function(){
                    reject(
                        new Error(
                            "unable to read image file"
                        )
                    );
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}

function readProjectTextFile(file){
    return new Promise(
        (resolve, reject) => {
            const reader =
                new FileReader();

            reader.onload =
                function(){
                    resolve(
                        reader.result
                    );
                };

            reader.onerror =
                function(){
                    reject(
                        new Error(
                            "unable to read file"
                        )
                    );
                };

            reader.readAsText(
                file
            );
        }
    );
}

// Create a file using the UI
function createProjectFile(){
    const folder = getSelectedFolder();

    let name = prompt("File name:", "newFile.orin");

    if(!name){return;}

    name = name.trim();

    if(name === ""){return;}

    name = addDefaultFileExtension(name);

    if(folder.children.some(item => item.name === name)){
        alert("A file or folder with that name already exists.");
        return;
    }

    const file = {
        id: createProjectId(),
        type: "file",
        fileKind: "text",
        name: name,
        content: ""
    };

    folder.children.push(file);
    folder.expanded = true;

    saveProject();
    renderProjectTree();
    openProjectFile(file.id);
}

// Create a folder using the UI
function createProjectFolder(){
    const parent = getSelectedFolder();

    const name = prompt("Folder name:", "newFolder");

    if(!name || name.trim() === ""){return;}

    const cleanName = name.trim();

    if(parent.children.some(item => item.name === cleanName)){
        alert("A file or folder with that name already exists.");
        return;
    }

    const folder = {
        id: createProjectId(),
        type: "folder",
        name: cleanName,
        expanded: true,
        children: []
    };

    parent.children.push(folder);
    parent.expanded = true;
    selectedProjectItem = folder;

    saveProject();
    renderProjectTree();
}

// Create a file using a project path
function createProjectFileAtPath(path, content = ""){
    if(typeof content !== "string"){throw new Error("content must be a string");}

    const details = splitProjectPath(path);
    const folder = findProjectFolderByPath(details.folderPath);

    if(!folder){throw new Error("parent folder does not exist");}

    if(folder.children.some(item => item.name === details.name)){
        throw new Error("a file or folder with that name already exists");
    }

    const file = {
        id: createProjectId(),
        type: "file",
        fileKind:
            getProjectFileKind(
                details.name
            ),

        name:
            details.name,

        content:
            content
    };

    folder.children.push(file);
    folder.expanded = true;

    saveProject();
    renderProjectTree();

    return true;
}

// Create a directory using a project path
function createProjectDirectoryAtPath(path){
    const details = splitProjectPath(path);
    const parent = findProjectFolderByPath(details.folderPath);

    if(!parent){throw new Error("parent folder does not exist");}

    if(parent.children.some(item => item.name === details.name)){
        throw new Error("a file or folder with that name already exists");
    }

    const folder = {
        id: createProjectId(),
        type: "folder",
        name: details.name,
        expanded: true,
        children: []
    };

    parent.children.push(folder);
    parent.expanded = true;

    saveProject();
    renderProjectTree();

    return true;
}

function readProjectImage(path){
    const file =
        findProjectItemByPath(
            path
        );

    if(
        !file ||
        file.type !== "file"
    ){
        throw new Error(
            "file does not exist"
        );
    }

    if(
        getProjectFileKind(
            file.name
        ) !== "image"
    ){
        throw new Error(
            "file is not an image"
        );
    }

    return file.content;
}

// Read a project's file contents
function readProjectFile(path){
    const file =
        findProjectItemByPath(
            path
        );

    if(
        !file ||
        file.type !== "file"
    ){
        throw new Error(
            "file does not exist"
        );
    }

    if(
        getProjectFileKind(
            file.name
        ) === "image"
    ){
        throw new Error(
            "image files cannot be read as text"
        );
    }

    if(
        activeFile &&
        activeFile.id === file.id &&
        editor
    ){
        return editor.getValue();
    }

    return file.content || "";
}

// Write to an existing project file
function writeProjectFile(path, content){
    if(typeof content !== "string"){throw new Error("content must be a string");}

    const file = findProjectItemByPath(path);

    if(!file || file.type !== "file"){
        throw new Error("file does not exist");
    }

    file.content = content;

    if(activeFile && activeFile.id === file.id && editor){
        editor.setValue(content);
    }

    saveProject();

    return true;
}

// Add text to an existing project file
function appendProjectFile(path, content){
    if(typeof content !== "string"){throw new Error("content must be a string");}

    const file = findProjectItemByPath(path);

    if(!file || file.type !== "file"){
        throw new Error("file does not exist");
    }

    let currentContent = file.content || "";

    if(activeFile && activeFile.id === file.id && editor){
        currentContent = editor.getValue();
    }

    file.content = currentContent + content;

    if(activeFile && activeFile.id === file.id && editor){
        editor.setValue(file.content);
    }

    saveProject();

    return true;
}

// Check whether a file exists
function projectFileExists(path){
    const item = findProjectItemByPath(path);
    return item !== null && item.type === "file";
}

// Check whether a directory exists
function projectDirectoryExists(path){
    const item = findProjectItemByPath(path);
    return item !== null && item.type === "folder";
}

function getProjectFileLanguage(name){
    const lowerName =
        name.toLowerCase();

    if(
        lowerName.endsWith(
            ".css"
        )
    ){
        return "css";
    }

    return "orin";
}

function isProjectImageFile(name){
    const lowerName =
        name.toLowerCase();

    return (
        lowerName.endsWith(".png")
    );
}

function getProjectFileKind(name){
    if(
        isProjectImageFile(
            name
        )
    ){
        return "image";
    }

    return "text";
}

// Open a project file
function openProjectFile(id){
    const file =
        findProjectItem(
            orinProject,
            id
        );

    if(
        !file ||
        file.type !== "file"
    ){
        return;
    }

    selectedProjectItem =
        file;

    if(
        getProjectFileKind(
            file.name
        ) === "image"
    ){
        openProjectImagePreview(
            file
        );

        renderProjectTree();

        return;
    }

    if(activeFile){
        activeFile.content =
            editor.getValue();
    }

    activeFile =
        file;

    const model =
        editor.getModel();

    if(model){
        monaco.editor.setModelLanguage(
            model,
            getProjectFileLanguage(
                file.name
            )
        );
    }

    editor.setValue(
        file.content || ""
    );

    saveProject();
    renderProjectTree();
    editor.focus();
}

// Select a folder
function selectProjectFolder(id){
    const folder = findProjectItem(orinProject, id);

    if(!folder || folder.type !== "folder"){return;}

    selectedProjectItem = folder;
    renderProjectTree();
}

// Expand or collapse a folder
function toggleProjectFolder(id){
    const folder = findProjectItem(orinProject, id);

    if(!folder || folder.type !== "folder"){return;}

    folder.expanded = !folder.expanded;
    selectedProjectItem = folder;

    saveProject();
    renderProjectTree();
}

// Render the project tree
function renderProjectTree(){
    const tree = document.getElementById("projectTree");

    tree.innerHTML = "";

    for(const child of orinProject.children){
        renderProjectItem(child, tree);
    }
}

// Render one project item
function renderProjectItem(item, container){
    const row = document.createElement("div");
    row.className = "treeItem";

    if(selectedProjectItem && selectedProjectItem.id === item.id){
        row.classList.add("selected");
    }

    const icon = document.createElement("span");
    icon.className = "treeIcon";

    const name = document.createElement("span");
    name.className = "treeName";
    name.textContent = item.name;

    if(item.type === "folder"){
        icon.textContent = item.expanded ? "▼" : "▶";

        row.onclick = function(){
            toggleProjectFolder(item.id);
        };
    }
    else{
        icon.textContent = "•";

        row.onclick = function(){
            openProjectFile(item.id);
        };
    }

    row.appendChild(icon);
    row.appendChild(name);
    container.appendChild(row);

    if(item.type === "folder" && item.expanded){
        const children = document.createElement("div");
        children.className = "treeChildren";

        for(const child of item.children){
            renderProjectItem(child, children);
        }

        container.appendChild(children);
    }
}

// Rename the selected file or folder
function renameSelectedProjectItem(){
    if(!selectedProjectItem){
        alert(
            "Select a file or folder first."
        );

        return;
    }

    const currentName =
        selectedProjectItem.name;

    let newName =
        prompt(
            "New name:",
            currentName
        );

    if(!newName){
        return;
    }

    newName =
        newName.trim();

    if(newName === ""){
        return;
    }

    if(
        selectedProjectItem.type ===
        "file"
    ){
        newName =
            addDefaultFileExtension(
                newName
            );
    }

    const parent =
        findParentFolder(
            orinProject,
            selectedProjectItem.id
        );

    if(parent){
        const nameAlreadyExists =
            parent.children.some(
                item =>
                    item.id !==
                        selectedProjectItem.id &&
                    item.name ===
                        newName
            );

        if(nameAlreadyExists){
            alert(
                "A file or folder with that name already exists."
            );

            return;
        }
    }

    selectedProjectItem.name =
        newName;

    if(
        selectedProjectItem.type ===
            "file" &&
        activeFile &&
        activeFile.id ===
            selectedProjectItem.id
    ){
        const model =
            editor.getModel();

        if(model){
            monaco.editor.setModelLanguage(
                model,
                getProjectFileLanguage(
                    newName
                )
            );
        }
    }

    saveProject();
    renderProjectTree();
}
// Delete the selected file or folder
function deleteSelectedProjectItem(){
    if(!selectedProjectItem){
        alert("Select a file or folder first.");
        return;
    }

    const item = selectedProjectItem;
    const parent = findParentFolder(orinProject, item.id);

    if(!parent){
        alert("The root project cannot be deleted.");
        return;
    }

    let message = `Delete '${item.name}'?`;

    if(item.type === "folder" && item.children.length > 0){
        message = `Delete folder '${item.name}' and everything inside it?`;
    }

    if(!confirm(message)){return;}

    const wasActiveFile = activeFile && activeFile.id === item.id;

    const containedActiveFile =
        item.type === "folder" &&
        activeFile &&
        itemContainsId(item, activeFile.id);

    parent.children = parent.children.filter(child => child.id !== item.id);

    selectedProjectItem = null;

    if(wasActiveFile || containedActiveFile){
        activeFile = null;

        const nextFile = findFirstFile(orinProject);

        if(nextFile){
            openProjectFile(nextFile.id);
        }
        else{
            editor.setValue("");
        }
    }

    saveProject();
    renderProjectTree();
}

// Move the selected file or folder
function moveSelectedProjectItem(){
    if(!selectedProjectItem){
        alert("Select a file or folder first.");
        return;
    }

    const item = selectedProjectItem;
    const currentParent = findParentFolder(orinProject, item.id);

    if(!currentParent){
        alert("The root project cannot be moved.");
        return;
    }

    const folders = [];

    collectFolders(orinProject, folders);

    const validFolders = folders.filter(folder => {
        if(folder.id === item.id){return false;}

        if(item.type === "folder" && itemContainsId(item, folder.id)){
            return false;
        }

        return true;
    });

    if(validFolders.length === 0){
        alert("There are no valid folders to move this item into.");
        return;
    }

    let message = "Move to:\n\n";

    for(let i = 0; i < validFolders.length; i++){
        message += `${i + 1}. ${getFolderPath(validFolders[i])}\n`;
    }

    const choice = prompt(message);

    if(!choice){return;}

    const index = Number(choice) - 1;

    if(!Number.isInteger(index) || index < 0 || index >= validFolders.length){
        alert("Invalid folder selection.");
        return;
    }

    const destination = validFolders[index];

    if(destination.children.some(child => child.name === item.name)){
        alert("A file or folder with that name already exists in the destination.");
        return;
    }

    currentParent.children = currentParent.children.filter(child => child.id !== item.id);

    destination.children.push(item);
    destination.expanded = true;

    saveProject();
    renderProjectTree();
}

// Collect every folder
function collectFolders(folder, output){
    output.push(folder);

    for(const child of folder.children){
        if(child.type === "folder"){
            collectFolders(child, output);
        }
    }
}

// Check whether an item contains another ID
function itemContainsId(item, id){
    if(item.id === id){return true;}
    if(item.type !== "folder"){return false;}

    for(const child of item.children){
        if(itemContainsId(child, id)){return true;}
    }

    return false;
}

// Return the visible path of a folder
function getFolderPath(folder){
    if(folder.id === orinProject.id){
        return orinProject.name;
    }

    const names = [folder.name];

    let current = findParentFolder(orinProject, folder.id);

    while(current && current.id !== orinProject.id){
        names.unshift(current.name);
        current = findParentFolder(orinProject, current.id);
    }

    names.unshift(orinProject.name);

    return names.join("/");
}

// Delete a file using its project path
function deleteProjectFileAtPath(path){
    const file = findProjectItemByPath(path);

    if(!file || file.type !== "file"){throw new Error("file does not exist");}

    const parent = findParentFolder(orinProject, file.id);

    if(!parent){throw new Error("file cannot be deleted");}

    const wasActiveFile = activeFile && activeFile.id === file.id;

    parent.children = parent.children.filter(item => item.id !== file.id);

    if(wasActiveFile){
        activeFile = null;

        const nextFile = findFirstFile(orinProject);

        if(nextFile){
            openProjectFile(nextFile.id);
        }
        else{
            editor.setValue("");
        }
    }

    saveProject();
    renderProjectTree();

    return true;
}

// Delete a folder and everything inside it
function deleteProjectFolderAtPath(path){
    const folder = findProjectItemByPath(path);

    if(!folder || folder.type !== "folder"){throw new Error("folder does not exist");}
    if(folder.id === orinProject.id){throw new Error("root project cannot be deleted");}

    const parent = findParentFolder(orinProject, folder.id);

    if(!parent){throw new Error("folder cannot be deleted");}

    const containedActiveFile =
        activeFile &&
        itemContainsId(folder, activeFile.id);

    parent.children = parent.children.filter(item => item.id !== folder.id);

    if(containedActiveFile){
        activeFile = null;

        const nextFile = findFirstFile(orinProject);

        if(nextFile){
            openProjectFile(nextFile.id);
        }
        else{
            editor.setValue("");
        }
    }

    saveProject();
    renderProjectTree();

    return true;
}

// Get the direct contents of a folder
function getProjectContent(path){
    const folder = findProjectItemByPath(path);

    if(!folder || folder.type !== "folder"){throw new Error("folder does not exist");}

    return folder.children.map(item => item.name);
}

// Get the direct contents of a folder with their paths
function getProjectContentPaths(path){
    const folder = findProjectItemByPath(path);

    if(!folder || folder.type !== "folder"){throw new Error("folder does not exist");}

    const parts = normaliseProjectPath(path);
    const basePath = parts.length === 0 ? "" : "/" + parts.join("/");

    return folder.children.map(item => basePath + "/" + item.name);
}

// Get everything inside a folder recursively
function getAllProjectContent(path){
    const folder = findProjectItemByPath(path);

    if(!folder || folder.type !== "folder"){throw new Error("folder does not exist");}

    const parts = normaliseProjectPath(path);
    const basePath = parts.length === 0 ? "" : "/" + parts.join("/");

    const output = [];

    function collect(folder, currentPath){
        for(const item of folder.children){
            const itemPath = currentPath + "/" + item.name;

            output.push(itemPath);

            if(item.type === "folder"){
                collect(item, itemPath);
            }
        }
    }

    collect(folder, basePath);

    return output;
}

// Make project file functions available to Orin libraries
window["orinProjectFiles"] = {
    readText: readProjectFile,
    readImage: readProjectImage,
    writeText: writeProjectFile,
    appendText: appendProjectFile,
    createFile: createProjectFileAtPath,
    createDirectory: createProjectDirectoryAtPath,
    deleteFile: deleteProjectFileAtPath,
    deleteDirectory: deleteProjectFolderAtPath,
    getContent: getProjectContent,
    getContentPaths: getProjectContentPaths,
    getAll: getAllProjectContent,
    exists: projectFileExists,
    directoryExists: projectDirectoryExists
};

function openProjectImagePreview(file){
    const preview =
        document.getElementById(
            "projectImagePreview"
        );

    const title =
        document.getElementById(
            "projectImagePreviewTitle"
        );

    const image =
        document.getElementById(
            "projectImagePreviewImage"
        );

    if(
        !preview ||
        !title ||
        !image
    ){
        throw new Error(
            "image preview elements are unavailable"
        );
    }

    title.textContent =
        file.name;

    image.src =
        file.content;

    image.alt =
        file.name;

    preview.classList.add(
        "open"
    );
}

function closeProjectImagePreview(){
    const preview =
        document.getElementById(
            "projectImagePreview"
        );

    const image =
        document.getElementById(
            "projectImagePreviewImage"
        );

    if(preview){
        preview.classList.remove(
            "open"
        );
    }

    if(image){
        image.src = "";
    }
}