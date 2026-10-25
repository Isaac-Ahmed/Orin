export async function create(value = 0){
    if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("value must be a finite number");}

    let element = document.createElement("input");

    let id = null;
    let className = "";
    let x = 0;
    let y = 0;

    let min = 0;
    let max = 100;
    let step = 1;

    let inputAction = null;
    let changeAction = null;

    element.type = "range";
    element.min = min;
    element.max = max;
    element.step = step;
    element.value = value;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    element.addEventListener("input", async function(){
        if(inputAction === null){return;}
        await orinWindowRuntime.run(inputAction);
    });

    element.addEventListener("change", async function(){
        if(changeAction === null){return;}
        await orinWindowRuntime.run(changeAction);
    });

    return {
        __orinWindowElement: true,
        __orinWindowType: "slider",

        setClass(value){
            if(typeof value !== "string"){throw new Error("class must be a string");}

            className = value;
            element.className = className;
        },

        setX(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("x must be a finite number");}

            x = value;
            element.style.left = `${x}px`;
        },

        setY(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("y must be a finite number");}

            y = value;
            element.style.top = `${y}px`;
        },

        setWidth(value){
            if(typeof value !== "number" || !Number.isFinite(value) || value < 0){throw new Error("width must be a non-negative finite number");}

            element.style.width = `${value}px`;
        },

        setHeight(value){
            if(typeof value !== "number" || !Number.isFinite(value) || value < 0){throw new Error("height must be a non-negative finite number");}

            element.style.height = `${value}px`;
        },

        setMin(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("minimum must be a finite number");}
            if(value >= max){throw new Error("minimum must be less than maximum");}

            min = value;
            element.min = min;

            if(Number(element.value) < min){
                element.value = min;
            }
        },

        setMax(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("maximum must be a finite number");}
            if(value <= min){throw new Error("maximum must be greater than minimum");}

            max = value;
            element.max = max;

            if(Number(element.value) > max){
                element.value = max;
            }
        },

        setStep(value){
            if(typeof value !== "number" || !Number.isFinite(value) || value <= 0){throw new Error("step must be a positive finite number");}

            step = value;
            element.step = step;
        },

        setValue(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("value must be a finite number");}
            if(value < min || value > max){throw new Error("value must be between minimum and maximum");}

            element.value = value;
        },

        getValue(){
            return Number(element.value);
        },

        setDisabled(value){
            if(typeof value !== "boolean"){throw new Error("disabled must be a boolean");}

            element.disabled = value;
        },

        onInput(action){
            if(typeof action !== "string"){throw new Error("action must be a string");}

            inputAction = action;
        },

        onChange(action){
            if(typeof action !== "string"){throw new Error("action must be a string");}

            changeAction = action;
        },

        __setId(value){
            id = value;
            element.id = id;
        },

        __mount(parent){
            parent.appendChild(element);
        },

        __unmount(){
            element.remove();
        },

        __forgetElement(){
            element = null;
        },

        __getElement(){
            return element;
        }
    };
}