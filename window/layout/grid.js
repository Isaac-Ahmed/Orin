function validateElement(element){
    if(
        typeof element !== "object" ||
        element === null ||
        element.__orinWindowElement !== true
    ){
        throw new Error(
            "value must be a window element"
        );
    }
}

function validateCoordinate(value, name){
    if(
        !Number.isSafeInteger(value) ||
        value < 0
    ){
        throw new Error(
            `${name} must be a non-negative integer`
        );
    }
}

function validateSize(value, name){
    if(
        !Number.isSafeInteger(value) ||
        value < 1
    ){
        throw new Error(
            `${name} must be a positive integer`
        );
    }
}

export function create(){
    let element = null;
    let documentReference = null;

    let id = null;
    let className = "";

    let x = 0;
    let y = 0;

    let width = null;
    let height = null;

    let columns = 1;
    let rows = 1;

    let columnGap = 0;
    let rowGap = 0;

    let cells = [];

    function createCells(){
        const newCells = [];

        for(
            let row = 0;
            row < rows;
            row++
        ){
            const rowValues = [];

            for(
                let column = 0;
                column < columns;
                column++
            ){
                if(
                    cells[row] &&
                    cells[row][column] !==
                        undefined
                ){
                    rowValues.push(
                        cells[row][column]
                    );
                }
                else{
                    rowValues.push(
                        null
                    );
                }
            }

            newCells.push(
                rowValues
            );
        }

        cells = newCells;
    }

    function applyStyle(){
        if(!element){
            return;
        }

        element.className =
            className;

        element.style.position =
            "absolute";

        element.style.left =
            `${x}px`;

        element.style.top =
            `${y}px`;

        element.style.display =
            "grid";

        element.style.gridTemplateColumns =
            `repeat(${columns}, 1fr)`;

        element.style.gridTemplateRows =
            `repeat(${rows}, 1fr)`;

        element.style.columnGap =
            `${columnGap}px`;

        element.style.rowGap =
            `${rowGap}px`;

        if(width === null){
            element.style.removeProperty(
                "width"
            );
        }
        else{
            element.style.width =
                `${width}px`;
        }

        if(height === null){
            element.style.removeProperty(
                "height"
            );
        }
        else{
            element.style.height =
                `${height}px`;
        }
    }

    function unmountAll(){
        for(
            const row
            of cells
        ){
            for(
                const child
                of row
            ){
                if(
                    child &&
                    typeof child.__unmount ===
                        "function"
                ){
                    child.__unmount();
                }
            }
        }
    }

    function mountChildren(){
        if(
            !element ||
            !documentReference
        ){
            return;
        }

        element.innerHTML =
            "";

        for(
            let row = 0;
            row < rows;
            row++
        ){
            for(
                let column = 0;
                column < columns;
                column++
            ){
                const child =
                    cells[row][column];

                if(!child){
                    continue;
                }

                const cell =
                    documentReference.createElement(
                        "div"
                    );

                cell.style.gridColumn =
                    String(
                        column + 1
                    );

                cell.style.gridRow =
                    String(
                        row + 1
                    );

                cell.style.position =
                    "relative";

                element.appendChild(
                    cell
                );

                child.__mount(
                    createChildDocument(
                        documentReference,
                        cell
                    )
                );
            }
        }
    }

    function createChildDocument(
        document,
        parent
    ){
        const bodyProxy =
            new Proxy(
                document.body,
                {
                    get(target, property){
                        if(
                            property ===
                            "appendChild"
                        ){
                            return function(child){
                                return parent.appendChild(
                                    child
                                );
                            };
                        }

                        if(
                            property ===
                            "removeChild"
                        ){
                            return function(child){
                                return parent.removeChild(
                                    child
                                );
                            };
                        }

                        if(
                            property ===
                            "append"
                        ){
                            return function(...children){
                                return parent.append(
                                    ...children
                                );
                            };
                        }

                        if(
                            property ===
                            "prepend"
                        ){
                            return function(...children){
                                return parent.prepend(
                                    ...children
                                );
                            };
                        }

                        const value =
                            target[
                                property
                            ];

                        if(
                            typeof value ===
                            "function"
                        ){
                            return value.bind(
                                target
                            );
                        }

                        return value;
                    }
                }
            );

        return new Proxy(
            document,
            {
                get(target, property){
                    if(
                        property ===
                        "body"
                    ){
                        return bodyProxy;
                    }

                    if(
                        property ===
                        "appendChild"
                    ){
                        return function(child){
                            return parent.appendChild(
                                child
                            );
                        };
                    }

                    if(
                        property ===
                        "removeChild"
                    ){
                        return function(child){
                            return parent.removeChild(
                                child
                            );
                        };
                    }

                    if(
                        property ===
                        "append"
                    ){
                        return function(...children){
                            return parent.append(
                                ...children
                            );
                        };
                    }

                    if(
                        property ===
                        "prepend"
                    ){
                        return function(...children){
                            return parent.prepend(
                                ...children
                            );
                        };
                    }

                    const value =
                        target[
                            property
                        ];

                    if(
                        typeof value ===
                        "function"
                    ){
                        return value.bind(
                            target
                        );
                    }

                    return value;
                }
            }
        );
    }
    function refresh(){
        if(!element){
            return;
        }

        applyStyle();
        mountChildren();
    }

    createCells();

    return {
        __orinWindowElement: true,
        __orinWindowType: "grid",

        setClass(value){
            if(typeof value !== "string"){
                throw new Error(
                    "class must be a string"
                );
            }

            className = value;

            if(element){
                element.className =
                    className;
            }

            return this;
        },

        setX(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value)
            ){
                throw new Error(
                    "x must be a finite number"
                );
            }

            x = value;

            if(element){
                element.style.left =
                    `${x}px`;
            }

            return this;
        },

        setY(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value)
            ){
                throw new Error(
                    "y must be a finite number"
                );
            }

            y = value;

            if(element){
                element.style.top =
                    `${y}px`;
            }

            return this;
        },

        setWidth(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value) ||
                value < 0
            ){
                throw new Error(
                    "width must be a non-negative finite number"
                );
            }

            width = value;

            if(element){
                element.style.width =
                    `${width}px`;
            }

            return this;
        },

        setHeight(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value) ||
                value < 0
            ){
                throw new Error(
                    "height must be a non-negative finite number"
                );
            }

            height = value;

            if(element){
                element.style.height =
                    `${height}px`;
            }

            return this;
        },

        setColumns(value){
            validateSize(
                value,
                "columns"
            );

            if(
                value < columns
            ){
                for(
                    let row = 0;
                    row < rows;
                    row++
                ){
                    for(
                        let column = value;
                        column < columns;
                        column++
                    ){
                        const child =
                            cells[row][column];

                        if(
                            child &&
                            typeof child.__unmount ===
                                "function"
                        ){
                            child.__unmount();
                        }
                    }
                }
            }

            columns = value;

            createCells();
            refresh();

            return this;
        },

        getColumns(){
            return columns;
        },

        setRows(value){
            validateSize(
                value,
                "rows"
            );

            if(
                value < rows
            ){
                for(
                    let row = value;
                    row < rows;
                    row++
                ){
                    for(
                        let column = 0;
                        column < columns;
                        column++
                    ){
                        const child =
                            cells[row][column];

                        if(
                            child &&
                            typeof child.__unmount ===
                                "function"
                        ){
                            child.__unmount();
                        }
                    }
                }
            }

            rows = value;

            createCells();
            refresh();

            return this;
        },

        getRows(){
            return rows;
        },

        setColumnGap(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value) ||
                value < 0
            ){
                throw new Error(
                    "column gap must be a non-negative finite number"
                );
            }

            columnGap = value;

            if(element){
                element.style.columnGap =
                    `${columnGap}px`;
            }

            return this;
        },

        setRowGap(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value) ||
                value < 0
            ){
                throw new Error(
                    "row gap must be a non-negative finite number"
                );
            }

            rowGap = value;

            if(element){
                element.style.rowGap =
                    `${rowGap}px`;
            }

            return this;
        },

        setGap(value){
            if(
                typeof value !== "number" ||
                !Number.isFinite(value) ||
                value < 0
            ){
                throw new Error(
                    "gap must be a non-negative finite number"
                );
            }

            columnGap = value;
            rowGap = value;

            if(element){
                element.style.columnGap =
                    `${columnGap}px`;

                element.style.rowGap =
                    `${rowGap}px`;
            }

            return this;
        },

        set(node, x, y){
            validateElement(
                node
            );

            validateCoordinate(
                x,
                "x"
            );

            validateCoordinate(
                y,
                "y"
            );

            if(x >= columns){
                throw new Error(
                    "x is outside the grid"
                );
            }

            if(y >= rows){
                throw new Error(
                    "y is outside the grid"
                );
            }

            const previous =
                cells[y][x];

            if(
                previous &&
                previous !== node &&
                typeof previous.__unmount ===
                    "function"
            ){
                previous.__unmount();
            }

            cells[y][x] =
                node;

            refresh();

            return this;
        },

        get(x, y){
            validateCoordinate(
                x,
                "x"
            );

            validateCoordinate(
                y,
                "y"
            );

            if(x >= columns){
                throw new Error(
                    "x is outside the grid"
                );
            }

            if(y >= rows){
                throw new Error(
                    "y is outside the grid"
                );
            }

            return cells[y][x];
        },

        remove(x, y){
            validateCoordinate(
                x,
                "x"
            );

            validateCoordinate(
                y,
                "y"
            );

            if(x >= columns){
                throw new Error(
                    "x is outside the grid"
                );
            }

            if(y >= rows){
                throw new Error(
                    "y is outside the grid"
                );
            }

            const child =
                cells[y][x];

            if(
                child &&
                typeof child.__unmount ===
                    "function"
            ){
                child.__unmount();
            }

            cells[y][x] =
                null;

            refresh();

            return this;
        },

        clear(x, y){
            return this.remove(
                x,
                y
            );
        },

        clearAll(){
            unmountAll();

            for(
                let row = 0;
                row < rows;
                row++
            ){
                for(
                    let column = 0;
                    column < columns;
                    column++
                ){
                    cells[row][column] =
                        null;
                }
            }

            refresh();

            return this;
        },

        length(){
            let count = 0;

            for(
                const row
                of cells
            ){
                for(
                    const child
                    of row
                ){
                    if(child !== null){
                        count++;
                    }
                }
            }

            return count;
        },

        __setId(value){
            id = value;

            if(element){
                element.id =
                    id;
            }
        },

        __mount(document){
            documentReference =
                document;

            element =
                document.createElement(
                    "div"
                );

            if(id !== null){
                element.id =
                    id;
            }

            applyStyle();

            document.appendChild(
                element
            );

            mountChildren();
        },

        __unmount(){
            if(element){
                element.remove();
            }

            element = null;
            documentReference = null;
        },

        __forgetElement(){
            element = null;
            documentReference = null;

            for(
                const row
                of cells
            ){
                for(
                    const child
                    of row
                ){
                    if(
                        child &&
                        typeof child.__forgetElement ===
                            "function"
                    ){
                        child.__forgetElement();
                    }
                }
            }
        },

        __getElement(){
            return element;
        }
    };
}