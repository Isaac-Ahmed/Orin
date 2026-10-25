export async function create(value = 0){
    if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("value must be a finite number");}
    if(value < 0 || value > 100){throw new Error("value must be between 0 and 100");}

    let element = document.createElement("progress");

    let id = null;
    let className = "";
    let x = 0;
    let y = 0;

    let max = 100;

    element.max = max;
    element.value = value;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;

    return {
        __orinWindowElement: true,
        __orinWindowType: "progressbar",

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

        setMax(value){
            if(typeof value !== "number" || !Number.isFinite(value) || value <= 0){throw new Error("maximum must be a positive finite number");}

            max = value;
            element.max = max;

            if(Number(element.value) > max){
                element.value = max;
            }
        },

        getMax(){
            return max;
        },

        setValue(value){
            if(typeof value !== "number" || !Number.isFinite(value)){throw new Error("value must be a finite number");}
            if(value < 0 || value > max){throw new Error("value must be between 0 and maximum");}

            element.value = value;
        },

        getValue(){
            return Number(element.value);
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