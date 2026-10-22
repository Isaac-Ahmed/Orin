function getRuntime(){
    return window["orinWindowRuntime"] || null;
}

function createSpreadsheetObject(){
    let id = "";
    let className = "";

    let x = 0;
    let y = 0;

    let width = 1;
    let height = 1;

    let editable = true;

    let changeAction = null;

    let element = null;
    let mountedDocument = null;

    let cells = [];

    function createCellData(){
        return {
            type: "text",
            value: "",
            node: null
        };
    }

    function createCellGrid(newWidth, newHeight){
        const newCells = [];

        for(
            let row = 0;
            row < newHeight;
            row++
        ){
            const rowValues = [];

            for(
                let column = 0;
                column < newWidth;
                column++
            ){
                if(
                    cells[row] &&
                    cells[row][column]
                ){
                    rowValues.push(
                        cells[row][column]
                    );
                }
                else{
                    rowValues.push(
                        createCellData()
                    );
                }
            }

            newCells.push(
                rowValues
            );
        }

        cells = newCells;
    }

    function validateX(value){
        if(
            !Number.isSafeInteger(value) ||
            value < 0 ||
            value >= width
        ){
            throw new Error(
                "x is outside the spreadsheet"
            );
        }
    }

    function validateY(value){
        if(
            !Number.isSafeInteger(value) ||
            value < 0 ||
            value >= height
        ){
            throw new Error(
                "y is outside the spreadsheet"
            );
        }
    }

    function validatePosition(cellX, cellY){
        validateX(
            cellX
        );

        validateY(
            cellY
        );
    }

    function validateNode(node){
        if(
            !node ||
            typeof node !== "object" ||
            node.__orinWindowElement !== true
        ){
            throw new Error(
                "value must be a window element"
            );
        }
    }

    function getCellData(cellX, cellY){
        validatePosition(
            cellX,
            cellY
        );

        return cells[cellY][cellX];
    }

    function getCellElement(cellX, cellY){
        if(!element){
            return null;
        }

        return element.querySelector(
            `[data-x="${cellX}"][data-y="${cellY}"]`
        );
    }

    function getNodeElement(node){
        if(
            !node ||
            typeof node.__getElement !==
                "function"
        ){
            return null;
        }

        return node.__getElement();
    }

    function runAction(){
        if(!changeAction){
            return;
        }

        const runtime =
            getRuntime();

        if(
            !runtime ||
            typeof runtime.run !==
                "function"
        ){
            throw new Error(
                "Orin window runtime is unavailable"
            );
        }

        runtime.run(
            changeAction
        );
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

    function mountNode(
        cellElement,
        node
    ){
        if(
            !mountedDocument ||
            !node
        ){
            return;
        }

        let nodeElement =
            getNodeElement(
                node
            );

        if(!nodeElement){
            if(
                typeof node.__mount !==
                    "function"
            ){
                throw new Error(
                    "window element cannot be mounted"
                );
            }

            node.__mount(
                mountedDocument
            );

            nodeElement =
                getNodeElement(
                    node
                );
        }

        if(!nodeElement){
            throw new Error(
                "unable to mount window element"
            );
        }

        nodeElement.style.position =
            "relative";

        nodeElement.style.left =
            "0px";

        nodeElement.style.top =
            "0px";

        cellElement.appendChild(
            nodeElement
        );
    }

    function forgetNode(node){
        if(
            node &&
            typeof node.__forgetElement ===
                "function"
        ){
            node.__forgetElement();
        }
    }

    function clearNodeFromCell(cell){
        if(!cell.node){
            return;
        }

        const nodeElement =
            getNodeElement(
                cell.node
            );

        if(nodeElement){
            nodeElement.remove();
        }

        forgetNode(
            cell.node
        );

        cell.node =
            null;
    }

    function createTextInput(
        cellElement,
        cell,
        cellX,
        cellY
    ){
        const input =
            mountedDocument.createElement(
                "input"
            );

        input.type =
            "text";

        input.value =
            cell.value;

        input.disabled =
            !editable;

        input.id =
            `${id}_${cellX}_${cellY}`;

        input.addEventListener(
            "input",
            function(){
                cell.value =
                    input.value;

                runAction();
            }
        );

        cellElement.appendChild(
            input
        );
    }

    function renderCell(
        cellElement,
        cell,
        cellX,
        cellY
    ){
        cellElement.innerHTML =
            "";

        if(
            cell.type ===
            "node"
        ){
            if(cell.node){
                mountNode(
                    cellElement,
                    cell.node
                );
            }

            return;
        }

        createTextInput(
            cellElement,
            cell,
            cellX,
            cellY
        );
    }

    function rebuild(){
        if(
            !element ||
            !mountedDocument
        ){
            return;
        }

        element.innerHTML =
            "";

        for(
            let row = 0;
            row < height;
            row++
        ){
            const tableRow =
                mountedDocument.createElement(
                    "tr"
                );

            for(
                let column = 0;
                column < width;
                column++
            ){
                const tableCell =
                    mountedDocument.createElement(
                        "td"
                    );

                tableCell.dataset.x =
                    column;

                tableCell.dataset.y =
                    row;

                tableCell.id =
                    `${id}_cell_${column}_${row}`;

                renderCell(
                    tableCell,
                    cells[row][column],
                    column,
                    row
                );

                tableRow.appendChild(
                    tableCell
                );
            }

            element.appendChild(
                tableRow
            );
        }
    }

    function setCellNodeMode(
        cellX,
        cellY,
        node = null
    ){
        const cell =
            getCellData(
                cellX,
                cellY
            );

        if(
            node !== null
        ){
            validateNode(
                node
            );
        }

        if(
            cell.node &&
            cell.node !== node
        ){
            clearNodeFromCell(
                cell
            );
        }

        cell.type =
            "node";

        cell.node =
            node;

        const cellElement =
            getCellElement(
                cellX,
                cellY
            );

        if(cellElement){
            renderCell(
                cellElement,
                cell,
                cellX,
                cellY
            );
        }
    }

    function setCellTextMode(
        cellX,
        cellY
    ){
        const cell =
            getCellData(
                cellX,
                cellY
            );

        clearNodeFromCell(
            cell
        );

        cell.type =
            "text";

        const cellElement =
            getCellElement(
                cellX,
                cellY
            );

        if(cellElement){
            renderCell(
                cellElement,
                cell,
                cellX,
                cellY
            );
        }
    }

    createCellGrid(
        width,
        height
    );

    return {
        __orinWindowElement: true,
        __orinWindowType: "spreadsheet",

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

        setSize(
            newWidth,
            newHeight
        ){
            if(
                !Number.isSafeInteger(
                    newWidth
                ) ||
                newWidth <= 0
            ){
                throw new Error(
                    "width must be a positive integer"
                );
            }

            if(
                !Number.isSafeInteger(
                    newHeight
                ) ||
                newHeight <= 0
            ){
                throw new Error(
                    "height must be a positive integer"
                );
            }

            for(
                let row = 0;
                row < height;
                row++
            ){
                for(
                    let column = 0;
                    column < width;
                    column++
                ){
                    if(
                        row >= newHeight ||
                        column >= newWidth
                    ){
                        const cell =
                            cells[row][column];

                        clearNodeFromCell(
                            cell
                        );
                    }
                }
            }

            width =
                newWidth;

            height =
                newHeight;

            createCellGrid(
                width,
                height
            );

            rebuild();

            return this;
        },

        setValue(
            cellX,
            cellY,
            value
        ){
            if(typeof value !== "string"){
                throw new Error(
                    "spreadsheet value must be a string"
                );
            }

            const cell =
                getCellData(
                    cellX,
                    cellY
                );

            if(
                cell.type !==
                "text"
            ){
                throw new Error(
                    "cell is not a text cell"
                );
            }

            cell.value =
                value;

            const cellElement =
                getCellElement(
                    cellX,
                    cellY
                );

            if(cellElement){
                const input =
                    cellElement.querySelector(
                        "input"
                    );

                if(input){
                    input.value =
                        value;
                }
            }

            return this;
        },

        getValue(
            cellX,
            cellY
        ){
            const cell =
                getCellData(
                    cellX,
                    cellY
                );

            if(
                cell.type !==
                "text"
            ){
                throw new Error(
                    "cell is not a text cell"
                );
            }

            const cellElement =
                getCellElement(
                    cellX,
                    cellY
                );

            if(cellElement){
                const input =
                    cellElement.querySelector(
                        "input"
                    );

                if(input){
                    cell.value =
                        input.value;
                }
            }

            return cell.value;
        },

        clearValue(
            cellX,
            cellY
        ){
            const cell =
                getCellData(
                    cellX,
                    cellY
                );

            if(
                cell.type !==
                "text"
            ){
                throw new Error(
                    "cell is not a text cell"
                );
            }

            cell.value =
                "";

            const cellElement =
                getCellElement(
                    cellX,
                    cellY
                );

            if(cellElement){
                const input =
                    cellElement.querySelector(
                        "input"
                    );

                if(input){
                    input.value =
                        "";
                }
            }

            return this;
        },

        setNode(...values){
            if(
                values.length === 0
            ){
                for(
                    let row = 0;
                    row < height;
                    row++
                ){
                    for(
                        let column = 0;
                        column < width;
                        column++
                    ){
                        setCellNodeMode(
                            column,
                            row
                        );
                    }
                }

                return this;
            }

            if(
                values.length === 2
            ){
                setCellNodeMode(
                    values[0],
                    values[1]
                );

                return this;
            }

            if(
                values.length === 3
            ){
                setCellNodeMode(
                    values[0],
                    values[1],
                    values[2]
                );

                return this;
            }

            throw new Error(
                "setNode requires zero, two or three values"
            );
        },

        setText(...values){
            if(
                values.length === 0
            ){
                for(
                    let row = 0;
                    row < height;
                    row++
                ){
                    for(
                        let column = 0;
                        column < width;
                        column++
                    ){
                        setCellTextMode(
                            column,
                            row
                        );
                    }
                }

                return this;
            }

            if(
                values.length === 2
            ){
                setCellTextMode(
                    values[0],
                    values[1]
                );

                return this;
            }

            throw new Error(
                "setText requires zero or two values"
            );
        },

        setRowNode(row){
            validateY(
                row
            );

            for(
                let column = 0;
                column < width;
                column++
            ){
                setCellNodeMode(
                    column,
                    row
                );
            }

            return this;
        },

        setRowText(row){
            validateY(
                row
            );

            for(
                let column = 0;
                column < width;
                column++
            ){
                setCellTextMode(
                    column,
                    row
                );
            }

            return this;
        },

        setColumnNode(column){
            validateX(
                column
            );

            for(
                let row = 0;
                row < height;
                row++
            ){
                setCellNodeMode(
                    column,
                    row
                );
            }

            return this;
        },

        setColumnText(column){
            validateX(
                column
            );

            for(
                let row = 0;
                row < height;
                row++
            ){
                setCellTextMode(
                    column,
                    row
                );
            }

            return this;
        },

        getType(
            cellX,
            cellY
        ){
            const cell =
                getCellData(
                    cellX,
                    cellY
                );

            return cell.type;
        },

        getNode(
            cellX,
            cellY
        ){
            const cell =
                getCellData(
                    cellX,
                    cellY
                );

            if(
                cell.type !==
                "node"
            ){
                return null;
            }

            return cell.node;
        },

        setEditable(value){
            if(typeof value !== "boolean"){
                throw new Error(
                    "editable must be a boolean"
                );
            }

            editable =
                value;

            rebuild();

            return this;
        },

        clear(){
            for(
                let row = 0;
                row < height;
                row++
            ){
                for(
                    let column = 0;
                    column < width;
                    column++
                ){
                    const cell =
                        cells[row][column];

                    clearNodeFromCell(
                        cell
                    );

                    cell.type =
                        "text";

                    cell.value =
                        "";
                }
            }

            rebuild();

            return this;
        },

        getWidth(){
            return width;
        },

        getHeight(){
            return height;
        },

        onChange(action){
            if(typeof action !== "string"){
                throw new Error(
                    "change action must be a string"
                );
            }

            changeAction =
                action;

            return this;
        },

        __setId(value){
            id =
                value;

            if(element){
                element.id =
                    id;
            }
        },

        __getElement(){
            return element;
        },

        __mount(document){
            if(element){return;}

            mountedDocument =
                document;

            element =
                document.createElement(
                    "table"
                );

            element.id =
                id;

            applyClass();
            applyPosition();

            document.body.appendChild(
                element
            );

            rebuild();
        },

        __unmount(){
            if(!element){return;}

            for(
                let row = 0;
                row < height;
                row++
            ){
                for(
                    let column = 0;
                    column < width;
                    column++
                ){
                    const cell =
                        cells[row][column];

                    if(cell.node){
                        forgetNode(
                            cell.node
                        );
                    }
                }
            }

            element.remove();

            element = null;
            mountedDocument = null;
        },

        __forgetElement(){
            for(
                let row = 0;
                row < height;
                row++
            ){
                for(
                    let column = 0;
                    column < width;
                    column++
                ){
                    const cell =
                        cells[row][column];

                    if(cell.node){
                        forgetNode(
                            cell.node
                        );
                    }
                }
            }

            element = null;
            mountedDocument = null;
        }
    };
}

export function create(){
    return createSpreadsheetObject();
}