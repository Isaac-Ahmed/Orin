function createShapeObject(type = "rectangle"){
    if(typeof type !== "string"){
        throw new Error(
            "shape type must be a string"
        );
    }

    let shapeType =
        type.trim().toLowerCase();

    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let width = 100;
    let height = 100;

    let rotation = 0;

    let polygonSides = null;
    let starPoints = null;

    let headSize = 25;

    let container = null;
    let element = null;

    function parseShapeType(value){
        const cleanValue =
            value.trim().toLowerCase();

        const polygonMatch =
            cleanValue.match(
                /^polygon\((\d+)\)$/
            );

        if(polygonMatch){
            const sides =
                Number(
                    polygonMatch[1]
                );

            if(
                !Number.isSafeInteger(sides) ||
                sides < 3 ||
                sides > 100
            ){
                throw new Error(
                    "polygon sides must be between 3 and 100"
                );
            }

            return {
                type: "polygon",
                sides: sides
            };
        }

        const starMatch =
            cleanValue.match(
                /^star\((\d+)\)$/
            );

        if(starMatch){
            const points =
                Number(
                    starMatch[1]
                );

            if(
                !Number.isSafeInteger(points) ||
                points < 3 ||
                points > 100
            ){
                throw new Error(
                    "star points must be between 3 and 100"
                );
            }

            return {
                type: "star",
                points: points
            };
        }

        const validTypes = [
            "circle",
            "ellipse",
            "square",
            "rectangle",
            "triangle",
            "line",
            "arrow"
        ];

        if(
            !validTypes.includes(
                cleanValue
            )
        ){
            throw new Error(
                "unknown shape type"
            );
        }

        return {
            type: cleanValue
        };
    }

    function applyShapeType(value){
        const details =
            parseShapeType(
                value
            );

        shapeType =
            details.type;

        polygonSides =
            details.sides || null;

        starPoints =
            details.points || null;
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

    function applySize(){
        if(!container){return;}

        container.style.width =
            `${width}px`;

        container.style.height =
            `${height}px`;

        container.setAttribute(
            "width",
            width
        );

        container.setAttribute(
            "height",
            height
        );
    }

    function applyClass(){
        if(!element){return;}

        element.setAttribute(
            "class",
            className
        );
    }

    function applyRotation(){
        if(!container){return;}

        container.style.transform =
            `rotate(${rotation}rad)`;

        container.style.transformOrigin =
            "center center";
    }

    function createPolygonPoints(sides){
        const points = [];

        const centerX =
            width / 2;

        const centerY =
            height / 2;

        const radiusX =
            width / 2;

        const radiusY =
            height / 2;

        for(
            let i = 0;
            i < sides;
            i++
        ){
            const angle =
                -Math.PI / 2 +
                (
                    i *
                    Math.PI *
                    2
                ) /
                sides;

            const pointX =
                centerX +
                Math.cos(angle) *
                radiusX;

            const pointY =
                centerY +
                Math.sin(angle) *
                radiusY;

            points.push(
                `${pointX},${pointY}`
            );
        }

        return points.join(" ");
    }

    function createStarPoints(points){
        const output = [];

        const centerX =
            width / 2;

        const centerY =
            height / 2;

        const outerRadiusX =
            width / 2;

        const outerRadiusY =
            height / 2;

        const innerRadiusX =
            outerRadiusX * 0.45;

        const innerRadiusY =
            outerRadiusY * 0.45;

        const totalPoints =
            points * 2;

        for(
            let i = 0;
            i < totalPoints;
            i++
        ){
            const angle =
                -Math.PI / 2 +
                (
                    i *
                    Math.PI
                ) /
                points;

            const useOuter =
                i % 2 === 0;

            const radiusX =
                useOuter
                    ? outerRadiusX
                    : innerRadiusX;

            const radiusY =
                useOuter
                    ? outerRadiusY
                    : innerRadiusY;

            const pointX =
                centerX +
                Math.cos(angle) *
                radiusX;

            const pointY =
                centerY +
                Math.sin(angle) *
                radiusY;

            output.push(
                `${pointX},${pointY}`
            );
        }

        return output.join(" ");
    }

    function createArrowPoints(){
        const head =
            Math.min(
                headSize,
                width
            );

        const bodyHeight =
            height * 0.4;

        const top =
            (
                height -
                bodyHeight
            ) /
            2;

        const bottom =
            top +
            bodyHeight;

        const bodyEnd =
            width -
            head;

        return [
            `0,${top}`,
            `${bodyEnd},${top}`,
            `${bodyEnd},0`,
            `${width},${height / 2}`,
            `${bodyEnd},${height}`,
            `${bodyEnd},${bottom}`,
            `0,${bottom}`
        ].join(" ");
    }

    function rebuildShape(){
        if(!container){return;}

        container.innerHTML = "";

        if(
            shapeType === "circle"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "ellipse"
                );

            element.setAttribute(
                "cx",
                width / 2
            );

            element.setAttribute(
                "cy",
                height / 2
            );

            element.setAttribute(
                "rx",
                width / 2
            );

            element.setAttribute(
                "ry",
                height / 2
            );
        }
        else if(
            shapeType === "ellipse"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "ellipse"
                );

            element.setAttribute(
                "cx",
                width / 2
            );

            element.setAttribute(
                "cy",
                height / 2
            );

            element.setAttribute(
                "rx",
                width / 2
            );

            element.setAttribute(
                "ry",
                height / 2
            );
        }
        else if(
            shapeType === "square" ||
            shapeType === "rectangle"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "rect"
                );

            element.setAttribute(
                "x",
                0
            );

            element.setAttribute(
                "y",
                0
            );

            element.setAttribute(
                "width",
                width
            );

            element.setAttribute(
                "height",
                height
            );
        }
        else if(
            shapeType === "triangle"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "polygon"
                );

            element.setAttribute(
                "points",
                `0,${height} ${width / 2},0 ${width},${height}`
            );
        }
        else if(
            shapeType === "polygon"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "polygon"
                );

            element.setAttribute(
                "points",
                createPolygonPoints(
                    polygonSides
                )
            );
        }
        else if(
            shapeType === "star"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "polygon"
                );

            element.setAttribute(
                "points",
                createStarPoints(
                    starPoints
                )
            );
        }
        else if(
            shapeType === "line"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );

            element.setAttribute(
                "x1",
                0
            );

            element.setAttribute(
                "y1",
                height / 2
            );

            element.setAttribute(
                "x2",
                width
            );

            element.setAttribute(
                "y2",
                height / 2
            );
        }
        else if(
            shapeType === "arrow"
        ){
            element =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "polygon"
                );

            element.setAttribute(
                "points",
                createArrowPoints()
            );
        }

        element.id =
            `${id}_shape`;

        applyClass();

        container.appendChild(
            element
        );
    }

    applyShapeType(
        shapeType
    );

    return {
        __orinWindowElement: true,
        __orinWindowType: "shape",

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

            if(
                shapeType ===
                "square"
            ){
                height =
                    value;
            }

            applySize();
            rebuildShape();

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

            if(
                shapeType ===
                "square"
            ){
                width =
                    value;
            }

            applySize();
            rebuildShape();

            return this;
        },

        setType(value){
            if(typeof value !== "string"){
                throw new Error(
                    "shape type must be a string"
                );
            }

            applyShapeType(
                value
            );

            rebuildShape();

            return this;
        },

        getType(){
            if(
                shapeType === "polygon"
            ){
                return `polygon(${polygonSides})`;
            }

            if(
                shapeType === "star"
            ){
                return `star(${starPoints})`;
            }

            return shapeType;
        },

        rotate(value){
            if(typeof value !== "number"){
                throw new Error(
                    "rotation must be a number"
                );
            }

            rotation =
                value;

            applyRotation();

            return this;
        },

        rotateDegrees(value){
            if(typeof value !== "number"){
                throw new Error(
                    "rotation must be a number"
                );
            }

            rotation =
                value *
                Math.PI /
                180;

            applyRotation();

            return this;
        },

        setSides(value){
            if(
                shapeType !==
                "polygon"
            ){
                throw new Error(
                    "setSides can only be used with polygons"
                );
            }

            if(
                !Number.isSafeInteger(value) ||
                value < 3 ||
                value > 100
            ){
                throw new Error(
                    "polygon sides must be between 3 and 100"
                );
            }

            polygonSides =
                value;

            rebuildShape();

            return this;
        },

        getSides(){
            if(
                shapeType !==
                "polygon"
            ){
                throw new Error(
                    "getSides can only be used with polygons"
                );
            }

            return polygonSides;
        },

        setPoints(value){
            if(
                shapeType !==
                "star"
            ){
                throw new Error(
                    "setPoints can only be used with stars"
                );
            }

            if(
                !Number.isSafeInteger(value) ||
                value < 3 ||
                value > 100
            ){
                throw new Error(
                    "star points must be between 3 and 100"
                );
            }

            starPoints =
                value;

            rebuildShape();

            return this;
        },

        getPoints(){
            if(
                shapeType !==
                "star"
            ){
                throw new Error(
                    "getPoints can only be used with stars"
                );
            }

            return starPoints;
        },

        setHeadSize(value){
            if(
                shapeType !==
                "arrow"
            ){
                throw new Error(
                    "setHeadSize can only be used with arrows"
                );
            }

            if(
                typeof value !== "number" ||
                value <= 0
            ){
                throw new Error(
                    "head size must be a positive number"
                );
            }

            headSize =
                value;

            rebuildShape();

            return this;
        },

        __setId(value){
            id =
                value;

            if(container){
                container.id =
                    id;
            }

            if(element){
                element.id =
                    `${id}_shape`;
            }
        },

        __mount(document){
            if(container){return;}

            container =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                );

            container.id =
                id;

            container.style.overflow =
                "visible";

            applyPosition();
            applySize();
            applyRotation();

            rebuildShape();

            document.body.appendChild(
                container
            );
        },

        __unmount(){
            if(!container){return;}

            container.remove();

            container = null;
            element = null;
        },

        __getElement(){
            return element;
        },

        __forgetElement(){
            container = null;
            element = null;
        }
    };
}

export function create(value = "rectangle"){
    return createShapeObject(
        value
    );
}