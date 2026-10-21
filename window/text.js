function validateNumber(value, name){
    if(
        typeof value !== "number" ||
        !Number.isFinite(value)
    ){
        throw new Error(
            `${name} must be a number`
        );
    }
}

function createTextObject(value){
    let text =
        value === undefined
            ? ""
            : String(value);

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let element = null;

    function updatePosition(){
        if(!element){return;}

        element.style.position =
            "absolute";

        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;
    }

    function updateText(){
        if(!element){return;}

        element.textContent =
            text;
    }

    function updateClass(){
        if(!element){return;}

        element.className =
            className;
    }

    function updateId(){
        if(!element){return;}

        element.id =
            id;
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "text",

        setClass(value){
            if(typeof value !== "string"){
                throw new Error(
                    "class must be a string"
                );
            }

            className = value;

            updateClass();

            return this;
        },

        setX(value){
            validateNumber(
                value,
                "x"
            );

            x = value;

            updatePosition();

            return this;
        },

        setY(value){
            validateNumber(
                value,
                "y"
            );

            y = value;

            updatePosition();

            return this;
        },

        setText(value){
            text =
                String(value);

            updateText();

            return this;
        },

        __setId(value){
            id =
                String(value);

            updateId();
        },

        __mount(document){
            if(element){
                element.remove();
            }

            element =
                document.createElement(
                    "div"
                );

            updateId();
            updateClass();
            updatePosition();
            updateText();

            document.body.appendChild(
                element
            );
        },

        __unmount(){
            if(!element){return;}

            element.remove();

            element = null;
        },

        __forgetElement(){
            element = null;
        }
    };
}

export function create(value){
    return createTextObject(
        value
    );
}