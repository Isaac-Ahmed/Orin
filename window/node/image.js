function getProjectFiles(){
    return (
        window[
            "orinProjectFiles"
        ] ||
        null
    );
}

function createImageObject(path = ""){
    if(typeof path !== "string"){
        throw new Error(
            "image path must be a string"
        );
    }

    let imagePath = path;

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let width = null;
    let height = null;

    let alt = "";

    let element = null;

    function getImageSource(){
        const projectFiles =
            getProjectFiles();

        if(
            !projectFiles ||
            typeof projectFiles.readImage !==
                "function"
        ){
            throw new Error(
                "project image system is unavailable"
            );
        }

        return projectFiles.readImage(
            imagePath
        );
    }

    function applyPosition(){
        if(!element){return;}

        element.style.position =
            "absolute";

        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;
    }

    function applyClass(){
        if(!element){return;}

        element.className =
            className;
    }

    function applySize(){
        if(!element){return;}

        if(width === null){
            element.style.width = "";
        }
        else{
            element.style.width =
                `${width}px`;
        }

        if(height === null){
            element.style.height = "";
        }
        else{
            element.style.height =
                `${height}px`;
        }
    }

    function applyAlt(){
        if(!element){return;}

        element.alt =
            alt;
    }

    function applySource(){
        if(!element){return;}

        element.src =
            getImageSource();
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "image",

        setClass(value){
            if(typeof value !== "string"){
                throw new Error(
                    "class must be a string"
                );
            }

            className = value;

            applyClass();

            return this;
        },

        setX(value){
            if(typeof value !== "number"){
                throw new Error(
                    "x must be a number"
                );
            }

            x = value;

            applyPosition();

            return this;
        },

        setY(value){
            if(typeof value !== "number"){
                throw new Error(
                    "y must be a number"
                );
            }

            y = value;

            applyPosition();

            return this;
        },

        setWidth(value){
            if(
                typeof value !== "number" ||
                value <= 0
            ){
                throw new Error(
                    "width must be a positive number"
                );
            }

            width = value;

            applySize();

            return this;
        },

        setHeight(value){
            if(
                typeof value !== "number" ||
                value <= 0
            ){
                throw new Error(
                    "height must be a positive number"
                );
            }

            height = value;

            applySize();

            return this;
        },

        setSource(value){
            if(typeof value !== "string"){
                throw new Error(
                    "image path must be a string"
                );
            }

            imagePath = value;

            applySource();

            return this;
        },

        setAlt(value){
            if(typeof value !== "string"){
                throw new Error(
                    "alt text must be a string"
                );
            }

            alt = value;

            applyAlt();

            return this;
        },

        __setId(value){
            id = value;

            if(element){
                element.id = id;
            }
        },

        __mount(document){
            if(element){return;}

            element =
                document.createElement(
                    "img"
                );

            element.id = id;

            element.src =
                getImageSource();

            applyClass();
            applyPosition();
            applySize();
            applyAlt();

            document.body.appendChild(
                element
            );
        },

        __unmount(){
            if(!element){return;}

            element.remove();
            element = null;
        },

        __getElement(){
            return element;
        },

        __forgetElement(){
            element = null;
        }
    };
}

export function create(value = ""){
    return createImageObject(
        value
    );
}