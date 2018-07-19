const FIELDSIZE = 5;

function init() {
    let canvas = document.getElementById("matrix");
    canvas.width = 500;
    canvas.height = 500;
    let context = canvas.getContext("2d");
    context.fillStyle = "#FAFAD2";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 100; x < 500; x += 100) {
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

    function DrawNumber(number, posY, posX) {
        context.fillStyle = "#FAFAD2";
        context.fillRect(posX*100+1, posY*100+1, 98, 98);
        context.textAlign = 'center';


        context.strokeText(number, (posX+1)*100-50, (posY+1)*100-50);

    }

    function CheckEmptyCells() {
        //console.log('CHrck');
        let flag = false;
        for (let i = 0; i < FIELDSIZE; i++) {
            for (let j = 0; j < FIELDSIZE; j++){
                if(gameField[i][j] === 0){
                    EmptyX = j;
                    EmptyY = i;
                    flag = true;
                    // console.log('X, Y' + EmptyX, EmptyY);
                }
            }
        }
        return flag;
    }

    function IsEmpty(Y, X) {
        return(gameField[Y][X] === 0);
    }
    function ShowMatrixArray(rows){
        for(let i=0; i<rows; i++){
            console.log(gameField[i]);
        }
        console.log('');
    }
    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function RandomDeg() {
        return Math.floor(Math.random()*2) + 1;
    }
    function EndGame() {
        //console.log("EndGAme");

        if(!CheckEmptyCells()){
            //2048?
            //Can't move
        }
    }
    function AddNewCell() {
        EndGame();
        var X = Random(0, FIELDSIZE-1);
        var Y = Random(0, FIELDSIZE-1);
        console.log(X, Y);
        if(IsEmpty(Y, X)) {
            gameField[Y][X] = Math.pow(2, RandomDeg());
            DrawNumber(gameField[Y][X], Y, X);
        }else{
            EndGame();
            gameField[EmptyY][EmptyX] = Math.pow(2, RandomDeg());
            DrawNumber(gameField[EmptyY][EmptyX], EmptyY, EmptyX);
        }
    }
    function AddFirstCell() {
        AddNewCell();
        AddNewCell();
    }
    //  матрица поля
    function CreateMatrixArray(rows, columns){
        gameField = new Array();
        for(let i=0; i<rows; i++){
            gameField[i] = new Array();
            for(let j=0; j< columns; j++){
                gameField[i][j] = 0;
            }
        }
        return gameField;
    }

    var gameField = CreateMatrixArray(FIELDSIZE,FIELDSIZE);
    var keyboard;
    var SCORE = 0;
    var EmptyX;
    var EmptyY;
    AddFirstCell();
    //  смотрим что нажали
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
    addEventListener("keydown", Direction);

    //Типа взяли из предыдущей что-то
    function Move(direction){
        var Curr = 1;
        switch(direction){

            case "left":  // если нажата клавиша влево
                for(var i=0; i<FIELDSIZE; i++) {
                    for (var j = 1; j < FIELDSIZE; j ++) {
                        if (gameField[i][j] !== 0) {
                            while (gameField[i][j - Curr] === 0 && j - Curr !== 0) {
                                Curr++;
                            }
                            if (Curr !== 0) {//useless??
                                if (gameField[i][j - Curr] === 0 || gameField[i][j - Curr] === gameField[i][j]) {
                                    gameField[i][j - Curr] += gameField[i][j];
                                    DrawNumber(gameField[i][j - Curr], i, j - Curr);
                                    gameField[i][j] = 0;
                                    DrawNumber('', i, j);
                                    SCORE += gameField[i][j - Curr];//check
                                } else {
                                    if (Curr !== 1) {
                                        gameField[i][j - Curr + 1] += gameField[i][j];
                                        DrawNumber(gameField[i][j - Curr+1], i, j - Curr+1);
                                        gameField[i][j] = 0;
                                        DrawNumber('', i, j);
                                    }
                                }
                            }
                        }
                        Curr = 1;//сбросить здесь?
                    }
                }
                AddNewCell();
                // EndOfGame();
                break;
            case "up":   // если нажата клавиша вверх
                for(var i=1; i<FIELDSIZE; i++) {
                    for (var j = 0; j < FIELDSIZE; j++) {
                        if (gameField[i][j] !== 0) {
                            while (gameField[i - Curr][j] === 0 && i - Curr !== 0) {
                                Curr++;
                            }
                            if (Curr !== 0) {
                                if (gameField[i - Curr][j] === 0 || gameField[i- Curr][j] === gameField[i][j]) {
                                    gameField[i- Curr][j] += gameField[i][j];
                                    DrawNumber(gameField[i - Curr][j], i - Curr, j);
                                    gameField[i][j] = 0;
                                    DrawNumber('', i, j);
                                    SCORE += gameField[i- Curr][j];
                                } else {
                                    if(Curr !== 1) {
                                        gameField[i - Curr + 1][j] += gameField[i][j];
                                        DrawNumber(gameField[i - Curr + 1][j], i - Curr + 1, j);
                                        gameField[i][j] = 0;
                                        DrawNumber('', i, j);
                                    }
                                }
                            }
                        }
                        Curr = 1;//сбросить здесь?
                    }
                }
                AddNewCell();
                // EndOfGame();
                break;
            case "right":   // если нажата клавиша вправо
                for(var i=0; i<FIELDSIZE; i++) {
                    for (var j = FIELDSIZE-2; j >= 0; j--) {
                        if (gameField[i][j] !== 0) {
                            while (gameField[i][j + Curr] === 0 && j + Curr !== FIELDSIZE-1) {
                                Curr++;
                            }
                            if (Curr !== 0) {//it's useless i'm sure
                                if (gameField[i][j + Curr] === 0 || gameField[i][j + Curr] === gameField[i][j]) {
                                    gameField[i][j + Curr] += gameField[i][j];
                                    DrawNumber(gameField[i][j + Curr], i, j + Curr);
                                    gameField[i][j] = 0;
                                    DrawNumber('', i, j);
                                    SCORE += gameField[i][j + Curr];
                                } else {
                                    if(Curr !== 1) {
                                        gameField[i][j + Curr - 1] += gameField[i][j];
                                        DrawNumber(gameField[i][j + Curr - 1], i, j + Curr - 1);
                                        gameField[i][j] = 0;
                                        DrawNumber('', i, j);
                                    }
                                }
                            }
                        }
                        Curr = 1;//сбросить здесь?
                    }
                }
                AddNewCell();
                //  EndOfGame();
                break;
            case "down":   // если нажата клавиша вниз
                for(var i=FIELDSIZE-2; i>=0; i--) {
                    for (var j = 0; j < FIELDSIZE; j++) {
                        if (gameField[i][j] !== 0) {
                            while (gameField[i + Curr][j] === 0 && i + Curr !== FIELDSIZE-1) {
                                Curr++;
                            }
                            if (Curr !== 0) {
                                if (gameField[i + Curr][j] === 0 || gameField[i + Curr][j] === gameField[i][j]) {
                                    gameField[i + Curr][j] += gameField[i][j];
                                    DrawNumber(gameField[i + Curr][j], i + Curr, j);
                                    gameField[i][j] = 0;
                                    DrawNumber('', i, j);
                                    SCORE += gameField[i + Curr][j];
                                } else {
                                    if(Curr !== 1) {
                                        gameField[i + Curr - 1][j] += gameField[i][j];
                                        DrawNumber(gameField[i + Curr - 1][j], i + Curr - 1, j);
                                        gameField[i][j] = 0;
                                        DrawNumber('', i, j);
                                    }
                                }
                            }
                        }
                        Curr = 1;//сбросить здесь?
                    }
                }
                AddNewCell();
                // EndOfGame();
                break;
        }
        ShowMatrixArray(FIELDSIZE);
    }
}
init();

//Функция показа
function show(state){
    document.getElementById('window').style.display = state;
    document.getElementById('wrap').style.display = state;
}