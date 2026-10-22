function getRuntime(){
    return window["orinWindowRuntime"] || null;
}

function createTextareaObject(value = ""){
    if(typeof value !== "string"){
        throw new Error(
            "textarea value must be a string"
        );
    }

    let textareaValue = value;
    let placeholder = "";
    let id = "";
    let className = "";
    let x = 0;
    let y = 0;
    let disabled = false;
    let inputAction = null;
    let changeAction = null;
    let element = null;

    function runAction(action){
        if(!action){return;}

        const runtime = getRuntime();

        if(
            !runtime ||
            typeof runtime.run !== "function"
        ){
            throw new Error(
                "Orin window runtime is unavailable"
            );
        }

        runtime.run(action);
    }

    function applyPosition(){
        if(!element){return;}

        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    }

    function applyClass(){
        if(!element){return;}

        element.className = className;
    }

    function applyValue(){
        if(!element){return;}

        element.value = textareaValue;
    }

    function applyPlaceholder(){
        if(!element){return;}

        element.placeholder = placeholder;
    }

    function applyDisabled(){
        if(!element){return;}

        element.disabled = disabled;
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "textarea",

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

        setValue(value){
            if(typeof value !== "string"){
                throw new Error(
                    "textarea value must be a string"
                );
            }

            textareaValue = value;

            applyValue();

            return this;
        },

        getValue(){
            if(element){
                textareaValue =
                    element.value;
            }

            return textareaValue;
        },

        setPlaceholder(value){
            if(typeof value !== "string"){
                throw new Error(
                    "placeholder must be a string"
                );
            }

            placeholder = value;

            applyPlaceholder();

            return this;
        },

        setDisabled(value){
            if(typeof value !== "boolean"){
                throw new Error(
                    "disabled must be a boolean"
                );
            }

            disabled = value;

            applyDisabled();

            return this;
        },

        onInput(action){
            if(typeof action !== "string"){
                throw new Error(
                    "input action must be a string"
                );
            }

            inputAction = action;

            return this;
        },

        onChange(action){
            if(typeof action !== "string"){
                throw new Error(
                    "change action must be a string"
                );
            }

            changeAction = action;

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
                    "textarea"
                );

            element.id = id;

            applyClass();
            applyPosition();
            applyValue();
            applyPlaceholder();
            applyDisabled();

            element.addEventListener(
                "input",
                function(){
                    textareaValue =
                        element.value;

                    runAction(
                        inputAction
                    );
                }
            );

            element.addEventListener(
                "change",
                function(){
                    textareaValue =
                        element.value;

                    runAction(
                        changeAction
                    );
                }
            );

            document.body.appendChild(
                element
            );
        },

        __unmount(){
            if(!element){return;}

            textareaValue =
                element.value;

            element.remove();
            element = null;
        },

        __getElement(){
            return element;
        },

        __forgetElement(){
            if(element){
                textareaValue =
                    element.value;
            }

            element = null;
        }
    };
}

export function create(value = ""){
    return createTextareaObject(
        value
    );
}