function getRuntime(){
    return window["orinWindowRuntime"] || null;
}

function createListObject(){
    let values = [];
    let ordered = false;

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let element = null;

    function validateValues(items){
        for(const item of items){
            if(typeof item !== "string"){
                throw new Error(
                    "list values must be strings"
                );
            }
        }
    }

    function validateIndex(index){
        if(
            !Number.isSafeInteger(index) ||
            index < 0 ||
            index >= values.length
        ){
            throw new Error(
                "list index is out of range"
            );
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

    function rebuild(){
        if(!element){return;}

        const document =
            element.ownerDocument;

        const newElement =
            document.createElement(
                ordered
                    ? "ol"
                    : "ul"
            );

        newElement.id =
            id;

        newElement.className =
            className;

        newElement.style.position =
            "absolute";

        newElement.style.left =
            `${x}px`;

        newElement.style.top =
            `${y}px`;

        for(const value of values){
            const item =
                document.createElement(
                    "li"
                );

            item.textContent =
                value;

            newElement.appendChild(
                item
            );
        }

        element.replaceWith(
            newElement
        );

        element =
            newElement;
    }

    function rebuildItems(){
        if(!element){return;}

        element.innerHTML = "";

        const document =
            element.ownerDocument;

        for(const value of values){
            const item =
                document.createElement(
                    "li"
                );

            item.textContent =
                value;

            element.appendChild(
                item
            );
        }
    }

    return {
        __orinWindowElement: true,
        __orinWindowType: "list",

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

        setOrdered(value){
            if(typeof value !== "boolean"){
                throw new Error(
                    "ordered must be a boolean"
                );
            }

            if(ordered === value){
                return this;
            }

            ordered = value;

            rebuild();

            return this;
        },

        add(...items){
            validateValues(
                items
            );

            for(const item of items){
                values.push(
                    item
                );
            }

            rebuildItems();

            return this;
        },

        setItems(...items){
            validateValues(
                items
            );

            values = [
                ...items
            ];

            rebuildItems();

            return this;
        },

        set(index, value){
            validateIndex(
                index
            );

            if(typeof value !== "string"){
                throw new Error(
                    "list value must be a string"
                );
            }

            values[index] =
                value;

            rebuildItems();

            return this;
        },

        remove(index){
            validateIndex(
                index
            );

            values.splice(
                index,
                1
            );

            rebuildItems();

            return this;
        },

        getValue(index){
            validateIndex(
                index
            );

            return values[index];
        },

        length(){
            return values.length;
        },

        clear(){
            values = [];

            rebuildItems();

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
                    ordered
                        ? "ol"
                        : "ul"
                );

            element.id = id;

            applyClass();
            applyPosition();
            rebuildItems();

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

export function create(){
    return createListObject();
}