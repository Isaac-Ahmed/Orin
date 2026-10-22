function createContainerObject(){
    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let width = 300;
    let height = 200;

    let element = null;
    let mountedDocument = null;

    const children = [];

    function validateChild(child){
        if(
            !child ||
            typeof child !== "object" ||
            child.__orinWindowElement !== true
        ){
            throw new Error(
                "value must be a window element"
            );
        }

        if(child === containerObject){
            throw new Error(
                "container cannot contain itself"
            );
        }
    }

    function getChildElement(child){
        if(
            typeof child.__getElement !==
                "function"
        ){
            throw new Error(
                "window element does not support layout mounting"
            );
        }

        return child.__getElement();
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

    function applySize(){
        if(!element){return;}

        element.style.width =
            `${width}px`;

        element.style.height =
            `${height}px`;
    }

    function applyClass(){
        if(!element){return;}

        element.className =
            className;
    }

    function mountChild(child){
        if(
            !element ||
            !mountedDocument
        ){
            return;
        }

        let childElement =
            getChildElement(
                child
            );

        if(!childElement){
            child.__mount(
                mountedDocument
            );

            childElement =
                getChildElement(
                    child
                );
        }

        if(!childElement){
            throw new Error(
                "unable to mount window element"
            );
        }

        element.appendChild(
            childElement
        );
    }

    function removeChildElement(child){
        const childElement =
            getChildElement(
                child
            );

        if(
            childElement &&
            childElement.parentElement ===
                element
        ){
            childElement.remove();
        }

        if(
            typeof child.__forgetElement ===
                "function"
        ){
            child.__forgetElement();
        }
    }

    const containerObject = {
        __orinWindowElement: true,
        __orinWindowType: "container",

        setClass(value){
            if(typeof value !== "string"){
                throw new Error(
                    "class must be a string"
                );
            }

            className =
                value;

            applyClass();

            return this;
        },

        setX(value){
            if(typeof value !== "number"){
                throw new Error(
                    "x must be a number"
                );
            }

            x =
                value;

            applyPosition();

            return this;
        },

        setY(value){
            if(typeof value !== "number"){
                throw new Error(
                    "y must be a number"
                );
            }

            y =
                value;

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

            width =
                value;

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

            height =
                value;

            applySize();

            return this;
        },

        add(child){
            validateChild(
                child
            );

            if(
                children.includes(
                    child
                )
            ){
                return this;
            }

            children.push(
                child
            );

            mountChild(
                child
            );

            return this;
        },

        addAll(...values){
            for(const child of values){
                this.add(
                    child
                );
            }

            return this;
        },

        remove(child){
            validateChild(
                child
            );

            const index =
                children.indexOf(
                    child
                );

            if(index === -1){
                return this;
            }

            children.splice(
                index,
                1
            );

            if(element){
                removeChildElement(
                    child
                );
            }

            return this;
        },

        removeAll(...values){
            for(const child of values){
                this.remove(
                    child
                );
            }

            return this;
        },

        clear(){
            const values =
                [...children];

            for(const child of values){
                this.remove(
                    child
                );
            }

            return this;
        },

        length(){
            return children.length;
        },

        __setId(value){
            id =
                value;

            if(element){
                element.id =
                    id;
            }
        },

        __getElement(){
            return element;
        },

        __mount(document){
            if(element){return;}

            mountedDocument =
                document;

            element =
                document.createElement(
                    "div"
                );

            element.id =
                id;

            element.style.boxSizing =
                "border-box";

            element.style.overflow =
                "visible";

            applyClass();
            applyPosition();
            applySize();

            document.body.appendChild(
                element
            );

            for(const child of children){
                mountChild(
                    child
                );
            }
        },

        __unmount(){
            if(!element){return;}

            for(const child of children){
                if(
                    typeof child.__forgetElement ===
                        "function"
                ){
                    child.__forgetElement();
                }
            }

            element.remove();

            element = null;
            mountedDocument = null;
        },

        __forgetElement(){
            for(const child of children){
                if(
                    typeof child.__forgetElement ===
                        "function"
                ){
                    child.__forgetElement();
                }
            }

            element = null;
            mountedDocument = null;
        }
    };

    return containerObject;
}

export function create(){
    return createContainerObject();
}