function getRuntime(){
    return window["orinWindowRuntime"] || null;
}

function createDropdownObject(){
    let options = [];
    let selectedValue = "";
    let disabled = false;

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

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

    function validateOptions(values){
        for(const value of values){
            if(typeof value !== "string"){
                throw new Error(
                    "dropdown options must be strings"
                );
            }
        }
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

    function applyDisabled(){
        if(!element){return;}

        element.disabled =
            disabled;
    }

    function rebuildOptions(){
        if(!element){return;}

        element.innerHTML = "";

        for(const value of options){
            const option =
                element.ownerDocument
                    .createElement(
                        "option"
                    );

            option.value =
                value;

            option.textContent =
                value;

            element.appendChild(
                option
            );
        }

        if(
            options.includes(
                selectedValue
            )
        ){
            element.value =
                selectedValue;
        }
        else if(
            options.length > 0
        ){
            selectedValue =
                options[0];

            element.value =
                selectedValue;
        }
        else{
            selectedValue = "";
        }
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "dropdown",

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

        addOptions(...values){
            validateOptions(
                values
            );

            for(const value of values){
                options.push(
                    value
                );
            }

            rebuildOptions();

            return this;
        },

        setOptions(...values){
            validateOptions(
                values
            );

            options = [
                ...values
            ];

            if(
                !options.includes(
                    selectedValue
                )
            ){
                selectedValue =
                    options.length > 0
                        ? options[0]
                        : "";
            }

            rebuildOptions();

            return this;
        },

        removeOptions(...values){
            validateOptions(
                values
            );

            options =
                options.filter(
                    option =>
                        !values.includes(
                            option
                        )
                );

            if(
                !options.includes(
                    selectedValue
                )
            ){
                selectedValue =
                    options.length > 0
                        ? options[0]
                        : "";
            }

            rebuildOptions();

            return this;
        },

        clearOptions(){
            options = [];
            selectedValue = "";

            rebuildOptions();

            return this;
        },

        setValue(value){
            if(typeof value !== "string"){
                throw new Error(
                    "dropdown value must be a string"
                );
            }

            if(
                !options.includes(
                    value
                )
            ){
                throw new Error(
                    `dropdown option '${value}' does not exist`
                );
            }

            selectedValue = value;

            if(element){
                element.value =
                    selectedValue;
            }

            return this;
        },

        getValue(){
            if(element){
                selectedValue =
                    element.value;
            }

            return selectedValue;
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

            if(element){
                element.id =
                    id;
            }
        },

        __mount(document){
            if(element){return;}

            element =
                document.createElement(
                    "select"
                );

            element.id = id;

            applyClass();
            applyPosition();
            applyDisabled();

            rebuildOptions();

            element.addEventListener(
                "change",
                function(){
                    selectedValue =
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

            selectedValue =
                element.value;

            element.remove();
            element = null;
        },

        __getElement(){
            return element;
        },

        __forgetElement(){
            if(element){
                selectedValue =
                    element.value;
            }

            element = null;
        }
    };
}

export function create(){
    return createDropdownObject();
}