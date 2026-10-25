function createFunction(
    name,
    syntax,
    description
){
    return {
        name: name,
        syntax: syntax,
        description: description
    };
}

function createCommonNodeFunctions(
    name
){
    return [
        createFunction(
            "setClass",
            `<${name}>.setClass(className)`,
            `Sets the CSS class of the ${name}.`
        ),
        createFunction(
            "setX",
            `<${name}>.setX(x)`,
            `Sets the horizontal position of the ${name}.`
        ),
        createFunction(
            "setY",
            `<${name}>.setY(y)`,
            `Sets the vertical position of the ${name}.`
        )
    ];
}

function createCommonLayoutFunctions(
    name
){
    return [
        createFunction(
            "setClass",
            `<${name}>.setClass(className)`,
            `Sets the CSS class of the ${name}.`
        ),
        createFunction(
            "setX",
            `<${name}>.setX(x)`,
            `Sets the horizontal position of the ${name}.`
        ),
        createFunction(
            "setY",
            `<${name}>.setY(y)`,
            `Sets the vertical position of the ${name}.`
        ),
        createFunction(
            "setWidth",
            `<${name}>.setWidth(width)`,
            `Sets the width of the ${name}.`
        ),
        createFunction(
            "setHeight",
            `<${name}>.setHeight(height)`,
            `Sets the height of the ${name}.`
        )
    ];
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

    if(!guide){
        return;
    }

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

    if(!guide){
        return;
    }

    guide.hidden =
        true;
}

function selectWindowGuideCategory(
    category
){
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

    for(
        const button
        of buttons
    ){
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

    if(!selector){
        return;
    }

    selector.innerHTML =
        "";

    const files =
        Object.keys(
            windowGuideData[
                category
            ]
        );

    for(
        const file
        of files
    ){
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

        if(
            !windowGuideData[
                category
            ][
                selectedWindowGuideFile
            ]
        ){
            selectedWindowGuideFile =
                files[0];
        }
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

    if(!selector){
        return;
    }

    showWindowGuideFile(
        selector.value
    );
}

function showWindowGuideFile(
    file
){
    const categoryData =
        windowGuideData[
            selectedWindowGuideCategory
        ];

    if(
        !categoryData ||
        !categoryData[
            file
        ]
    ){
        return;
    }

    selectedWindowGuideFile =
        file;

    const data =
        categoryData[
            file
        ];

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

    if(!target){
        return;
    }

    target.innerHTML =
        "";

    for(
        const command
        of functions
    ){
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

function renderWindowGuideCSS(
    css
){
    const target =
        document.getElementById(
            "windowGuideCSS"
        );

    if(!target){
        return;
    }

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


// ========================================
// GUIDE DATA
// Add new window guides below this point.
// ========================================

const windowGuideData = {

    page: {

        page: {
            functions: [
                createFunction(
                    "setStyle",
                    "<page>.setStyle(path)",
                    "Loads a CSS file from the Orin project and applies it to the window."
                ),
                createFunction(
                    "removeStyle",
                    "<page>.removeStyle()",
                    "Removes the CSS file currently applied to the window."
                ),
                createFunction(
                    "add",
                    "<page>.add(element)",
                    "Adds a window node or layout to the page."
                ),
                createFunction(
                    "addAll",
                    "<page>.addAll(element1, element2, ...)",
                    "Adds multiple window elements to the page."
                ),
                createFunction(
                    "remove",
                    "<page>.remove(element)",
                    "Removes a window element from the page."
                ),
                createFunction(
                    "removeAll",
                    "<page>.removeAll(element1, element2, ...)",
                    "Removes multiple window elements from the page."
                ),
                createFunction(
                    "clear",
                    "<page>.clear()",
                    "Removes every window element from the page."
                ),
                createFunction(
                    "show",
                    "<page>.show()",
                    "Opens and displays the window."
                ),
                createFunction(
                    "close",
                    "<page>.close()",
                    "Closes the window."
                )
            ],

            css: {
                description:
                    "The page is the root of the generated window. CSS loaded using setStyle() applies to the body and every node or layout inside it.",

                structure:
`page
└── document body
    ├── nodes
    └── layouts`,

                selectors:
`body {
    background-color: #181818;
    color: white;

    font-family: Arial, sans-serif;
    font-size: 16px;

    margin: 0;
    padding: 20px;

    overflow: auto;
}

#elementName {
    color: red;
}

.className {
    background-color: #333333;
}`,

                example:
`body {
    background-color: #161616;
    color: #f2f2f2;

    font-family: Arial, sans-serif;

    margin: 0;
    padding: 30px;
}

.title {
    color: lightblue;

    font-size: 32px;
    font-weight: bold;
}

.panel {
    background-color: #242424;

    border: 2px solid #555555;
    border-radius: 12px;

    padding: 20px;
}`
            }
        }

    },


    layout: {

        container: {
            functions: [
                ...createCommonLayoutFunctions(
                    "container"
                ),

                createFunction(
                    "add",
                    "<container>.add(element)",
                    "Adds a node or layout to the container."
                ),
                createFunction(
                    "addAll",
                    "<container>.addAll(element1, element2, ...)",
                    "Adds multiple elements to the container."
                ),
                createFunction(
                    "remove",
                    "<container>.remove(element)",
                    "Removes an element from the container."
                ),
                createFunction(
                    "removeAll",
                    "<container>.removeAll(element1, element2, ...)",
                    "Removes multiple elements from the container."
                ),
                createFunction(
                    "clear",
                    "<container>.clear()",
                    "Removes every element from the container."
                ),
                createFunction(
                    "length",
                    "<container>.length()",
                    "Returns the number of elements inside the container."
                )
            ],

            css: {
                description:
                    "A container groups nodes and layouts. Children keep their own positions relative to the container.",

                structure:
`container → div
    └── child elements`,

                selectors:
`.panel {
    background-color: #222222;
    color: white;

    border: 2px solid #555555;
    border-radius: 10px;

    padding: 20px;

    width: 400px;
    height: 250px;

    overflow: auto;
}`,

                example:
`.settingsPanel {
    background-color: darkslategray;
    color: white;

    border: 3px solid black;
    border-radius: 12px;

    padding: 20px;

    width: 350px;
    min-height: 200px;
}`
            }
        },


        row: {
            functions: [
                ...createCommonLayoutFunctions(
                    "row"
                ),

                createFunction(
                    "setGap",
                    "<row>.setGap(gap)",
                    "Sets the gap between elements in the row."
                ),
                createFunction(
                    "add",
                    "<row>.add(element)",
                    "Adds an element to the end of the row."
                ),
                createFunction(
                    "addAll",
                    "<row>.addAll(element1, element2, ...)",
                    "Adds multiple elements to the row."
                ),
                createFunction(
                    "remove",
                    "<row>.remove(element)",
                    "Removes an element from the row."
                ),
                createFunction(
                    "clear",
                    "<row>.clear()",
                    "Removes every element from the row."
                ),
                createFunction(
                    "length",
                    "<row>.length()",
                    "Returns the number of elements in the row."
                )
            ],

            css: {
                description:
                    "A row automatically places its children horizontally.",

                structure:
`row → div
    ├── child
    ├── child
    └── child`,

                selectors:
`.buttonRow {
    background-color: #222222;

    padding: 12px;

    border: 2px solid #555555;
    border-radius: 10px;

    gap: 15px;
}`,

                example:
`.navigationRow {
    background-color: navy;

    border: 2px solid white;
    border-radius: 8px;

    padding: 15px;

    gap: 20px;
}`
            }
        },


        column: {
            functions: [
                ...createCommonLayoutFunctions(
                    "column"
                ),

                createFunction(
                    "setGap",
                    "<column>.setGap(gap)",
                    "Sets the gap between elements in the column."
                ),
                createFunction(
                    "add",
                    "<column>.add(element)",
                    "Adds an element to the bottom of the column."
                ),
                createFunction(
                    "addAll",
                    "<column>.addAll(element1, element2, ...)",
                    "Adds multiple elements to the column."
                ),
                createFunction(
                    "remove",
                    "<column>.remove(element)",
                    "Removes an element from the column."
                ),
                createFunction(
                    "clear",
                    "<column>.clear()",
                    "Removes every element from the column."
                ),
                createFunction(
                    "length",
                    "<column>.length()",
                    "Returns the number of elements in the column."
                )
            ],

            css: {
                description:
                    "A column automatically places its children vertically.",

                structure:
`column → div
    ├── child
    ├── child
    └── child`,

                selectors:
`.formColumn {
    background-color: #eeeeee;
    color: black;

    padding: 20px;

    border-radius: 10px;

    gap: 12px;
}`,

                example:
`.menuColumn {
    background-color: darkgreen;
    color: white;

    border: 2px solid black;
    border-radius: 12px;

    padding: 15px;

    gap: 10px;
}`
            }
        },


        grid: {
            functions: [
                ...createCommonLayoutFunctions(
                    "grid"
                ),

                createFunction(
                    "setColumns",
                    "<grid>.setColumns(columns)",
                    "Sets the number of columns in the grid."
                ),
                createFunction(
                    "getColumns",
                    "<grid>.getColumns()",
                    "Returns the number of columns in the grid."
                ),
                createFunction(
                    "setRows",
                    "<grid>.setRows(rows)",
                    "Sets the number of rows in the grid."
                ),
                createFunction(
                    "getRows",
                    "<grid>.getRows()",
                    "Returns the number of rows in the grid."
                ),
                createFunction(
                    "setColumnGap",
                    "<grid>.setColumnGap(gap)",
                    "Sets the horizontal gap between grid columns."
                ),
                createFunction(
                    "setRowGap",
                    "<grid>.setRowGap(gap)",
                    "Sets the vertical gap between grid rows."
                ),
                createFunction(
                    "setGap",
                    "<grid>.setGap(gap)",
                    "Sets both the column and row gap."
                ),
                createFunction(
                    "set",
                    "<grid>.set(node, x, y)",
                    "Places a window node or layout in the selected zero-based cell."
                ),
                createFunction(
                    "get",
                    "<grid>.get(x, y)",
                    "Returns the window element stored in the selected cell."
                ),
                createFunction(
                    "remove",
                    "<grid>.remove(x, y)",
                    "Removes the element stored in the selected cell."
                ),
                createFunction(
                    "clear",
                    "<grid>.clear(x, y)",
                    "Clears the selected grid cell."
                ),
                createFunction(
                    "clearAll",
                    "<grid>.clearAll()",
                    "Removes every element from the grid."
                ),
                createFunction(
                    "length",
                    "<grid>.length()",
                    "Returns the number of occupied grid cells."
                )
            ],

            css: {
                description:
                    "A grid places nodes and layouts into zero-based x and y cells. Each occupied cell has its own internal div.",

                structure:
`grid → div
    ├── cell div
    │   └── window element
    ├── cell div
    │   └── window element
    └── cell div
        └── window element`,

                selectors:
`.mainGrid {
    background-color: #222222;

    padding: 20px;

    border: 2px solid #555555;
    border-radius: 10px;

    column-gap: 20px;
    row-gap: 10px;
}

.mainGrid > div {
    background-color: #333333;

    padding: 10px;

    border: 1px solid #666666;
    border-radius: 6px;
}

.mainGrid button {
    background-color: darkblue;
    color: white;
}

.mainGrid textarea {
    width: 100%;
    height: 100px;
}`,

                example:
`.dashboardGrid {
    background-color: #181818;

    padding: 20px;

    border: 2px solid #444444;
    border-radius: 12px;

    column-gap: 25px;
    row-gap: 15px;
}

.dashboardGrid > div {
    background-color: #282828;

    padding: 12px;

    border-radius: 8px;
}`
            }
        }

    },


    node: {

        text: {
            functions: [
                ...createCommonNodeFunctions(
                    "text"
                ),

                createFunction(
                    "setText",
                    "<text>.setText(text)",
                    "Changes the text displayed by the node."
                )
            ],

            css: {
                description:
                    "Text nodes are normal div elements.",

                structure:
`text → div`,

                selectors:
`.message {
    color: white;
    background-color: #333333;

    font-size: 18px;
    font-family: Arial, sans-serif;
    font-weight: bold;

    text-align: center;

    padding: 10px;

    border: 2px solid #777777;
    border-radius: 8px;
}`,

                example:
`.title {
    color: lightblue;

    font-size: 32px;
    font-weight: bold;

    text-align: center;

    text-shadow: 2px 2px 4px black;
}`
            }
        },


        button: {
            functions: [
                ...createCommonNodeFunctions(
                    "button"
                ),

                createFunction(
                    "setText",
                    "<button>.setText(text)",
                    "Changes the text displayed on the button."
                ),
                createFunction(
                    "onClick",
                    "<button>.onClick(action)",
                    "Sets the Orin action that runs when the button is clicked."
                )
            ],

            css: {
                description:
                    "Buttons use a normal HTML button element.",

                structure:
`button → button`,

                selectors:
`.mainButton {
    background-color: darkgreen;
    color: white;

    font-size: 16px;
    font-weight: bold;

    padding: 10px 20px;

    border: 2px solid black;
    border-radius: 10px;

    cursor: pointer;
}

.mainButton:hover {
    background-color: green;
}

.mainButton:active {
    transform: scale(0.96);
}

.mainButton:disabled {
    background-color: gray;
    cursor: not-allowed;
}`,

                example:
`.dangerButton {
    background-color: darkred;
    color: white;

    border: 2px solid red;
    border-radius: 8px;

    padding: 12px 24px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}`
            }
        },


        input: {
            functions: [
                ...createCommonNodeFunctions(
                    "input"
                ),

                createFunction(
                    "setValue",
                    "<input>.setValue(value)",
                    "Sets the current text value."
                ),
                createFunction(
                    "getValue",
                    "<input>.getValue()",
                    "Returns the current text value."
                ),
                createFunction(
                    "setPlaceholder",
                    "<input>.setPlaceholder(text)",
                    "Sets the placeholder text."
                ),
                createFunction(
                    "setDisabled",
                    "<input>.setDisabled(disabled)",
                    "Enables or disables the input."
                ),
                createFunction(
                    "onInput",
                    "<input>.onInput(action)",
                    "Runs an Orin action whenever the value changes while typing."
                ),
                createFunction(
                    "onChange",
                    "<input>.onChange(action)",
                    "Runs an Orin action when the value is committed."
                )
            ],

            css: {
                description:
                    "Input nodes use input[type=\"text\"].",

                structure:
`input → input[type="text"]`,

                selectors:
`.textInput {
    background-color: #222222;
    color: white;

    font-size: 16px;

    padding: 10px;

    border: 2px solid #555555;
    border-radius: 8px;

    outline: none;
}

.textInput::placeholder {
    color: #999999;
}

.textInput:focus {
    border-color: lightblue;
}

.textInput:disabled {
    background-color: #444444;
    color: #888888;
}`,

                example:
`.loginInput {
    width: 250px;

    background-color: #111111;
    color: lightgreen;

    border: 2px solid darkgreen;
    border-radius: 6px;

    padding: 12px;
}`
            }
        },


        textarea: {
            functions: [
                ...createCommonNodeFunctions(
                    "textarea"
                ),

                createFunction(
                    "setValue",
                    "<textarea>.setValue(value)",
                    "Sets the contents of the textarea."
                ),
                createFunction(
                    "getValue",
                    "<textarea>.getValue()",
                    "Returns the current contents of the textarea."
                ),
                createFunction(
                    "setPlaceholder",
                    "<textarea>.setPlaceholder(text)",
                    "Sets placeholder text."
                ),
                createFunction(
                    "setDisabled",
                    "<textarea>.setDisabled(disabled)",
                    "Enables or disables the textarea."
                ),
                createFunction(
                    "onInput",
                    "<textarea>.onInput(action)",
                    "Runs an action whenever the contents change."
                ),
                createFunction(
                    "onChange",
                    "<textarea>.onChange(action)",
                    "Runs an action when the value is committed."
                )
            ],

            css: {
                description:
                    "Textarea nodes are standard textarea elements.",

                structure:
`textarea → textarea`,

                selectors:
`.editorBox {
    width: 400px;
    height: 200px;

    background-color: #202020;
    color: white;

    font-family: monospace;
    font-size: 15px;

    padding: 12px;

    border: 2px solid #555555;
    border-radius: 8px;

    resize: both;
    outline: none;
}

.editorBox:focus {
    border-color: dodgerblue;
}`,

                example:
`.notes {
    background-color: lightyellow;
    color: black;

    width: 350px;
    height: 180px;

    padding: 15px;

    border: 2px solid goldenrod;

    resize: vertical;
}`
            }
        },


        radiobutton: {
            functions: [
                ...createCommonNodeFunctions(
                    "radiobutton"
                ),

                createFunction(
                    "setText",
                    "<radiobutton>.setText(text)",
                    "Changes the text displayed beside the radio button."
                ),
                createFunction(
                    "setValue",
                    "<radiobutton>.setValue(value)",
                    "Sets whether the radio button is selected."
                ),
                createFunction(
                    "getValue",
                    "<radiobutton>.getValue()",
                    "Returns whether the radio button is selected."
                ),
                createFunction(
                    "setGroup",
                    "<radiobutton>.setGroup(group)",
                    "Sets the radio-button group."
                ),
                createFunction(
                    "setDisabled",
                    "<radiobutton>.setDisabled(disabled)",
                    "Enables or disables the radio button."
                ),
                createFunction(
                    "onChange",
                    "<radiobutton>.onChange(action)",
                    "Runs an Orin action when the selection changes."
                )
            ],

            css: {
                description:
                    "A radio button is a label containing a radio input and a span.",

                structure:
`radiobutton → label
    ├── input[type="radio"]
    └── span`,

                selectors:
`.radioOption {
    color: white;

    display: flex;
    align-items: center;

    gap: 8px;

    cursor: pointer;
}

.radioOption input[type="radio"] {
    width: 18px;
    height: 18px;

    accent-color: limegreen;
}`,

                example:
`.choice {
    color: navy;

    font-weight: bold;

    display: flex;

    gap: 10px;
}

.choice input[type="radio"] {
    accent-color: darkblue;
}`
            }
        },


        checkbox: {
            functions: [
                ...createCommonNodeFunctions(
                    "checkbox"
                ),

                createFunction(
                    "setText",
                    "<checkbox>.setText(text)",
                    "Changes the text displayed beside the checkbox."
                ),
                createFunction(
                    "setValue",
                    "<checkbox>.setValue(value)",
                    "Sets whether the checkbox is checked."
                ),
                createFunction(
                    "getValue",
                    "<checkbox>.getValue()",
                    "Returns whether the checkbox is checked."
                ),
                createFunction(
                    "setDisabled",
                    "<checkbox>.setDisabled(disabled)",
                    "Enables or disables the checkbox."
                ),
                createFunction(
                    "onChange",
                    "<checkbox>.onChange(action)",
                    "Runs an Orin action when the checked value changes."
                )
            ],

            css: {
                description:
                    "Checkboxes are labels containing a checkbox input and a span.",

                structure:
`checkbox → label
    ├── input[type="checkbox"]
    └── span`,

                selectors:
`.checkOption {
    color: white;

    display: flex;
    align-items: center;

    gap: 8px;

    cursor: pointer;
}

.checkOption input[type="checkbox"] {
    width: 18px;
    height: 18px;

    accent-color: deepskyblue;
}`,

                example:
`.terms {
    color: black;

    font-size: 14px;

    display: flex;

    gap: 8px;
}

.terms input[type="checkbox"] {
    accent-color: darkgreen;
}`
            }
        },


        dropdown: {
            functions: [
                ...createCommonNodeFunctions(
                    "dropdown"
                ),

                createFunction(
                    "addOptions",
                    "<dropdown>.addOptions(value1, value2, ...)",
                    "Adds options to the dropdown."
                ),
                createFunction(
                    "setOptions",
                    "<dropdown>.setOptions(value1, value2, ...)",
                    "Replaces the dropdown options."
                ),
                createFunction(
                    "removeOptions",
                    "<dropdown>.removeOptions(value1, value2, ...)",
                    "Removes options from the dropdown."
                ),
                createFunction(
                    "clearOptions",
                    "<dropdown>.clearOptions()",
                    "Removes every option."
                ),
                createFunction(
                    "setValue",
                    "<dropdown>.setValue(value)",
                    "Sets the selected value."
                ),
                createFunction(
                    "getValue",
                    "<dropdown>.getValue()",
                    "Returns the selected value."
                ),
                createFunction(
                    "setDisabled",
                    "<dropdown>.setDisabled(disabled)",
                    "Enables or disables the dropdown."
                ),
                createFunction(
                    "onChange",
                    "<dropdown>.onChange(action)",
                    "Runs an Orin action when the selected option changes."
                )
            ],

            css: {
                description:
                    "Dropdowns use a select element containing option elements.",

                structure:
`dropdown → select
    ├── option
    ├── option
    └── option`,

                selectors:
`.menu {
    background-color: #222222;
    color: white;

    font-size: 16px;

    padding: 10px;

    border: 2px solid #555555;
    border-radius: 8px;

    cursor: pointer;
}

.menu option {
    background-color: #222222;
    color: white;
}

.menu:focus {
    border-color: lightblue;
    outline: none;
}`,

                example:
`.countrySelect {
    background-color: navy;
    color: white;

    padding: 8px 12px;

    border: 2px solid lightblue;
    border-radius: 6px;
}`
            }
        },


        list: {
            functions: [
                ...createCommonNodeFunctions(
                    "list"
                ),

                createFunction(
                    "setOrdered",
                    "<list>.setOrdered(ordered)",
                    "Switches between an ordered and unordered list."
                ),
                createFunction(
                    "add",
                    "<list>.add(value)",
                    "Adds a new list item."
                ),
                createFunction(
                    "setItems",
                    "<list>.setItems(value1, value2, ...)",
                    "Replaces all list items."
                ),
                createFunction(
                    "set",
                    "<list>.set(index, value)",
                    "Changes a list item."
                ),
                createFunction(
                    "remove",
                    "<list>.remove(index)",
                    "Removes a list item."
                ),
                createFunction(
                    "getValue",
                    "<list>.getValue(index)",
                    "Returns a list item's value."
                ),
                createFunction(
                    "length",
                    "<list>.length()",
                    "Returns the number of list items."
                ),
                createFunction(
                    "clear",
                    "<list>.clear()",
                    "Removes every list item."
                )
            ],

            css: {
                description:
                    "Lists use either ul or ol elements with li children.",

                structure:
`list → ul or ol
    ├── li
    ├── li
    └── li`,

                selectors:
`.itemList {
    background-color: #222222;
    color: white;

    padding: 20px 20px 20px 40px;

    border-radius: 10px;
}

.itemList li {
    color: lightgray;

    padding: 5px;

    margin-bottom: 4px;
}`,

                example:
`.tasks {
    color: darkblue;
    background-color: lightblue;

    padding: 20px 40px;

    border: 2px solid navy;
    border-radius: 8px;
}`
            }
        },


        image: {
            functions: [
                ...createCommonNodeFunctions(
                    "image"
                ),

                createFunction(
                    "setWidth",
                    "<image>.setWidth(width)",
                    "Sets the width of the image."
                ),
                createFunction(
                    "setHeight",
                    "<image>.setHeight(height)",
                    "Sets the height of the image."
                ),
                createFunction(
                    "setSource",
                    "<image>.setSource(path)",
                    "Sets the project image displayed by the node."
                ),
                createFunction(
                    "setAlt",
                    "<image>.setAlt(text)",
                    "Sets the image alternative text."
                )
            ],

            css: {
                description:
                    "Image nodes are normal img elements.",

                structure:
`image → img`,

                selectors:
`.photo {
    width: 300px;
    height: 200px;

    object-fit: cover;

    border: 3px solid white;
    border-radius: 12px;

    opacity: 1;

    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}`,

                example:
`.avatar {
    width: 120px;
    height: 120px;

    object-fit: cover;

    border-radius: 50%;

    border: 4px solid dodgerblue;
}`
            }
        },


        shape: {
            functions: [
                ...createCommonNodeFunctions(
                    "shape"
                ),

                createFunction(
                    "setWidth",
                    "<shape>.setWidth(width)",
                    "Sets the width of the shape."
                ),
                createFunction(
                    "setHeight",
                    "<shape>.setHeight(height)",
                    "Sets the height of the shape."
                ),
                createFunction(
                    "setType",
                    "<shape>.setType(type)",
                    "Changes the current shape type."
                ),
                createFunction(
                    "getType",
                    "<shape>.getType()",
                    "Returns the current shape type."
                ),
                createFunction(
                    "rotate",
                    "<shape>.rotate(angle)",
                    "Rotates the shape using radians."
                ),
                createFunction(
                    "rotateDegrees",
                    "<shape>.rotateDegrees(angle)",
                    "Rotates the shape using degrees."
                ),
                createFunction(
                    "setSides",
                    "<shape>.setSides(sides)",
                    "Changes the number of polygon sides."
                ),
                createFunction(
                    "getSides",
                    "<shape>.getSides()",
                    "Returns the polygon side count."
                ),
                createFunction(
                    "setPoints",
                    "<shape>.setPoints(points)",
                    "Changes the number of star points."
                ),
                createFunction(
                    "getPoints",
                    "<shape>.getPoints()",
                    "Returns the star point count."
                ),
                createFunction(
                    "setHeadSize",
                    "<shape>.setHeadSize(size)",
                    "Changes the arrow head size."
                )
            ],

            css: {
                description:
                    "Shapes use SVG internally. fill controls the inside colour and stroke controls the outline.",

                structure:
`shape → svg
    └── circle / ellipse / rect / polygon / line`,

                selectors:
`.shape {
    fill: red;

    stroke: black;
    stroke-width: 3px;

    opacity: 1;
}

.shape:hover {
    fill: orange;
    stroke: darkred;
}`,

                example:
`.warningShape {
    fill: orange;

    stroke: darkred;
    stroke-width: 5px;

    opacity: 0.9;

    filter: drop-shadow(3px 3px 5px black);
}`
            }
        },


        spreadsheet: {
            functions: [
                ...createCommonNodeFunctions(
                    "spreadsheet"
                ),

                createFunction(
                    "setSize",
                    "<spreadsheet>.setSize(width, height)",
                    "Sets the number of columns and rows."
                ),
                createFunction(
                    "setValue",
                    "<spreadsheet>.setValue(x, y, value)",
                    "Sets the contents of a text cell."
                ),
                createFunction(
                    "getValue",
                    "<spreadsheet>.getValue(x, y)",
                    "Returns the contents of a text cell."
                ),
                createFunction(
                    "clearValue",
                    "<spreadsheet>.clearValue(x, y)",
                    "Clears the contents of a text cell."
                ),
                createFunction(
                    "setNode",
                    "<spreadsheet>.setNode(x, y, node)",
                    "Changes a cell to node mode and places an optional node inside it."
                ),
                createFunction(
                    "setText",
                    "<spreadsheet>.setText(x, y)",
                    "Changes a cell back to editable text mode."
                ),
                createFunction(
                    "setRowNode",
                    "<spreadsheet>.setRowNode(y)",
                    "Changes an entire row to node mode."
                ),
                createFunction(
                    "setRowText",
                    "<spreadsheet>.setRowText(y)",
                    "Changes an entire row to text mode."
                ),
                createFunction(
                    "setColumnNode",
                    "<spreadsheet>.setColumnNode(x)",
                    "Changes an entire column to node mode."
                ),
                createFunction(
                    "setColumnText",
                    "<spreadsheet>.setColumnText(x)",
                    "Changes an entire column to text mode."
                ),
                createFunction(
                    "getType",
                    "<spreadsheet>.getType(x, y)",
                    "Returns either text or node for the selected cell."
                ),
                createFunction(
                    "getNode",
                    "<spreadsheet>.getNode(x, y)",
                    "Returns the node stored in a node cell."
                ),
                createFunction(
                    "setEditable",
                    "<spreadsheet>.setEditable(editable)",
                    "Enables or disables editing of text cells."
                ),
                createFunction(
                    "getWidth",
                    "<spreadsheet>.getWidth()",
                    "Returns the number of columns."
                ),
                createFunction(
                    "getHeight",
                    "<spreadsheet>.getHeight()",
                    "Returns the number of rows."
                ),
                createFunction(
                    "clear",
                    "<spreadsheet>.clear()",
                    "Clears the spreadsheet and resets cells to text mode."
                ),
                createFunction(
                    "onChange",
                    "<spreadsheet>.onChange(action)",
                    "Runs an Orin action when an editable cell changes."
                )
            ],

            css: {
                description:
                    "The spreadsheet uses a normal HTML table.",

                structure:
`spreadsheet → table
    └── tr
        └── td
            ├── input[type="text"]
            └── optional window node`,

                selectors:
`.sheet {
    border-collapse: collapse;

    background-color: white;
    color: black;

    border: 3px solid black;
}

.sheet td {
    border: 1px solid #555555;

    padding: 5px;

    min-width: 100px;
    height: 35px;
}

.sheet input[type="text"] {
    width: 100%;
    height: 100%;

    box-sizing: border-box;

    background-color: lightgreen;
    color: black;

    border: none;
    outline: none;
}`,

                example:
`.sheet {
    background-color: #202020;
    color: white;
}

.sheet td {
    background-color: #292929;

    border: 2px solid #555555;

    padding: 8px;
}

.sheet button {
    background-color: darkorange;
}`
            }
        },


        slider: {
            functions: [
                ...createCommonNodeFunctions(
                    "slider"
                ),

                createFunction(
                    "setWidth",
                    "<slider>.setWidth(width)",
                    "Sets the width of the slider."
                ),
                createFunction(
                    "setHeight",
                    "<slider>.setHeight(height)",
                    "Sets the height of the slider."
                ),
                createFunction(
                    "setMin",
                    "<slider>.setMin(minimum)",
                    "Sets the minimum slider value."
                ),
                createFunction(
                    "setMax",
                    "<slider>.setMax(maximum)",
                    "Sets the maximum slider value."
                ),
                createFunction(
                    "setStep",
                    "<slider>.setStep(step)",
                    "Sets how much the value changes by for each slider step."
                ),
                createFunction(
                    "setValue",
                    "<slider>.setValue(value)",
                    "Sets the current slider value."
                ),
                createFunction(
                    "getValue",
                    "<slider>.getValue()",
                    "Returns the current numeric slider value."
                ),
                createFunction(
                    "setDisabled",
                    "<slider>.setDisabled(disabled)",
                    "Enables or disables the slider."
                ),
                createFunction(
                    "onInput",
                    "<slider>.onInput(action)",
                    "Runs an Orin action continuously while the slider is moved."
                ),
                createFunction(
                    "onChange",
                    "<slider>.onChange(action)",
                    "Runs an Orin action when the slider value is committed."
                )
            ],

            css: {
                description:
                    "A slider uses input[type=\"range\"].",

                structure:
`slider → input[type="range"]`,

                selectors:
`.volumeSlider {
    width: 300px;

    accent-color: dodgerblue;

    cursor: pointer;
}

.volumeSlider:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.volumeSlider::-webkit-slider-runnable-track {
    height: 8px;

    background-color: #444444;

    border-radius: 5px;
}

.volumeSlider::-webkit-slider-thumb {
    cursor: pointer;
}

.volumeSlider::-moz-range-track {
    height: 8px;

    background-color: #444444;

    border-radius: 5px;
}`,

                example:
`.temperatureSlider {
    width: 350px;

    accent-color: orangered;

    cursor: pointer;
}

.temperatureSlider:hover {
    accent-color: red;
}`
            }
        },


        progressbar: {
            functions: [
                ...createCommonNodeFunctions(
                    "progressbar"
                ),

                createFunction(
                    "setWidth",
                    "<progressbar>.setWidth(width)",
                    "Sets the width of the progress bar."
                ),
                createFunction(
                    "setHeight",
                    "<progressbar>.setHeight(height)",
                    "Sets the height of the progress bar."
                ),
                createFunction(
                    "setMax",
                    "<progressbar>.setMax(maximum)",
                    "Sets the maximum progress value."
                ),
                createFunction(
                    "getMax",
                    "<progressbar>.getMax()",
                    "Returns the maximum progress value."
                ),
                createFunction(
                    "setValue",
                    "<progressbar>.setValue(value)",
                    "Sets the current progress value."
                ),
                createFunction(
                    "getValue",
                    "<progressbar>.getValue()",
                    "Returns the current progress value."
                )
            ],

            css: {
                description:
                    "A progress bar uses the HTML progress element.",

                structure:
`progressbar → progress
    ├── progress track
    └── progress value`,

                selectors:
`.loadingBar {
    width: 300px;
    height: 25px;

    accent-color: limegreen;
}

.loadingBar::-webkit-progress-bar {
    background-color: #333333;

    border-radius: 10px;
}

.loadingBar::-webkit-progress-value {
    background-color: limegreen;

    border-radius: 10px;
}

.loadingBar::-moz-progress-bar {
    background-color: limegreen;

    border-radius: 10px;
}`,

                example:
`.downloadProgress {
    width: 400px;
    height: 20px;

    accent-color: dodgerblue;

    border: 2px solid #555555;
    border-radius: 8px;
}`
            }
        }

    }

};