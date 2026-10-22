import { evaluate as evaluatePolynomial } from "../polynomial/evaluate.js";
import { evaluate as evaluateExpression } from "../expression/evaluate.js";
import { println } from "../terminal/output.js";

function isPolynomial(func){
    return typeof func === "object" &&
        func !== null &&
        Array.isArray(func.coeffs) &&
        Array.isArray(func.exponents) &&
        func.coeffs.length === func.exponents.length;
}

function isExpression(func){
    return typeof func === "object" &&
        func !== null &&
        func.__orinExpression === true &&
        typeof func.root === "object" &&
        func.root !== null;
}

function validateFunction(func){
    if(isPolynomial(func)){return;}
    if(isExpression(func)){return;}
    throw new Error("value must be a polynomial or expression");
}

function evaluateFunction(func, x){
    if(isPolynomial(func)){return evaluatePolynomial(func, x);}
    if(isExpression(func)){return evaluateExpression(func, x);}
    throw new Error("value must be a polynomial or expression");
}

function validateRange(xMin, xMax, yMin, yMax){
    if(typeof xMin !== "number" || !Number.isFinite(xMin)){throw new Error("xMin must be a finite number");}
    if(typeof xMax !== "number" || !Number.isFinite(xMax)){throw new Error("xMax must be a finite number");}
    if(typeof yMin !== "number" || !Number.isFinite(yMin)){throw new Error("yMin must be a finite number");}
    if(typeof yMax !== "number" || !Number.isFinite(yMax)){throw new Error("yMax must be a finite number");}

    if(xMin >= xMax){throw new Error("xMin must be less than xMax");}
    if(yMin >= yMax){throw new Error("yMin must be less than yMax");}
}

function validateSize(width, height){
    if(!Number.isSafeInteger(width) || width < 5){throw new Error("width must be an integer of at least 5");}
    if(!Number.isSafeInteger(height) || height < 5){throw new Error("height must be an integer of at least 5");}
}

function createGrid(width, height){
    let grid = [];
    for(let row = 0; row < height; row++){
        let line = [];
        for(let col = 0; col < width; col++){
            line.push(" ");
        }
        grid.push(line);
    }
    return grid;
}

function mapX(x, xMin, xMax, width){
    return Math.round(((x - xMin) / (xMax - xMin)) * (width - 1));
}

function mapY(y, yMin, yMax, height){
    return Math.round(((yMax - y) / (yMax - yMin)) * (height - 1));
}

function inBounds(row, col, width, height){
    return row >= 0 && row < height && col >= 0 && col < width;
}

function place(grid, row, col, char){
    if(!inBounds(row, col, grid[0].length, grid.length)){return;}

    let current = grid[row][col];

    if(current === " "){
        grid[row][col] = char;
        return;
    }

    if(current === "|" || current === "-" || current === "+"){
        if(char !== " "){
            if((current === "|" && char === "-") || (current === "-" && char === "|")){
                grid[row][col] = "+";
            }
            else if(char !== current){
                grid[row][col] = char;
            }
        }
        return;
    }

    if(char !== " "){
        grid[row][col] = char;
    }
}

function drawAxes(grid, xMin, xMax, yMin, yMax, width, height){
    if(yMin <= 0 && yMax >= 0){
        let row = mapY(0, yMin, yMax, height);
        for(let col = 0; col < width; col++){
            place(grid, row, col, "-");
        }
    }

    if(xMin <= 0 && xMax >= 0){
        let col = mapX(0, xMin, xMax, width);
        for(let row = 0; row < height; row++){
            place(grid, row, col, "|");
        }
    }

    if(xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0){
        place(grid, mapY(0, yMin, yMax, height), mapX(0, xMin, xMax, width), "+");
    }
}

function getLineCharacter(previousRow, currentRow){
    if(currentRow === previousRow){return "-";}
    if(currentRow < previousRow){return "/";}
    if(currentRow > previousRow){return "\\";}
    return "*";
}

function drawConnection(grid, previousRow, previousCol, currentRow, currentCol){
    if(previousCol === currentCol){
        place(grid, currentRow, currentCol, "|");
        return;
    }

    let char = getLineCharacter(previousRow, currentRow);
    let rowDifference = currentRow - previousRow;
    let colDifference = currentCol - previousCol;
    let steps = Math.max(Math.abs(rowDifference), Math.abs(colDifference));

    for(let i = 0; i <= steps; i++){
        let row = Math.round(previousRow + (rowDifference * i) / steps);
        let col = Math.round(previousCol + (colDifference * i) / steps);
        place(grid, row, col, char);
    }
}

export function getCharacters(func, xMin = -10, xMax = 10, yMin = -10, yMax = 10, width = 61, height = 25){
    validateFunction(func);
    validateRange(xMin, xMax, yMin, yMax);
    validateSize(width, height);

    let grid = createGrid(width, height);
    drawAxes(grid, xMin, xMax, yMin, yMax, width, height);

    let previousRow = null;
    let previousCol = null;
    let previousValid = false;

    for(let col = 0; col < width; col++){
        let x = xMin + (col / (width - 1)) * (xMax - xMin);
        let y = evaluateFunction(func, x);

        if(typeof y !== "number" || !Number.isFinite(y) || y < yMin || y > yMax){
            previousValid = false;
            previousRow = null;
            previousCol = null;
            continue;
        }

        let row = mapY(y, yMin, yMax, height);

        if(previousValid){
            drawConnection(grid, previousRow, previousCol, row, col);
        }
        else{
            place(grid, row, col, "*");
        }

        previousRow = row;
        previousCol = col;
        previousValid = true;
    }

    let output = [];
    for(let row of grid){
        output.push(row.join(""));
    }
    return output.join("\n");
}

export function displayCharacters(func, xMin = -10, xMax = 10, yMin = -10, yMax = 10, width = 61, height = 25){
    println(getCharacters(func, xMin, xMax, yMin, yMax, width, height));
}