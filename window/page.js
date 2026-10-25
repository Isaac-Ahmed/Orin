function validateElement(element){
    if(
        typeof element !== "object" ||
        element === null ||
        element.__orinWindowElement !== true
    ){
        throw new Error(
            "value must be a window element"
        );
    }
}

function getRuntime(){
    return (
        window[
            "orinWindowRuntime"
        ] ||
        null
    );
}

function getProjectFiles(){
    return (
        window[
            "orinProjectFiles"
        ] ||
        null
    );
}

function getElementName(element){
    const runtime =
        getRuntime();

    if(
        !runtime ||
        typeof runtime.getName !==
        "function"
    ){
        return null;
    }

    return runtime.getName(
        element
    );
}

function validateStylePath(path){
    if(typeof path !== "string"){
        throw new Error(
            "style path must be a string"
        );
    }

    path =
        path.trim();

    if(path === ""){
        throw new Error(
            "style path cannot be empty"
        );
    }

    if(
        !path
            .toLowerCase()
            .endsWith(".css")
    ){
        throw new Error(
            "style file must be a CSS file"
        );
    }

    const projectFiles =
        getProjectFiles();

    if(
        !projectFiles ||
        typeof projectFiles.exists !==
            "function" ||
        typeof projectFiles.readText !==
            "function"
    ){
        throw new Error(
            "project file system is unavailable"
        );
    }

    if(
        !projectFiles.exists(
            path
        )
    ){
        throw new Error(
            `CSS file '${path}' does not exist`
        );
    }

    return path;
}

function createMountDocument(document){
    return new Proxy(
        document,
        {
            get(target, property){
                if(property === "appendChild"){
                    return function(element){
                        return target.body.appendChild(
                            element
                        );
                    };
                }

                if(property === "removeChild"){
                    return function(element){
                        return target.body.removeChild(
                            element
                        );
                    };
                }

                const value =
                    target[
                        property
                    ];

                if(typeof value === "function"){
                    return value.bind(
                        target
                    );
                }

                return value;
            }
        }
    );
}

function createPageObject(){
    let elements = [];
    let popup = null;

    let mountDocument = null;

    let stylePath = null;
    let styleElement = null;

    function isOpen(){
        return (
            popup !== null &&
            !popup.closed
        );
    }

    function mountElement(element){
        if(
            !isOpen() ||
            mountDocument === null
        ){
            return;
        }

        const name =
            getElementName(
                element
            );

        if(
            name &&
            typeof element.__setId ===
                "function"
        ){
            element.__setId(
                name
            );
        }

        element.__mount(
            mountDocument
        );
    }

    function unmountElement(element){
        if(
            typeof element.__unmount ===
                "function"
        ){
            element.__unmount();
        }
    }

    function getStyleContents(){
        if(stylePath === null){
            return "";
        }

        const projectFiles =
            getProjectFiles();

        return projectFiles.readText(
            stylePath
        );
    }

    function applyStyle(){
        if(!isOpen()){
            return;
        }

        if(stylePath === null){
            if(styleElement){
                styleElement.remove();
                styleElement = null;
            }

            return;
        }

        if(!styleElement){
            styleElement =
                popup.document.createElement(
                    "style"
                );

            styleElement.id =
                "orin-window-style";

            popup.document.head.appendChild(
                styleElement
            );
        }

        styleElement.textContent =
            getStyleContents();
    }

    return {
        __orinWindowPage: true,

        add(element){
            validateElement(
                element
            );

            if(
                elements.includes(
                    element
                )
            ){
                return this;
            }

            elements.push(
                element
            );

            if(isOpen()){
                mountElement(
                    element
                );
            }

            return this;
        },

        remove(element){
            validateElement(
                element
            );

            const index =
                elements.indexOf(
                    element
                );

            if(index === -1){
                return this;
            }

            unmountElement(
                element
            );

            elements.splice(
                index,
                1
            );

            return this;
        },

        addAll(...values){
            for(
                const value
                of values
            ){
                this.add(
                    value
                );
            }

            return this;
        },

        removeAll(...values){
            for(
                const value
                of values
            ){
                this.remove(
                    value
                );
            }

            return this;
        },

        clear(){
            for(
                const element
                of elements
            ){
                unmountElement(
                    element
                );
            }

            elements = [];

            return this;
        },

        setStyle(path){
            stylePath =
                validateStylePath(
                    path
                );

            if(isOpen()){
                applyStyle();
            }

            return this;
        },

        removeStyle(){
            stylePath = null;

            if(styleElement){
                styleElement.remove();
                styleElement = null;
            }

            return this;
        },

        show(){
            if(isOpen()){
                popup.focus();

                return this;
            }

            popup =
                window.open(
                    "",
                    "_blank",
                    "width=800,height=600"
                );

            if(!popup){
                throw new Error(
                    "unable to open window"
                );
            }

            const document =
                popup.document;

            document.open();

            document.write(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Orin Window</title>" +
                "</head>" +
                "<body></body>" +
                "</html>"
            );

            document.close();

            document.body.style.margin =
                "0";

            document.body.style.position =
                "relative";

            document.body.style.minHeight =
                "100vh";

            mountDocument =
                createMountDocument(
                    document
                );

            styleElement = null;

            applyStyle();

            for(
                const element
                of elements
            ){
                mountElement(
                    element
                );
            }

            return this;
        },

        close(){
            if(isOpen()){
                popup.close();
            }

            popup = null;
            mountDocument = null;
            styleElement = null;

            for(
                const element
                of elements
            ){
                if(
                    typeof element.__forgetElement ===
                        "function"
                ){
                    element.__forgetElement();
                }
            }

            return this;
        }
    };
}

export function create(){
    return createPageObject();
}