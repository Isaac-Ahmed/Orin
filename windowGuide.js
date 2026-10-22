const windowGuideData = {
    page: {
        page: {
            functions: [
                {
                    name: "setStyle",
                    syntax: "<page>.setStyle(path)",
                    description:
                        "Loads a CSS file from the Orin project and applies it to the window."
                },
                {
                    name: "removeStyle",
                    syntax: "<page>.removeStyle()",
                    description:
                        "Removes the CSS file currently applied to the window."
                },
                {
                    name: "add",
                    syntax: "<page>.add(element)",
                    description:
                        "Adds a window node or layout to the page."
                },
                {
                    name: "addAll",
                    syntax: "<page>.addAll(element1, element2, ...)",
                    description:
                        "Adds multiple window elements to the page."
                },
                {
                    name: "remove",
                    syntax: "<page>.remove(element)",
                    description:
                        "Removes a window element from the page."
                },
                {
                    name: "removeAll",
                    syntax: "<page>.removeAll(element1, element2, ...)",
                    description:
                        "Removes multiple window elements from the page."
                },
                {
                    name: "clear",
                    syntax: "<page>.clear()",
                    description:
                        "Removes every window element from the page."
                },
                {
                    name: "show",
                    syntax: "<page>.show()",
                    description:
                        "Opens and displays the window."
                },
                {
                    name: "close",
                    syntax: "<page>.close()",
                    description:
                        "Closes the window."
                }
            ],

            css: {
                description:
                    "The page is the root of the generated window. CSS loaded using setStyle() applies to nodes and layouts inside it.",

                structure:
`page
└── document body
    ├── nodes
    └── layouts`,

                selectors:
`body {
    background: #202020;
}

#elementName {
    color: white;
}

.className {
    background: #333333;
}`,

                example:
`body {
    background: #181818;
    color: white;
    font-family: Arial, sans-serif;
}`
            }
        }
    },

    layout: {
        container: {
            functions: [
                {
                    name: "setClass",
                    syntax: "<container>.setClass(className)",
                    description:
                        "Sets the CSS class of the container."
                },
                {
                    name: "setX",
                    syntax: "<container>.setX(x)",
                    description:
                        "Sets the horizontal position of the container."
                },
                {
                    name: "setY",
                    syntax: "<container>.setY(y)",
                    description:
                        "Sets the vertical position of the container."
                },
                {
                    name: "setWidth",
                    syntax: "<container>.setWidth(width)",
                    description:
                        "Sets the width of the container."
                },
                {
                    name: "setHeight",
                    syntax: "<container>.setHeight(height)",
                    description:
                        "Sets the height of the container."
                },
                {
                    name: "add",
                    syntax: "<container>.add(element)",
                    description:
                        "Adds a node or layout to the container."
                },
                {
                    name: "addAll",
                    syntax: "<container>.addAll(element1, element2, ...)",
                    description:
                        "Adds multiple elements to the container."
                },
                {
                    name: "remove",
                    syntax: "<container>.remove(element)",
                    description:
                        "Removes an element from the container."
                },
                {
                    name: "removeAll",
                    syntax: "<container>.removeAll(element1, element2, ...)",
                    description:
                        "Removes multiple elements from the container."
                },
                {
                    name: "clear",
                    syntax: "<container>.clear()",
                    description:
                        "Removes every element from the container."
                },
                {
                    name: "length",
                    syntax: "<container>.length()",
                    description:
                        "Returns the number of elements inside the container."
                }
            ],

            css: {
                description:
                    "A container is represented by a div. Its children retain their own positions relative to the container.",

                structure:
`container → div
children  → elements inside the div`,

                selectors:
`.panel {
    background: #222222;
    border: 2px solid #555555;
    border-radius: 10px;
    padding: 20px;
}`,

                example:
`.panel {
    background: darkslategray;
    border: 3px solid black;
    border-radius: 12px;
}`
            }
        },

        row: {
            functions: [
                {
                    name: "setClass",
                    syntax: "<row>.setClass(className)",
                    description:
                        "Sets the CSS class of the row."
                },
                {
                    name: "setX",
                    syntax: "<row>.setX(x)",
                    description:
                        "Sets the horizontal position of the row."
                },
                {
                    name: "setY",
                    syntax: "<row>.setY(y)",
                    description:
                        "Sets the vertical position of the row."
                },
                {
                    name: "setWidth",
                    syntax: "<row>.setWidth(width)",
                    description:
                        "Sets the width of the row."
                },
                {
                    name: "setHeight",
                    syntax: "<row>.setHeight(height)",
                    description:
                        "Sets the height of the row."
                },
                {
                    name: "setGap",
                    syntax: "<row>.setGap(gap)",
                    description:
                        "Sets the gap between elements in the row."
                },
                {
                    name: "add",
                    syntax: "<row>.add(element)",
                    description:
                        "Adds an element to the end of the row."
                },
                {
                    name: "addAll",
                    syntax: "<row>.addAll(element1, element2, ...)",
                    description:
                        "Adds multiple elements to the row."
                },
                {
                    name: "remove",
                    syntax: "<row>.remove(element)",
                    description:
                        "Removes an element from the row."
                },
                {
                    name: "clear",
                    syntax: "<row>.clear()",
                    description:
                        "Removes every element from the row."
                },
                {
                    name: "length",
                    syntax: "<row>.length()",
                    description:
                        "Returns the number of elements in the row."
                }
            ],

            css: {
                description:
                    "A row is a flex container that automatically places its children horizontally.",

                structure:
`row → div
    ├── child
    ├── child
    └── child`,

                selectors:
`.buttonRow {
    background: #dddddd;
    padding: 10px;
    border-radius: 8px;
}`,

                example:
`.buttonRow {
    background: navy;
    padding: 12px;
    border: 2px solid white;
}`
            }
        },

        column: {
            functions: [
                {
                    name: "setClass",
                    syntax: "<column>.setClass(className)",
                    description:
                        "Sets the CSS class of the column."
                },
                {
                    name: "setX",
                    syntax: "<column>.setX(x)",
                    description:
                        "Sets the horizontal position of the column."
                },
                {
                    name: "setY",
                    syntax: "<column>.setY(y)",
                    description:
                        "Sets the vertical position of the column."
                },
                {
                    name: "setWidth",
                    syntax: "<column>.setWidth(width)",
                    description:
                        "Sets the width of the column."
                },
                {
                    name: "setHeight",
                    syntax: "<column>.setHeight(height)",
                    description:
                        "Sets the height of the column."
                },
                {
                    name: "setGap",
                    syntax: "<column>.setGap(gap)",
                    description:
                        "Sets the gap between elements in the column."
                },
                {
                    name: "add",
                    syntax: "<column>.add(element)",
                    description:
                        "Adds an element to the bottom of the column."
                },
                {
                    name: "addAll",
                    syntax: "<column>.addAll(element1, element2, ...)",
                    description:
                        "Adds multiple elements to the column."
                },
                {
                    name: "remove",
                    syntax: "<column>.remove(element)",
                    description:
                        "Removes an element from the column."
                },
                {
                    name: "clear",
                    syntax: "<column>.clear()",
                    description:
                        "Removes every element from the column."
                },
                {
                    name: "length",
                    syntax: "<column>.length()",
                    description:
                        "Returns the number of elements in the column."
                }
            ],

            css: {
                description:
                    "A column is a flex container that automatically places its children vertically.",

                structure:
`column → div
    ├── child
    ├── child
    └── child`,

                selectors:
`.formColumn {
    background: #eeeeee;
    padding: 20px;
}`,

                example:
`.formColumn {
    background: darkgreen;
    border: 2px solid black;
    padding: 15px;
}`
            }
        }
    },

    node: {
        text: createBasicNodeGuide(
            "text",
            "div",
            "Displays text inside a window."
        ),

        button: createBasicNodeGuide(
            "button",
            "button",
            "Creates a clickable button."
        ),

        input: createBasicNodeGuide(
            "input",
            "input[type=\"text\"]",
            "Creates a single-line text input."
        ),

        textarea: createBasicNodeGuide(
            "textarea",
            "textarea",
            "Creates a multi-line text input."
        ),

        radiobutton: createBasicNodeGuide(
            "radiobutton",
            "label containing input[type=\"radio\"] and span",
            "Creates a radio-button option."
        ),

        checkbox: createBasicNodeGuide(
            "checkbox",
            "label containing input[type=\"checkbox\"] and span",
            "Creates an independent true or false checkbox."
        ),

        dropdown: createBasicNodeGuide(
            "dropdown",
            "select containing option elements",
            "Creates a dropdown selection box."
        ),

        list: createBasicNodeGuide(
            "list",
            "ul or ol containing li elements",
            "Creates an ordered or unordered list."
        ),

        image: createBasicNodeGuide(
            "image",
            "img",
            "Displays an uploaded project image."
        ),

        shape: createShapeGuide(),

        spreadsheet: createSpreadsheetGuide()
    }
};

function createBasicNodeGuide(
    name,
    structure,
    description
){
    return {
        functions: [
            {
                name: "setClass",
                syntax:
                    `<${name}>.setClass(className)`,
                description:
                    `Sets the CSS class of the ${name}.`
            },
            {
                name: "setX",
                syntax:
                    `<${name}>.setX(x)`,
                description:
                    `Sets the horizontal position of the ${name}.`
            },
            {
                name: "setY",
                syntax:
                    `<${name}>.setY(y)`,
                description:
                    `Sets the vertical position of the ${name}.`
            }
        ],

        css: {
            description:
                description,

            structure:
                `${name} → ${structure}`,

            selectors:
`.example {
    color: red;
    background: lightgray;
}`,

            example:
`.example {
    color: white;
    background: darkblue;
}`
        }
    };
}

function createShapeGuide(){
    return {
        functions: [
            {
                name: "setClass",
                syntax: "<shape>.setClass(className)",
                description:
                    "Sets the CSS class of the shape."
            },
            {
                name: "setX",
                syntax: "<shape>.setX(x)",
                description:
                    "Sets the horizontal position of the shape."
            },
            {
                name: "setY",
                syntax: "<shape>.setY(y)",
                description:
                    "Sets the vertical position of the shape."
            },
            {
                name: "setWidth",
                syntax: "<shape>.setWidth(width)",
                description:
                    "Sets the width of the shape."
            },
            {
                name: "setHeight",
                syntax: "<shape>.setHeight(height)",
                description:
                    "Sets the height of the shape."
            },
            {
                name: "setType",
                syntax: "<shape>.setType(type)",
                description:
                    "Changes the current shape type."
            },
            {
                name: "rotate",
                syntax: "<shape>.rotate(angle)",
                description:
                    "Rotates the shape using radians."
            },
            {
                name: "rotateDegrees",
                syntax: "<shape>.rotateDegrees(angle)",
                description:
                    "Rotates the shape using degrees."
            },
            {
                name: "setSides",
                syntax: "<shape>.setSides(sides)",
                description:
                    "Changes the number of polygon sides."
            },
            {
                name: "setPoints",
                syntax: "<shape>.setPoints(points)",
                description:
                    "Changes the number of star points."
            }
        ],

        css: {
            description:
                "Shapes use SVG internally. fill controls the inside colour and stroke controls the border.",

            structure:
`shape → svg
        └── circle / ellipse / rect / polygon / line`,

            selectors:
`.shape {
    fill: red;
    stroke: black;
    stroke-width: 3px;
}`,

            example:
`.warningShape {
    fill: orange;
    stroke: darkred;
    stroke-width: 5px;
}`
        }
    };
}

function createSpreadsheetGuide(){
    return {
        functions: [
            {
                name: "setSize",
                syntax: "<spreadsheet>.setSize(width, height)",
                description:
                    "Sets the number of columns and rows."
            },
            {
                name: "setValue",
                syntax: "<spreadsheet>.setValue(x, y, value)",
                description:
                    "Sets the contents of a text cell."
            },
            {
                name: "getValue",
                syntax: "<spreadsheet>.getValue(x, y)",
                description:
                    "Returns the contents of a text cell."
            },
            {
                name: "setNode",
                syntax: "<spreadsheet>.setNode(x, y, node)",
                description:
                    "Changes a cell to node mode and optionally places a window element inside it."
            },
            {
                name: "setText",
                syntax: "<spreadsheet>.setText(x, y)",
                description:
                    "Changes a cell back to editable text mode."
            },
            {
                name: "setRowNode",
                syntax: "<spreadsheet>.setRowNode(y)",
                description:
                    "Changes an entire row to node mode."
            },
            {
                name: "setRowText",
                syntax: "<spreadsheet>.setRowText(y)",
                description:
                    "Changes an entire row to text mode."
            },
            {
                name: "setColumnNode",
                syntax: "<spreadsheet>.setColumnNode(x)",
                description:
                    "Changes an entire column to node mode."
            },
            {
                name: "setColumnText",
                syntax: "<spreadsheet>.setColumnText(x)",
                description:
                    "Changes an entire column to text mode."
            },
            {
                name: "getType",
                syntax: "<spreadsheet>.getType(x, y)",
                description:
                    "Returns either text or node for the selected cell."
            }
        ],

        css: {
            description:
                "The spreadsheet uses a normal HTML table internally. Rows are tr elements and cells are td elements.",

            structure:
`spreadsheet → table
    └── tr
        └── td
            ├── input[type="text"]
            └── optional window node`,

            selectors:
`.sheet {
    border-collapse: collapse;
}

.sheet td {
    border: 2px solid black;
}

.sheet input[type="text"] {
    background: lightgreen;
}

.sheet button {
    background: orange;
}`,

            example:
`.sheet td {
    background: lightyellow;
    border: 3px solid darkblue;
    padding: 10px;
}

.sheet input[type="text"] {
    background: lightgreen;
    color: darkred;
}

.sheet button {
    background: orange;
}`
        }
    };
}

let selectedWindowGuideCategory =
    "page";

let selectedWindowGuideFile =
    "page";

function openWindowGuide(){
    const guide =
        document.getElementById(
            "windowGuide"
        );

    if(!guide){return;}

    guide.hidden =
        false;

    selectWindowGuideCategory(
        selectedWindowGuideCategory
    );
}

function closeWindowGuide(){
    const guide =
        document.getElementById(
            "windowGuide"
        );

    if(!guide){return;}

    guide.hidden =
        true;
}

function selectWindowGuideCategory(category){
    if(
        !windowGuideData[
            category
        ]
    ){
        return;
    }

    selectedWindowGuideCategory =
        category;

    const buttons =
        document.querySelectorAll(
            ".windowGuideCategoryButton"
        );

    for(const button of buttons){
        button.classList.remove(
            "selected"
        );
    }

    const selectedButton =
        document.querySelector(
            `[data-window-category="${category}"]`
        );

    if(selectedButton){
        selectedButton.classList.add(
            "selected"
        );
    }

    const selector =
        document.getElementById(
            "windowGuideFile"
        );

    if(!selector){return;}

    selector.innerHTML =
        "";

    const files =
        Object.keys(
            windowGuideData[
                category
            ]
        );

    for(const file of files){
        const option =
            document.createElement(
                "option"
            );

        option.value =
            file;

        option.textContent =
            file;

        selector.appendChild(
            option
        );
    }

    if(category === "page"){
        selector.disabled =
            true;

        selectedWindowGuideFile =
            "page";
    }
    else{
        selector.disabled =
            false;

        selectedWindowGuideFile =
            files[0];
    }

    selector.value =
        selectedWindowGuideFile;

    showWindowGuideFile(
        selectedWindowGuideFile
    );
}

function selectWindowGuideFile(){
    const selector =
        document.getElementById(
            "windowGuideFile"
        );

    if(!selector){return;}

    showWindowGuideFile(
        selector.value
    );
}

function showWindowGuideFile(file){
    const categoryData =
        windowGuideData[
            selectedWindowGuideCategory
        ];

    if(
        !categoryData ||
        !categoryData[file]
    ){
        return;
    }

    selectedWindowGuideFile =
        file;

    const data =
        categoryData[file];

    renderWindowGuideFunctions(
        data.functions
    );

    renderWindowGuideCSS(
        data.css
    );
}

function renderWindowGuideFunctions(
    functions
){
    const target =
        document.getElementById(
            "windowGuideFunctions"
        );

    if(!target){return;}

    target.innerHTML =
        "";

    for(const command of functions){
        const item =
            document.createElement(
                "div"
            );

        item.className =
            "windowGuideFunction";

        const name =
            document.createElement(
                "h3"
            );

        name.textContent =
            command.name;

        const syntax =
            document.createElement(
                "pre"
            );

        syntax.textContent =
            command.syntax;

        const description =
            document.createElement(
                "p"
            );

        description.textContent =
            command.description;

        item.appendChild(
            name
        );

        item.appendChild(
            syntax
        );

        item.appendChild(
            description
        );

        target.appendChild(
            item
        );
    }
}

function renderWindowGuideCSS(css){
    const target =
        document.getElementById(
            "windowGuideCSS"
        );

    if(!target){return;}

    target.innerHTML =
        "";

    const description =
        document.createElement(
            "p"
        );

    description.textContent =
        css.description;

    const structureTitle =
        document.createElement(
            "h3"
        );

    structureTitle.textContent =
        "Internal Structure";

    const structure =
        document.createElement(
            "pre"
        );

    structure.textContent =
        css.structure;

    const selectorTitle =
        document.createElement(
            "h3"
        );

    selectorTitle.textContent =
        "Useful CSS";

    const selectors =
        document.createElement(
            "pre"
        );

    selectors.textContent =
        css.selectors;

    const exampleTitle =
        document.createElement(
            "h3"
        );

    exampleTitle.textContent =
        "Example";

    const example =
        document.createElement(
            "pre"
        );

    example.textContent =
        css.example;

    target.appendChild(
        description
    );

    target.appendChild(
        structureTitle
    );

    target.appendChild(
        structure
    );

    target.appendChild(
        selectorTitle
    );

    target.appendChild(
        selectors
    );

    target.appendChild(
        exampleTitle
    );

    target.appendChild(
        example
    );
}