const WINSCORE = 2048;
const FIELDSIZE = 5;
const CELLSIZE = 100;
//Can't move
var gameField = CreateMatrix(FIELDSIZE,FIELDSIZE);
var flying = [];
var keyboard;
var SCORE = 0;
var EmptyX;
var EmptyY;
var canvas = document.getElementById("matrix");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

function RandomDegree() {
    return Math.floor(Math.random()*2) + 1;
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function DrawBackground() {
    context.fillStyle = "#FAFAD2";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = CELLSIZE; x < 5*CELLSIZE; x += CELLSIZE) {
        context.moveTo(x, 0);
        context.lineTo(x, 800);
    }
    for (let y = 100; y < 500; y += 100) {
        context.moveTo(0, y);
        context.lineTo(500, y);
    }
    context.strokeStyle = "#808080";
    context.stroke();
    context.strokeStyle = "#F00";
    context.font = "30px AR DELANEY";
}

function DrawNumber(number, posY, posX) {
    //context.fillStyle = "#FAFAD2";
    //context.fillRect(posX * CELLSIZE + 1, posY * CELLSIZE + 1, CELLSIZE - 2, CELLSIZE - 2);
    context.textAlign = 'center';
    context.strokeText(number, (posX + 1) * CELLSIZE - CELLSIZE/2, (posY + 1) * CELLSIZE - CELLSIZE/2);
}

function IsEmpty(Y, X) {
    return(gameField[Y][X] === 0);
}

function ShowMatrix(rows){
    for(let i=0; i<rows; i++){
        console.log(gameField[i]);
    }
    console.log('');
}

function CheckEmptyCells() {
    let flag = false;
    for (let i = 0; i < FIELDSIZE; i++) {
        for (let j = 0; j < FIELDSIZE; j++){
            if(IsEmpty(i, j)){
                EmptyX = j;
                EmptyY = i;
                flag = true;
            }
        }
    }
    return flag;
}

function AddNewCell() {
    EndGame();
    var X = Random(0, FIELDSIZE-1);
    var Y = Random(0, FIELDSIZE-1);
    console.log(X, Y);
    if(IsEmpty(Y, X)) {
        gameField[Y][X] = Math.pow(2, RandomDegree());
        DrawNumber(gameField[Y][X], Y, X);
    }else{
        EndGame();
        gameField[EmptyY][EmptyX] = Math.pow(2, RandomDegree());
        DrawNumber(gameField[EmptyY][EmptyX], EmptyY, EmptyX);
    }
}

function EndGame() {
    if(!CheckEmptyCells()){
        //  матрица поля
    }
}

function AddFirstCell() {
    AddNewCell();
    AddNewCell();
}

function CreateMatrix(rows, columns){
    gameField = new Array();
    for(let i=0; i<rows; i++){
        gameField[i] = new Array();
        for(let j=0; j< columns; j++){
            gameField[i][j] = 0;
        }
    }
    return gameField;
}

function Move(direction){
    let moves = [];
    let dx = 0, dy = 0;
    const delta = 0.1;
    switch(direction){
        case "left":
            for(var i=0; i < FIELDSIZE; i++) {
                for (var j = 1; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    while (j - Curr > 0 && gameField[i][j - Curr] === 0) {
                        Curr++;
                    }
                    if (gameField[i][j - Curr] === 0 || gameField[i][j - Curr] === gameField[i][j]) {
                        gameField[i][j - Curr] += gameField[i][j];
                        moves.push([i, j, i, j - Curr]);
                        SCORE += gameField[i][j - Curr];//check
                    } else {
                        if (Curr === 1) continue;
                        gameField[i][j - Curr + 1] += gameField[i][j];
                        moves.push([i, j, i, j - Curr + 1]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dx = -delta;
            break;
        case "up":
            for(var i=1; i<FIELDSIZE; i++) {
                for (var j = 0; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    while (i - Curr > 0 && gameField[i - Curr][j] === 0) {
                        Curr++;
                    }
                    if (gameField[i - Curr][j] === 0 || gameField[i- Curr][j] === gameField[i][j]) {
                        gameField[i - Curr][j] += gameField[i][j];
                        moves.push([i, j, i - Curr, j]);
                        flying.push([gameField[i][j]]);
                        SCORE += gameField[i- Curr][j];
                    } else {
                        if (Curr === 1) continue;
                        gameField[i - Curr + 1][j] += gameField[i][j];
                        moves.push([i, j, i - Curr + 1, j]);
                        flying.push(gameField[i][j]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dy = -delta;
            break;
        case "right":
            for(var i=0; i<FIELDSIZE; i++) {
                for (var j = FIELDSIZE-2; j >= 0; j--) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    while (j + Curr < FIELDSIZE-1 && gameField[i][j + Curr] === 0 ) {
                        Curr++;
                    }
                    if (gameField[i][j + Curr] === 0 || gameField[i][j + Curr] === gameField[i][j]) {
                        gameField[i][j + Curr] += gameField[i][j];
                        moves.push([i, j, i, j + Curr]);
                        SCORE += gameField[i][j + Curr];
                    } else {
                        if (Curr === 1) continue;
                        gameField[i][j + Curr - 1] += gameField[i][j];
                        moves.push([i, j, i, j + Curr - 1]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dx = delta;
            break;
        case "down":
            for(var i=FIELDSIZE-2; i>=0; i--) {
                for (var j = 0; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    while (i + Curr < FIELDSIZE - 1 && gameField[i + Curr][j] === 0) {
                        Curr++;
                    }
                    if (gameField[i + Curr][j] === 0 || gameField[i + Curr][j] === gameField[i][j]) {
                        gameField[i + Curr][j] += gameField[i][j];
                        moves.push([i, j, i + Curr, j]);
                        SCORE += gameField[i + Curr][j];
                    } else {
                        if (Curr === 1) continue;
                        gameField[i + Curr - 1][j] += gameField[i][j];
                        moves.push([i, j, i + Curr - 1, j]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dy = delta;
            break;
    }

    let timer = setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        DrawBackground();
        // нарисуем все ячейки которые не двигались
        if (moves.length === 0)
            clearInterval(timer);
        for (let j = 0; j < moves.length; j++){
            if (moves[j][2] === moves[j][0]) {
                moves.splice(j, 1);
                flying.splice(j, 1);
                continue;
            }
            DrawNumber(flying[j], moves[j][0], moves[j][1]);
            console.log(flying[j] + ' ' + moves[j][0] + ' ' + moves[j][1]);
            moves[j][0]+=dy;
            moves[j][1]+=dx;
        }
    }, 20);



    console.log(direction);
    AddNewCell();
    ShowMatrix(FIELDSIZE);
}

function Direction(key){
    var direction;
    switch(key.keyCode){
        case 37:  // если нажата клавиша влево
            // что-то делаем
            direction = 'left';
            break;
        case 38:   // если нажата клавиша вверх
            direction = 'up';
            break;
        case 39:   // если нажата клавиша вправо
            direction = 'right';
            break;
        case 40:   // если нажата клавиша вниз
            direction = 'down';
            break;
    }
    return Move(direction);
}

function init() {
    DrawBackground();
    AddFirstCell();
    addEventListener("keydown", Direction);
}

init();

function show(state){
    document.getElementById('window').style.display = state;
    document.getElementById('wrap').style.display = state;
}