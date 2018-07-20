const WINSCORE = 2048;
const FIELDSIZE = 5;
const CELLSIZE = 100;
var gameField = CreateMatrix(FIELDSIZE, FIELDSIZE);
var flying = [];
var notflying = [];
var keyboard;
var SCORE = 0;
var EmptyX;
var EmptyY;
var moves = [];
var canvas = document.getElementById("matrix");
var context = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;

function show(state) {
    document.getElementById('window').style.display = state;
    document.getElementById('wrap').style.display = state;
}
function showWindowEnd(dis){
    document.getElementById('GameOverWindow').style.display = dis;
    document.getElementById('wrap2').style.display = dis;
}
function showWindowWin(win){
    document.getElementById('YouWinWindow').style.display = win;
    document.getElementById('wrap3').style.display = win;
}
function delay(){document.location.reload();}


function RandomDegree() {
    return Math.floor(Math.random() * 2) + 1;
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function DrawNumber(number, posY, posX) {
    context.fillStyle = "#FAFAD2";
    context.textAlign = 'center';
    context.strokeText(number, (posX + 1) * CELLSIZE - CELLSIZE / 2, (posY + 1) * CELLSIZE - CELLSIZE / 2);
}

function DrawBackground() {
    context.fillStyle = "#FAFAD2";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = CELLSIZE; x < 5 * CELLSIZE; x += CELLSIZE) {
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
    for (let i = 0; i < notflying.length; i++) {
        if (gameField[notflying[i][1]][notflying[i][2]] !== 0) {
          //  context.fillStyle = "blue";
            context.fillRect(notflying[i][2] * CELLSIZE + 1, notflying[i][1] * CELLSIZE + 1, CELLSIZE - 2, CELLSIZE - 2);
        }
        DrawNumber(notflying[i][0], notflying[i][1], notflying[i][2]);
    }
}

function IsEmpty(Y, X) {
    return (gameField[Y][X] === 0);
}

function ShowMatrix(rows) {
    for (let i = 0; i < rows; i++) {
        console.log(gameField[i]);
    }
    console.log('');
}

function CheckEmptyCells() {
    let flag = false;
    for (let i = 0; i < FIELDSIZE; i++) {
        for (let j = 0; j < FIELDSIZE; j++) {
            if (IsEmpty(i, j)) {
                EmptyX = j;
                EmptyY = i;
                flag = true;
            }
        }
    }
    return flag;
}

function Filing(Y, X) {
    gameField[Y][X] = Math.pow(2, RandomDegree());
    DrawNumber(gameField[Y][X], Y, X);
    notflying.push([gameField[Y][X], Y, X])
}

function AddNewCell() {
    EndGame();
    var X = Random(0, FIELDSIZE - 1);
    var Y = Random(0, FIELDSIZE - 1);
    console.log(X, Y);
    if (IsEmpty(Y, X)) {
        Filing(Y, X);
    } else {
        EndGame();
        Filing(EmptyY, EmptyX);
    }
}

function EndGame(){
    if (!CheckEmptyCells()) {
        for(let i = 0; i<FIELDSIZE; i++)
            for(let j = 0; j<FIELDSIZE; j++){
            }
    }
}

function AddFirstCell() {
    AddNewCell();
    AddNewCell();
}

function Move(direction) {
    notflying.splice(0, notflying.length);
    let dx = 0, dy = 0;
    const delta = 0.1;
    switch (direction) {
        case "left":
            for (var i = 0; i < FIELDSIZE; i++) {
                for (var j = 0; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    if (j - Curr < 0) {
                        notflying.push([gameField[i][j], i, j]);
                        continue;
                    }
                    while (j - Curr > 0 && gameField[i][j - Curr] === 0) {
                        Curr++;
                    }
                    if (gameField[i][j - Curr] === 0 || gameField[i][j - Curr] === gameField[i][j]) {
                        gameField[i][j - Curr] += gameField[i][j];
                        moves.push([i, j, i, j - Curr]);
                        flying.push(gameField[i][j]);
                        SCORE += gameField[i][j - Curr];//check
                    } else {
                        if (Curr === 1) {
                            notflying.push([gameField[i][j], i, j]);
                            continue;
                        }
                        gameField[i][j - Curr + 1] += gameField[i][j];
                        moves.push([i, j, i, j - Curr + 1]);
                        flying.push(gameField[i][j]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dx = -delta;
            break;
        case "up":
            for (var i = 0; i < FIELDSIZE; i++) {
                for (var j = 0; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    if (i - Curr < 0) {
                        notflying.push([gameField[i][j], i, j]);
                        continue;
                    }
                    while (i - Curr > 0 && gameField[i - Curr][j] === 0) {
                        Curr++;
                    }
                    if (gameField[i - Curr][j] === 0 || gameField[i - Curr][j] === gameField[i][j]) {
                        gameField[i - Curr][j] += gameField[i][j];
                        moves.push([i, j, i - Curr, j]);
                        flying.push(gameField[i][j]);
                        SCORE += gameField[i - Curr][j];
                    } else {
                        if (Curr === 1) {
                            notflying.push([gameField[i][j], i, j]);
                            continue;
                        }
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
            for (var i = 0; i < FIELDSIZE; i++) {
                for (var j = FIELDSIZE - 1; j >= 0; j--) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    if (j + Curr > FIELDSIZE - 1) {
                        notflying.push([gameField[i][j], i, j]);
                        continue;
                    }
                    while (j + Curr < FIELDSIZE - 1 && gameField[i][j + Curr] === 0) {
                        Curr++;
                    }
                    if (gameField[i][j + Curr] === 0 || gameField[i][j + Curr] === gameField[i][j]) {
                        gameField[i][j + Curr] += gameField[i][j];
                        moves.push([i, j, i, j + Curr]);
                        flying.push(gameField[i][j]);
                        SCORE += gameField[i][j + Curr];
                    } else {
                        if (Curr === 1) {
                            notflying.push([gameField[i][j], i, j]);
                            continue;
                        }
                        gameField[i][j + Curr - 1] += gameField[i][j];
                        moves.push([i, j, i, j + Curr - 1]);
                        flying.push(gameField[i][j]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dx = delta;
            break;
        case "down":
            for (var i = FIELDSIZE - 1; i >= 0; i--) {
                for (var j = 0; j < FIELDSIZE; j++) {
                    if (gameField[i][j] === 0) continue;
                    let Curr = 1;
                    if (i + Curr > FIELDSIZE - 1) {
                        notflying.push([gameField[i][j], i, j]);
                        continue;
                    }
                    while (i + Curr < FIELDSIZE - 1 && gameField[i + Curr][j] === 0) {
                        Curr++;
                    }
                    if (gameField[i + Curr][j] === 0 || gameField[i + Curr][j] === gameField[i][j]) {
                        gameField[i + Curr][j] += gameField[i][j];
                        moves.push([i, j, i + Curr, j]);
                        flying.push(gameField[i][j]);
                        SCORE += gameField[i + Curr][j];
                    } else {
                        if (Curr === 1) {
                            notflying.push([gameField[i][j], i, j]);
                            continue;
                        }
                        gameField[i + Curr - 1][j] += gameField[i][j];
                        moves.push([i, j, i + Curr - 1, j]);
                        flying.push(gameField[i][j]);
                    }
                    gameField[i][j] = 0;
                }
            }
            dy = delta;
            break;
    }
    let timer = setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        DrawBackground(); // нарисуем все ячейки которые не двигались
        if (moves.length === 0) {
            clearInterval(timer);
            DrawBackground();
            AddNewCell();
        }
        for (let j = 0; j < moves.length; j++) {
            let x1 = moves[j][0], y1 = moves[j][1], x2 = moves[j][2], y2 = moves[j][3];
            if (Math.abs(x1 - x2) < delta && Math.abs(y1 - y2) < delta){
                notflying.push([gameField[x2][y2], x2, y2])
                moves.splice(j, 1);
                flying.splice(j, 1);
                continue;
            }
            DrawNumber(flying[j], x1, y1);
            moves[j][0] += dy;
            moves[j][1] += dx;
        }
    }, 5);
    ShowMatrix(FIELDSIZE);
}

function CreateMatrix(rows, columns) {
    gameField = new Array();
    for (let i = 0; i < rows; i++) {
        gameField[i] = new Array();
        for (let j = 0; j < columns; j++) {
            gameField[i][j] = 0;
        }
    }
    return gameField;
}

function Direction(key) {
    var direction;
    switch (key.keyCode) {
        case 37:  // если нажата клавиша влево
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
        default:
            direction = 'none';
            break;
    }
    if(direction === 'none' || moves.length != 0) return;
    return Move(direction);
}

function init() {
    DrawBackground();
    AddFirstCell();
    addEventListener("keydown", Direction);
}

init();

