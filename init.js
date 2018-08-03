const WINSCORE = 2048;
var FIELDSIZE = 4;
const CELLSIZE = 100;
const VICTORY = 2048;
var gameField = CreateMatrix(FIELDSIZE, FIELDSIZE);
var flying = [];
var notflying = [];
var keyboard;
var SCORE = 0;
var EmptyX;
var EmptyY;
var keyboard = false;
var moves = [];
var dir = [-1, 0, 1, 0, 0, -1, 0, 1];
var canvas = document.getElementById("matrix");
var context = canvas.getContext("2d");
canvas.width = FIELDSIZE*CELLSIZE;
canvas.height = FIELDSIZE*CELLSIZE;
var YouWin = false;

function showWindowLeaderboard(state) {
    document.getElementById('LBWindow').style.display = state;
    if (state === 'block'){
        firebase.database().ref('players/').once('value').then(function (snapshot) {
            results = (snapshot.val());
            var step = 0;
            for (let key in results) {
                document.getElementById('LB').innerHTML = '<tr>';
                step++;
                if (step === 1) continue;
                if (step > 10) break;
                let names = firebase.database().ref("players/"+key+'/name').once('value').then(function (snapshot) {
                    res = (snapshot.val());
                    document.getElementById('LB').innerHTML += '<td >' +res+':'+'</td>';
                });
                let scores = firebase.database().ref("players/"+key+'/points').once('value').then(function (snapshot) {
                    res = (snapshot.val());
                    console.log(res);
                    document.getElementById('LB').innerHTML += '<td >' +res+'</td>';
                });
                document.getElementById('LB').innerHTML += '</tr>';
            }
        });
    }
    document.getElementById('wrap5').style.display = state;
}


function getEmail() {
    var ref = firebase.database().ref("players/current");
    ref.once("value")
        .then(function(snapshot) {
            mal = snapshot.child("name").val();
            var two = firebase.database().ref("players/"+mal);
            two.once("value")
                .then(function(snapshot) {
                    score = snapshot.child("points").val();
                    if (SCORE > score){
                        Database(SCORE, mal);
                        console.log(SCORE);
                    }
                });
        });
}

function Database(score, player) {
    var data = firebase.database().ref().child('players');
    data = firebase.database().ref().child('players').child(player);
    data.set({
        'points': score,
        'name': player,
    });
    var ref = firebase.database().ref("players");
    ref.orderByChild("points");
}

function ShowScore() {
    var score = document.getElementById("scoreId");
    score.innerHTML = "Score: " + SCORE;
}

function showWindowRules(state) {
    document.getElementById('window').style.display = state;
    document.getElementById('wrap1').style.display = state;
}

function showWindowEnd(dis) {
    document.getElementById('GameOverWindow').style.display = dis;
    document.getElementById('wrap2').style.display = dis;
}

function showWindowWin(win) {
    document.getElementById('YouWinWindow').style.display = win;
    document.getElementById('wrap3').style.display = win;
}

function showWindowSign(state){
    document.getElementById('SignWindow').style.display = state;
    document.getElementById('wrap4').style.display = state;
}


function CheckWindows() {
    return(document.getElementById('YouWinWindow').style.display === 'block'  ||
        document.getElementById('SignWindow').style.display === 'block'  ||
        document.getElementById('GameOverWindow').style.display === 'block'  ||
        document.getElementById('window').style.display === 'block')
}

function delay() {
    document.location.reload();
}

function RandomDegree() {
    return Math.floor(Math.random() * 2) + 1;
}

function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function DrawNumber(number, posY, posX) {
    EndGame();
    if ((number == VICTORY) && (YouWin == false)) {
        YouWin = true;
        getEmail();
        showWindowWin('block');
    }
    context.fillStyle = "lightskyblue";
    context.textAlign = 'center';
    context.strokeText(number, (posX + 1) * CELLSIZE - CELLSIZE / 2, (posY + 1) * CELLSIZE - CELLSIZE / 2 + 8);
}

function DrawBackground() {
    canvas.width = FIELDSIZE*CELLSIZE;
    canvas.height = FIELDSIZE*CELLSIZE;
    context.fillStyle = "lightskyblue";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = CELLSIZE; x < FIELDSIZE * CELLSIZE; x += CELLSIZE) {
        context.moveTo(x, 0);
        context.lineTo(x, FIELDSIZE * CELLSIZE);
    }
    for (let y = CELLSIZE; y < FIELDSIZE*CELLSIZE; y += CELLSIZE) {
        context.moveTo(0, y);
        context.lineTo(CELLSIZE*FIELDSIZE, y);
    }
    context.strokeStyle = "darkblue";
    context.stroke();
    context.strokeStyle = "darkblue";
    context.font = "30px AR DELANEY";
    for (let i = 0; i < notflying.length; i++) {
        if (gameField[notflying[i][1]][notflying[i][2]] !== 0) {
            context.fillRect(notflying[i][2] * CELLSIZE + 1, notflying[i][1] * CELLSIZE + 1, CELLSIZE - 2, CELLSIZE - 2);
        }
        DrawNumber(notflying[i][0], notflying[i][1], notflying[i][2]);
    }
}

function ClearMatrix(rows) {
    for (let i = 0; i < rows; i++) {
        gameField[i].splice(0, gameField[i].length);
    }
}


function IsEmpty(Y, X) {
    return (gameField[Y][X] === 0);
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

function AddNumber(Y, X) {
    gameField[Y][X] = Math.pow(2, RandomDegree());
    DrawNumber(gameField[Y][X], Y, X);
    notflying.push([gameField[Y][X], Y, X])
}

function AddNewCell() {
    EndGame();
    ShowScore();
    var X = Random(0, FIELDSIZE - 1);
    var Y = Random(0, FIELDSIZE - 1);
    if (IsEmpty(Y, X)) {
        AddNumber(Y, X);
    } else {
        AddNumber(EmptyY, EmptyX);
    }
}

function CheckEdge(i, j, v, h) {
    if (i - v >= 0 && i - v < FIELDSIZE && j - h >= 0 && j - h < FIELDSIZE) {
        return true
    } else
        return false;
}

function IsEqual(vertic, horizon) {
    for (let i = 0; i < FIELDSIZE; i++)
        for (let j = 0; j < FIELDSIZE; j++) {
            if (CheckEdge(i, j, vertic, horizon) && gameField[i - vertic][j - horizon] === gameField[i][j]) {
                return true;
            }
        }
    return false;
}

function EndGame() {
    if (!CheckEmptyCells()) {
        for (let i = 0; i < dir.length; i += 2) {
            if (IsEqual(dir[i], dir[i + 1])) {
                return;
            }
        }
        showWindowEnd('block');
        getEmail();
    }
}

function AddFirstCell() {
    AddNewCell();
    AddNewCell();
}

function LetItMoves(i, j, Curr_i, Curr_j, Curr, offset_i, offset_j) {
    if (gameField[Curr_i][Curr_j] === 0 || gameField[Curr_i][Curr_j] === gameField[i][j]) {
        if (gameField[Curr_i][Curr_j] != 0)
            SCORE += gameField[Curr_i][Curr_j];
        gameField[Curr_i][Curr_j] += gameField[i][j];
        moves.push([i, j, Curr_i, Curr_j]);
        flying.push(gameField[i][j]);
    } else {
        if (Curr === 1) {
            notflying.push([gameField[i][j], i, j]);
            return;
        }
        gameField[Curr_i + offset_i][Curr_j + offset_j] += gameField[i][j];
        moves.push([i, j, Curr_i + offset_i, Curr_j + offset_j]);
        flying.push(gameField[i][j]);
    }
    gameField[i][j] = 0;
}

function Move(direction) {
    moves.splice(0, moves.length);
    notflying.splice(0, notflying.length);
    clearInterval(timer);
    let dx = 0, dy = 0;
    const delta = 0.09;
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
                    LetItMoves(i, j, i, j - Curr, Curr, 0, 1);
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
                    LetItMoves(i, j, i - Curr, j, Curr, 1, 0);
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
                    LetItMoves(i, j, i, j + Curr, Curr, 0, -1);
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

                    LetItMoves(i, j, i + Curr, j, Curr, -1, 0);
                }
            }
            dy = delta;
            break;
    }
    if (flying.length == 0) {
        var addnewcell = false;
    } else {
        var addnewcell = true;
    }

    var timer = setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        DrawBackground(); // нарисуем все ячейки которые не двигались
        if (moves.length === 0 || flying.length == 0) {
            clearInterval(timer);
            DrawBackground();
            if (addnewcell)
                AddNewCell();
            acceptKeys = true;
        }
        for (let j = 0; j < moves.length; j++) {
            let x1 = moves[j][0], y1 = moves[j][1], x2 = moves[j][2], y2 = moves[j][3];
            if (Math.abs(x1 - x2) < delta && Math.abs(y1 - y2) < delta) {
                notflying.push([gameField[x2][y2], x2, y2])
                moves.splice(j, 1);
                flying.splice(j, 1);
                continue;
            }
            DrawNumber(flying[j], x1, y1);
            moves[j][0] += dy;
            moves[j][1] += dx;
        }
    }, 30);
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

var acceptKeys = true;

function Direction(key) {
    if (!acceptKeys || CheckWindows()) return;
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
    if (direction === 'none' || moves.length != 0) return;
    acceptKeys = false;
    Move(direction);
}

function init() {
    DrawBackground();
    AddFirstCell();
    addEventListener("keydown", Direction);
}

function Update(sign) {
    FIELDSIZE += sign;
    moves.splice(0, moves.length);
    flying.splice(0, flying.length);
    notflying.splice(0, notflying.length);
    gameField = CreateMatrix(FIELDSIZE, FIELDSIZE);
    SCORE = 0;
    init();
}

function resize(size){
    if (size === '>') {
        if(FIELDSIZE < 6)
            Update(1);
    } else {
        if(FIELDSIZE>3)
            Update(-1);
    }
}

showWindowSign('block');
init();