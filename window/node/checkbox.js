function getRuntime(){
    return window["orinWindowRuntime"] || null;
}

function createCheckboxObject(text = ""){
    if(typeof text !== "string"){
        throw new Error(
            "checkbox text must be a string"
        );
    }

    let labelText = text;
    let checked = false;
    let disabled = false;

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let changeAction = null;

    let container = null;
    let element = null;
    let label = null;

    function runAction(action){
        if(!action){return;}

        const runtime =
            getRuntime();

        if(
            !runtime ||
            typeof runtime.run !== "function"
        ){
            throw new Error(
                "Orin window runtime is unavailable"
            );
        }

        runtime.run(
            action
        );
    }

    function applyPosition(){
        if(!container){return;}

        container.style.position =
            "absolute";

        container.style.left =
            `${x}px`;

        container.style.top =
            `${y}px`;
    }

    function applyClass(){
        if(!container){return;}

        container.className =
            className;
    }

    function applyText(){
        if(!label){return;}

        label.textContent =
            labelText;
    }

    function applyChecked(){
        if(!element){return;}

        element.checked =
            checked;
    }

    function applyDisabled(){
        if(!element){return;}

        element.disabled =
            disabled;
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "checkbox",

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

        setText(value){
            if(typeof value !== "string"){
                throw new Error(
                    "checkbox text must be a string"
                );
            }

            labelText = value;

            applyText();

            return this;
        },

        setValue(value){
            if(typeof value !== "boolean"){
                throw new Error(
                    "checkbox value must be a boolean"
                );
            }

            checked = value;

            applyChecked();

            return this;
        },

        getValue(){
            if(element){
                checked =
                    element.checked;
            }

            return checked;
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

            if(container){
                container.id =
                    id;
            }

            if(element){
                element.id =
                    `${id}_input`;
            }
        },

        __mount(document){
            if(container){return;}

            container =
                document.createElement(
                    "label"
                );

            element =
                document.createElement(
                    "input"
                );

            label =
                document.createElement(
                    "span"
                );

            container.id =
                id;

            element.id =
                `${id}_input`;

            element.type =
                "checkbox";

            applyClass();
            applyPosition();
            applyText();
            applyChecked();
            applyDisabled();

            element.addEventListener(
                "change",
                function(){
                    checked =
                        element.checked;

                    runAction(
                        changeAction
                    );
                }
            );

            container.appendChild(
                element
            );

            container.appendChild(
                label
            );

            document.body.appendChild(
                container
            );
        },

        __unmount(){
            if(!container){return;}

            if(element){
                checked =
                    element.checked;
            }

            container.remove();

            container = null;
            element = null;
            label = null;
        },

        __getElement(){
            return element;
        },

        __forgetElement(){
            if(element){
                checked =
                    element.checked;
            }

            container = null;
            element = null;
            label = null;
        }
    };
}

export function create(value = ""){
    return createCheckboxObject(
        value
    );
}