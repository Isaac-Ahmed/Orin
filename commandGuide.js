let selectedLibrary = null;
let selectedModule = null;
let selectedCommand = null;


// Open the command guide
function openCommandGuide(){
    const guide =
        document.getElementById("commandGuide");

    guide.hidden = false;

    document.getElementById(
        "commandSearch"
    ).value = "";

    loadLibraries();

    const libraries =
        getLibraries();

    if(libraries.length > 0){
        selectLibrary(
            libraries[0]
        );
    }
}


// Close the command guide
function closeCommandGuide(){
    document.getElementById(
        "commandGuide"
    ).hidden = true;
}


// Get the library that a module belongs to
function getLibraryName(moduleName){
    if(moduleName.includes(".")){
        return moduleName.split(".")[0];
    }

    return "general";
}


// Get the displayed file name
function getFileName(moduleName){
    if(moduleName.includes(".")){
        return moduleName
            .split(".")
            .slice(1)
            .join(".");
    }

    return moduleName;
}


// Get all libraries
function getLibraries(search = ""){
    const libraries = [];

    for(const moduleName in orinCommandData){
        if(
            search !== "" &&
            !moduleMatchesSearch(
                moduleName,
                search
            )
        ){
            continue;
        }

        const library =
            getLibraryName(
                moduleName
            );

        if(!libraries.includes(library)){
            libraries.push(
                library
            );
        }
    }

    return libraries;
}


// Load the library column
function loadLibraries(search = ""){
    const libraryList =
        document.getElementById(
            "libraryList"
        );

    libraryList.innerHTML = "";

    const libraries =
        getLibraries(search);

    for(const library of libraries){
        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            library;

        button.className =
            "guideItem libraryItem";

        if(library === selectedLibrary){
            button.classList.add(
                "selected"
            );
        }

        button.onclick = function(){
            selectLibrary(
                library,
                search
            );
        };

        libraryList.appendChild(
            button
        );
    }
}


// Select a library
function selectLibrary(
    library,
    search = ""
){
    selectedLibrary =
        library;

    selectedModule =
        null;

    selectedCommand =
        null;

    loadLibraries(search);

    loadModules(
        library,
        search
    );

    clearCommands();
    clearCommandInformation();

    const modules =
        getModulesForLibrary(
            library,
            search
        );

    if(modules.length > 0){
        selectModule(
            modules[0],
            search
        );
    }
}


// Get modules belonging to one library
function getModulesForLibrary(
    library,
    search = ""
){
    const modules = [];

    for(const moduleName in orinCommandData){
        if(
            getLibraryName(
                moduleName
            ) !== library
        ){
            continue;
        }

        if(
            search !== "" &&
            !moduleMatchesSearch(
                moduleName,
                search
            )
        ){
            continue;
        }

        modules.push(
            moduleName
        );
    }

    return modules;
}


// Load the file/module column
function loadModules(
    library,
    search = ""
){
    const moduleList =
        document.getElementById(
            "moduleList"
        );

    moduleList.innerHTML = "";

    const modules =
        getModulesForLibrary(
            library,
            search
        );

    for(const moduleName of modules){
        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            getFileName(
                moduleName
            );

        button.className =
            "guideItem moduleItem";

        if(moduleName === selectedModule){
            button.classList.add(
                "selected"
            );
        }

        button.onclick = function(){
            selectModule(
                moduleName,
                search
            );
        };

        moduleList.appendChild(
            button
        );
    }
}


// Select a module
function selectModule(
    moduleName,
    search = ""
){
    selectedModule =
        moduleName;

    selectedCommand =
        null;

    loadModules(
        selectedLibrary,
        search
    );

    loadCommands(
        moduleName,
        search
    );

    clearCommandInformation();
}


// Load functions from a module
function loadCommands(
    moduleName,
    search = ""
){
    const commandList =
        document.getElementById(
            "commandList"
        );

    commandList.innerHTML = "";

    const module =
        orinCommandData[
            moduleName
        ];

    if(
        !module ||
        !Array.isArray(
            module.commands
        )
    ){
        return;
    }

    const moduleNameMatches =
        moduleName
            .toLowerCase()
            .includes(
                search.toLowerCase()
            );

    for(const command of module.commands){
        if(
            search !== "" &&
            !moduleNameMatches &&
            !commandMatchesSearch(
                command,
                search
            )
        ){
            continue;
        }

        const button =
            document.createElement(
                "button"
            );

        button.textContent =
            command.name;

        button.className =
            "guideItem commandItem";

        button.onclick = function(){
            selectCommand(
                command,
                button
            );
        };

        commandList.appendChild(
            button
        );
    }
}


// Clear the function column
function clearCommands(){
    document.getElementById(
        "commandList"
    ).innerHTML = "";
}


// Select a function
function selectCommand(
    command,
    button
){
    selectedCommand =
        command;

    const items =
        document.querySelectorAll(
            ".commandItem"
        );

    for(const item of items){
        item.classList.remove(
            "selected"
        );
    }

    button.classList.add(
        "selected"
    );

    showCommandInformation(
        command
    );
}


// Display function information
function showCommandInformation(command){
    document.getElementById(
        "commandName"
    ).textContent =
        command.name;

    document.getElementById(
        "commandSyntax"
    ).textContent =
        command.syntax || "";

    document.getElementById(
        "commandDescription"
    ).textContent =
        command.description || "";

    document.getElementById(
        "commandExample"
    ).textContent =
        command.example || "";

    document.getElementById(
        "copyExampleButton"
    ).disabled =
        !command.example;

    updateImportButton();
}


// Clear function information
function clearCommandInformation(){
    document.getElementById(
        "commandName"
    ).textContent =
        "Select a function";

    document.getElementById(
        "commandSyntax"
    ).textContent = "";

    document.getElementById(
        "commandDescription"
    ).textContent =
        "Select a function to see more information.";

    document.getElementById(
        "commandExample"
    ).textContent = "";

    document.getElementById(
        "copyExampleButton"
    ).disabled = true;

    updateImportButton();
}


// Update the import button
function updateImportButton(){
    const importButton =
        document.getElementById(
            "importCommandButton"
        );

    if(
        !selectedModule ||
        !selectedModule.includes(".")
    ){
        importButton.disabled = true;
        importButton.textContent =
            "Built-in";

        return;
    }

    importButton.disabled =
        selectedCommand === null;

    importButton.textContent =
        `Import ${selectedModule}`;
}


// Copy the selected example
async function copyCommandExample(){
    if(
        !selectedCommand ||
        !selectedCommand.example
    ){
        return;
    }

    try{
        await navigator.clipboard.writeText(
            selectedCommand.example
        );

        const button =
            document.getElementById(
                "copyExampleButton"
            );

        const originalText =
            button.textContent;

        button.textContent =
            "Copied";

        setTimeout(
            function(){
                button.textContent =
                    originalText;
            },
            1000
        );
    }
    catch(error){
        console.error(
            "Unable to copy example:",
            error
        );
    }
}


// Import the selected module
function importSelectedCommandModule(){
    if(
        !selectedModule ||
        !selectedModule.includes(".")
    ){
        return;
    }

    const importLine =
        `import ${selectedModule};`;

    const currentCode =
        editor.getValue();

    const lines =
        currentCode.split(
            /\r?\n/
        );

    if(
        lines.some(
            line =>
                line.trim() ===
                importLine
        )
    ){
        return;
    }

    editor.setValue(
        importLine +
        "\n" +
        currentCode
    );
}


// Check whether a module matches a search
function moduleMatchesSearch(
    moduleName,
    search
){
    const loweredSearch =
        search.toLowerCase();

    if(
        moduleName
            .toLowerCase()
            .includes(
                loweredSearch
            )
    ){
        return true;
    }

    const module =
        orinCommandData[
            moduleName
        ];

    if(!module){
        return false;
    }

    if(
        module.description &&
        module.description
            .toLowerCase()
            .includes(
                loweredSearch
            )
    ){
        return true;
    }

    for(const command of module.commands){
        if(
            commandMatchesSearch(
                command,
                loweredSearch
            )
        ){
            return true;
        }
    }

    return false;
}


// Check whether a function matches a search
function commandMatchesSearch(
    command,
    search
){
    const loweredSearch =
        search.toLowerCase();

    const values = [
        command.name,
        command.syntax,
        command.description,
        command.example
    ];

    for(const value of values){
        if(
            value &&
            value
                .toLowerCase()
                .includes(
                    loweredSearch
                )
        ){
            return true;
        }
    }

    return false;
}


// Search the whole guide
function searchCommands(){
    const search =
        document.getElementById(
            "commandSearch"
        ).value
            .trim()
            .toLowerCase();

    const libraries =
        getLibraries(
            search
        );

    if(libraries.length === 0){
        selectedLibrary = null;
        selectedModule = null;
        selectedCommand = null;

        loadLibraries(search);

        document.getElementById(
            "moduleList"
        ).innerHTML = "";

        clearCommands();
        clearCommandInformation();

        return;
    }

    if(
        !selectedLibrary ||
        !libraries.includes(
            selectedLibrary
        )
    ){
        selectedLibrary =
            libraries[0];
    }

    const modules =
        getModulesForLibrary(
            selectedLibrary,
            search
        );

    if(
        modules.length === 0
    ){
        selectedLibrary =
            libraries[0];
    }

    const validModules =
        getModulesForLibrary(
            selectedLibrary,
            search
        );

    if(
        !selectedModule ||
        !validModules.includes(
            selectedModule
        )
    ){
        selectedModule =
            validModules[0] || null;
    }

    selectedCommand = null;

    loadLibraries(search);

    loadModules(
        selectedLibrary,
        search
    );

    if(selectedModule){
        loadCommands(
            selectedModule,
            search
        );
    }
    else{
        clearCommands();
    }

    clearCommandInformation();
}


// Listen for searches
document.getElementById(
    "commandSearch"
).addEventListener(
    "input",
    searchCommands
);


// Close with Escape
document.addEventListener(
    "keydown",
    function(event){
        if(
            event.key === "Escape" &&
            !document.getElementById(
                "commandGuide"
            ).hidden
        ){
            closeCommandGuide();
        }
    }
);