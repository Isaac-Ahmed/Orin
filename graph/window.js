import { evaluate as evaluatePolynomial } from "../polynomial/evaluate.js";
import { evaluate as evaluateExpression } from "../expression/evaluate.js";

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
    if(!Number.isSafeInteger(width) || width < 300){throw new Error("width must be an integer of at least 300");}
    if(!Number.isSafeInteger(height) || height < 200){throw new Error("height must be an integer of at least 200");}
}

function mapX(x, xMin, xMax, width, padding){
    return padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2);
}

function mapY(y, yMin, yMax, height, padding){
    return padding + ((yMax - y) / (yMax - yMin)) * (height - padding * 2);
}

function drawGrid(context, xMin, xMax, yMin, yMax, width, height, padding){
    context.strokeStyle = "#333333";
    context.lineWidth = 1;

    let xStart = Math.ceil(xMin);
    let xEnd = Math.floor(xMax);

    for(let x = xStart; x <= xEnd; x++){
        let canvasX = mapX(x, xMin, xMax, width, padding);
        context.beginPath();
        context.moveTo(canvasX, padding);
        context.lineTo(canvasX, height - padding);
        context.stroke();
    }

    let yStart = Math.ceil(yMin);
    let yEnd = Math.floor(yMax);

    for(let y = yStart; y <= yEnd; y++){
        let canvasY = mapY(y, yMin, yMax, height, padding);
        context.beginPath();
        context.moveTo(padding, canvasY);
        context.lineTo(width - padding, canvasY);
        context.stroke();
    }
}

function drawAxes(context, xMin, xMax, yMin, yMax, width, height, padding){
    context.strokeStyle = "#cccccc";
    context.lineWidth = 2;

    if(yMin <= 0 && yMax >= 0){
        let y = mapY(0, yMin, yMax, height, padding);
        context.beginPath();
        context.moveTo(padding, y);
        context.lineTo(width - padding, y);
        context.stroke();
    }

    if(xMin <= 0 && xMax >= 0){
        let x = mapX(0, xMin, xMax, width, padding);
        context.beginPath();
        context.moveTo(x, padding);
        context.lineTo(x, height - padding);
        context.stroke();
    }
}

function drawLabels(context, xMin, xMax, yMin, yMax, width, height, padding){
    context.fillStyle = "#cccccc";
    context.font = "12px Consolas";
    context.textAlign = "center";

    let xStart = Math.ceil(xMin);
    let xEnd = Math.floor(xMax);

    for(let x = xStart; x <= xEnd; x++){
        if(x === 0){continue;}

        let canvasX = mapX(x, xMin, xMax, width, padding);
        let axisY = yMin <= 0 && yMax >= 0 ? mapY(0, yMin, yMax, height, padding) : height - padding;
        context.fillText(String(x), canvasX, Math.min(axisY + 16, height - 8));
    }

    context.textAlign = "right";

    let yStart = Math.ceil(yMin);
    let yEnd = Math.floor(yMax);

    for(let y = yStart; y <= yEnd; y++){
        if(y === 0){continue;}

        let canvasY = mapY(y, yMin, yMax, height, padding);
        let axisX = xMin <= 0 && xMax >= 0 ? mapX(0, xMin, xMax, width, padding) : padding;
        context.fillText(String(y), Math.max(axisX - 7, 25), canvasY + 4);
    }
}

function drawFunction(context, func, xMin, xMax, yMin, yMax, width, height, padding){
    context.strokeStyle = "#4FC1FF";
    context.lineWidth = 2;
    context.beginPath();

    let drawing = false;
    let plotWidth = width - padding * 2;

    for(let pixel = 0; pixel <= plotWidth; pixel++){
        let x = xMin + (pixel / plotWidth) * (xMax - xMin);
        let y = evaluateFunction(func, x);

        if(typeof y !== "number" || !Number.isFinite(y) || y < yMin || y > yMax){
            drawing = false;
            continue;
        }

        let canvasX = mapX(x, xMin, xMax, width, padding);
        let canvasY = mapY(y, yMin, yMax, height, padding);

        if(!drawing){
            context.moveTo(canvasX, canvasY);
            drawing = true;
        }
        else{
            context.lineTo(canvasX, canvasY);
        }
    }

    context.stroke();
}

export function display(func, xMin = -10, xMax = 10, yMin = -10, yMax = 10, width = 800, height = 600){
    validateFunction(func);
    validateRange(xMin, xMax, yMin, yMax);
    validateSize(width, height);

    let graphWindow = window.open("", "_blank", `width=${width},height=${height}`);
    if(!graphWindow){throw new Error("graph window was blocked by the browser");}

    graphWindow.document.title = "Orin Graph";
    graphWindow.document.body.style.margin = "0";
    graphWindow.document.body.style.background = "#1e1e1e";
    graphWindow.document.body.style.display = "flex";
    graphWindow.document.body.style.alignItems = "center";
    graphWindow.document.body.style.justifyContent = "center";

    let canvas = graphWindow.document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    graphWindow.document.body.appendChild(canvas);

    let context = canvas.getContext("2d");
    if(!context){throw new Error("unable to create graph canvas");}

    context.fillStyle = "#1e1e1e";
    context.fillRect(0, 0, width, height);

    let padding = 40;

    drawGrid(context, xMin, xMax, yMin, yMax, width, height, padding);
    drawAxes(context, xMin, xMax, yMin, yMax, width, height, padding);
    drawLabels(context, xMin, xMax, yMin, yMax, width, height, padding);
    drawFunction(context, func, xMin, xMax, yMin, yMax, width, height, padding);

    return true;
}