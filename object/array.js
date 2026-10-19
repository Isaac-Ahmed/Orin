export function create(value){
    let type;
    let values;

    if(Array.isArray(value)){
        values = [...value];

        if(values.length === 0){
            throw new Error(
                "unable to determine empty array type"
            );
        }

        type = getArrayType(values);
    }
    else{
        type = value;
        values = [];
    }

    if(!isValidType(type)){
        throw new Error(
            `unknown array type '${type}'`
        );
    }

    return createArrayObject(
        type,
        values
    );
}


function createArrayObject(type, values){
    return {
        type: type,

        values: values,

        getValue(){
            return this.values;
        },

        getType(){
            return this.type;
        },

        get(index){
            checkIndex(
                this.values,
                index
            );

            return this.values[index];
        },

        set(index, value){
            checkIndex(
                this.values,
                index
            );

            checkValueType(
                this.type,
                value
            );

            this.values[index] =
                value;
        },

        add(value){
            checkValueType(
                this.type,
                value
            );

            this.values.push(
                value
            );
        },

        remove(index){
            checkIndex(
                this.values,
                index
            );

            return this.values.splice(
                index,
                1
            )[0];
        },

        length(){
            return this.values.length;
        }
    };
}


function getArrayType(values){
    let firstType = null;

    for(const value of values){
        if(value === null){
            continue;
        }

        firstType =
            getValueType(value);

        break;
    }

    if(firstType === null){
        throw new Error(
            "unable to determine array type"
        );
    }

    for(const value of values){
        if(value === null){
            continue;
        }

        const currentType =
            getValueType(value);

        if(currentType !== firstType){
            throw new Error(
                "array values must all be the same type"
            );
        }
    }

    return firstType;
}


function getValueType(value){
    if(typeof value === "boolean"){
        return "boolean";
    }

    if(typeof value === "number"){
        if(Number.isSafeInteger(value)){
            return "integer";
        }

        return "double";
    }

    if(typeof value === "string"){
        return "string";
    }

    return null;
}


function checkValueType(type, value){
    if(value === null){
        return;
    }

    const valueType =
        getValueType(value);

    if(type === "char"){
        if(
            typeof value === "string" &&
            [...value].length === 1
        ){
            return;
        }

        throw new Error(
            "value must be a char"
        );
    }

    if(valueType !== type){
        throw new Error(
            `value must be ${type}`
        );
    }
}


function checkIndex(values, index){
    if(
        !Number.isSafeInteger(index) ||
        index < 0 ||
        index >= values.length
    ){
        throw new Error(
            "array index out of bounds"
        );
    }
}


function isValidType(type){
    return (
        type == "integer" ||
        type == "double" ||
        type == "string" ||
        type == "boolean" ||
        type == "char"
    );
}