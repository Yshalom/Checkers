let Board = [];
let ChoosenPlayer = [];
var JumpVariable = [];
var Jump = false;
var GlobalDepth = 7;

// H - Human
// C - Computer
// HK - Human King
// CK - Computer King
// J - Jump

window.onload = function () {
    let Background = document.getElementById("BoardBackground");
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if ((i + j) % 2 == 0)
                Background.innerHTML += `<div class="BoardBackgroundItem" style="background: #202020;" id="BoardBackgroundItem_` + i.toString() + '_' + j.toString() + `"></div>`;
            else
                Background.innerHTML += `<div class="BoardBackgroundItem" style="background: #e0e0e0;" id="BoardBackgroundItem_` + i.toString() + '_' + j.toString() + `"></div>`;
        }
    }

    let Pleyers = document.getElementById("BoardPlayer");
    for (var i = 0; i < 8; i++) {
        let Board_Line = [];
        for (var j = 0; j < 8; j++) {
            for (var j = 0; j < 8; j++) {
                if ((i + j) % 2 == 0) {
                    if (i < 3) {
                        Board_Line.push('C'); // Computer player
                        Pleyers.innerHTML += `<div class="BoardPlayerItem BoardPlayerItemRed" style="left: ` + (12.5 * j + 1.875).toString() + `%; top: ` + (12.5 * i + 1.875).toString() + `%;" id="BoardPlayerItem_` + i.toString() + '_' + j.toString() + `"></div>`;
                    }
                    else if (i > 4) {
                        Board_Line.push('H'); // Human player
                        Pleyers.innerHTML += `<div class="BoardPlayerItem BoardPlayerItemBlue" style="left: ` + (12.5 * j + 1.875).toString() + `%; top: ` + (12.5 * i + 1.875).toString() + `%;" id="BoardPlayerItem_` + i.toString() + '_' + j.toString() + `" onclick="PlayerClick(this)"></div>`;
                    }
                    else
                        Board_Line.push('N'); // None player
                }
                else
                    Board_Line.push('N'); // None player
            }
        }
        Board.push(Board_Line);
    }

    SetChoosablePlyers();
}

function PlayerClick(object) {
    OrganizeRightBar();

    let OldIndexes = document.getElementsByClassName("BoardBackgroundItemChoosable");
    while (OldIndexes.length != 0) {
        if (OldIndexes[0].hasAttribute("onclick"))
            OldIndexes[0].attributes.removeNamedItem("onclick");
        OldIndexes[0].classList.remove("BoardBackgroundItemChoosable");
    }


    //ChoosenPlayer = object.id;

    let numbers = object.id.split('_');
    var x = parseInt(numbers[1]);
    var y = parseInt(numbers[2]);
    if (isNaN(x) || x < 0 || x > 7 || isNaN(y) || y < 0 || y > 7) {
        console.log("Error \n PlayerClick(x=" + x.toString() + ", y=" + y.toString() + ") : x or y is not a number");
        return;
     }


    ChoosenPlayer = [x, y];

    let indexes = GetChoosableIndexes(x, y, Jump);
    for (var i = 0; i < indexes.length; i++) {
        let Player = document.getElementById("BoardBackgroundItem_" + indexes[i][0].toString() + '_' + indexes[i][1].toString());
        Player.classList.add("BoardBackgroundItemChoosable");
        Player.setAttribute("onclick", "ChooseMove(this)");
    }
    if (indexes.length == 0)
        console.log("Error \n PlayerClick(x=" + x.toString() + ", y=" + y.toString() + ") : indexes.length = 0 \n Jump=" + Jump.toString());
}

function GetChoosableIndexes(x, y, OnlyJump) {
    //Find the choosable places to make move for
    let indexes = [];

    //Add the close moves
    if (!OnlyJump) {
        if (Board[x][y] == 'H') {
            if (y - 1 >= 0 && x - 1 >= 0 && y - 1 < 8 && x - 1 < 8 && Board[x - 1][y - 1] == 'N')
                indexes.push([x - 1, y - 1, 'N']);
            if (y + 1 >= 0 && x - 1 >= 0 && y + 1 < 8 && x - 1 < 8 && Board[x - 1][y + 1] == 'N')
                indexes.push([x - 1, y + 1, 'N']);
        }
        if (Board[x][y] == 'C') {
            if (y + 1 >= 0 && x + 1 >= 0 && y + 1 < 8 && x + 1 < 8 && Board[x + 1][y + 1] == 'N')
                indexes.push([x + 1, y + 1, 'N']);
            if (y - 1 >= 0 && x + 1 >= 0 && y - 1 < 8 && x + 1 < 8 && Board[x + 1][y - 1] == 'N')
                indexes.push([x + 1, y - 1, 'N']);
        }
        if (Board[x][y] == 'HK' || Board[x][y] == 'CK') {
            for (var i = -1; i <= 1; i += 2)
                for (var j = -1; j <= 1; j += 2)
                    for (var k = 1; y + j * k >= 0 && x + i * k >= 0 && y + j * k < 8 && x + i * k < 8 && Board[x + k * i][y + k * j] == 'N'; k++)
                        indexes.push([x + k * i, y + k * j, 'N'])
        }
    }

    //Add the jump moves
    var A = 'H';
    if (Board[x][y] == 'H' || Board[x][y] == 'HK')
        A = 'C';
    if (Board[x][y] == 'H' || Board[x][y] == 'C') {
        for (var i = -1; i <= 1; i += 2)
            for (var j = -1; j <= 1; j += 2) {
                if ((y + j >= 0 && x + i >= 0 && y + j < 8 && x + i < 8 && (Board[x + i][y + j] == A || Board[x + i][y + j] == A + 'K')) &&
                    (y + 2 * j >= 0 && x + 2 * i >= 0 && y + 2 * j < 8 && x + 2 * i < 8 && Board[x + 2 * i][y + 2 * j] == 'N')) {
                    indexes.push([x + 2 * i, y + 2 * j, 'J']);
                }
            }
    }
    else {
        for (var i = -1; i <= 1; i += 2)
            for (var j = -1; j <= 1; j += 2) {
                var k = 1;
                for (; y + j * k >= 0 && x + i * k >= 0 && y + j * k < 8 && x + i * k < 8 && Board[x + k * i][y + k * j] == 'N'; k++);
                if (x + i * k >= 0 && y + j * k < 8 && x + i * k < 8 && (Board[x + k * i][y + k * j] == A || Board[x + k * i][y + k * j] == A + 'K'))
                   for (var l = k + 1; y + j * l >= 0 && x + i * l >= 0 && y + j * l < 8 && x + i * l < 8 && Board[x + l * i][y + l * j] == 'N'; l++)
                        indexes.push([x + l * i, y + l * j, 'J']);
            }
    }

    return indexes;
}

function GameState(turn) {
    var NoMoveC = true;
    var NoMoveH = true;
    for (var i = 0; i < 8 && (NoMoveC || NoMoveH); i++)
        for (var j = 0; j < 8 && (NoMoveC || NoMoveH); j++) {
            if ((Board[i][j] == 'C' || Board[i][j] == 'CK') && GetChoosableIndexes(i, j, false).length != 0)
                    NoMoveC = false;
            if ((Board[i][j] == 'H' || Board[i][j] == 'HK') && GetChoosableIndexes(i, j, false).length != 0)
                    NoMoveH = false;
        }

    if (NoMoveC && NoMoveH) {
        if (turn == 'H')
            return Infinity; //computer win
        return -Infinity; //human win
    }

    if (NoMoveC)
        return -Infinity; //computer win
    if (NoMoveH)
        return Infinity; //human win

    var counter = 0;
    for (var i = 0; i < 8; i++)
        for (var j = 0; j < 8; j++) {
            if (Board[i][j] == 'C')
                counter++;
            if (Board[i][j] == 'H')
                counter--;
            if (Board[i][j] == 'CK')
                counter += 2;
            if (Board[i][j] == 'HK')
                counter -= 2;
        }

    return counter;
}

function ShowLaws() {
    if (document.getElementById("Laws").style.display == "") {
        document.getElementById("Laws").style.display = "block";
    }
    else
        document.getElementById("Laws").style.display = "";
}

function HideLaws() {
    document.getElementById("Laws").style.display = "";
}

function ChooseMove(object) {
    //Delete the other choosebale moves
    let OldIndexes = document.getElementsByClassName("BoardBackgroundItemChoosable");
    while (OldIndexes.length != 0) {
        if (OldIndexes[0].hasAttribute("onclick"))
            OldIndexes[0].attributes.removeNamedItem("onclick");
        OldIndexes[0].classList.remove("BoardBackgroundItemChoosable");
    }

    //Human move
    let numbers = object.id.split('_');
    var newX = parseInt(numbers[1]);
    var newY = parseInt(numbers[2]);
    var x = ChoosenPlayer[0];
    var y = ChoosenPlayer[1];

    Board[newX][newY] = Board[x][y];
    Board[x][y] = 'N';
    ChoosenPlayer = [newX, newY];
    MovePlayer(x, y, newX, newY, 0);

    //Make kings
    if (newX == 0) {
        Board[newX][newY] = 'HK';
        let Player = document.getElementById("BoardPlayerItem_" + newX.toString() + '_' + newY.toString());
        setTimeout(function F() {
            Player.classList.add("BoardPlayerItemBlueKing");
        }, 1000);
    }

    //Delete enemy's players
    var WasJump = false;
    var dx = (newX - x) / Math.abs(newX - x);
    var dy = (newY - y) / Math.abs(newY - y);
    for (var i = 1; x + i * dx != newX; i++)
        if (Board[x + i * dx][y + i * dy] == 'C' || Board[x + i * dx][y + i * dy] == 'CK') {
            WasJump = true;
            Board[x + i * dx][y + i * dy] = 'N';
            DeletePlayer(x + i * dx, y + i * dy, 0);
        }

    if (WasJump)
        Jump = true;

    if (WasJump && GetChoosableIndexes(newX, newY, Jump).length != 0) {
        JumpVariable = [newX, newY];
        SetChoosablePlyers();
        VicLoss('C');
        return;
    }

    VicLoss('C');

    //Computer Move
    ComputerMove();

    SetChoosablePlyers();
}

function ComputerMove() {
    var JumpIndex = 1;
    Jump = false;
    JumpVariable = [];
    var WasJump = false;
    do {
        let BoardSave = [];
        for (var i = 0; i < 8; i++) {
            BoardSave[i] = [];
            for (var j = 0; j < 8; j++)
                BoardSave[i].push(Board[i][j]);
        }
        var Next = GetComputerNextMove();
        if (Next == undefined) {
            console.log("Error \n ChooseMove: Next is undefined");
            return;
        }

        for (var i = 0; i < 8; i++)
            for (var j = 0; j < 8; j++)
                if (BoardSave[i][j] != Board[i][j]) {
                    Board[i][j] = BoardSave[i][j];
                    console.log("Error \n ComputerMove(i=" + i.toString() + ", j=" + j.toString() + ") : BoardSave[i][j] != Board[i][j]");
                }

        if (Next.length == 0) {
            VicLoss('H');
            break;
        }

        var newX = Next[1][0];
        var newY = Next[1][1];
        var x = Next[0][0];
        var y = Next[0][1];

        Board[newX][newY] = Board[x][y];
        Board[x][y] = 'N';
        ChoosenPlayer = [newX, newY];
        MovePlayer(x, y, newX, newY, JumpIndex * 1000);

        //Make kings
        if (newX == 7) {
            Board[newX][newY] = 'CK';
            let Player = document.getElementById("BoardPlayerItem_" + newX.toString() + '_' + newY.toString());
            setTimeout(function F() {
                Player.classList.add("BoardPlayerItemRedKing");
            }, JumpIndex * 1000 + 1000);
        }

        //Delete enemy's players
        var WasJump = false;
        var dx = (newX - x) / Math.abs(newX - x);
        var dy = (newY - y) / Math.abs(newY - y);
        for (var i = 1; x + i * dx != newX; i++)
            if (Board[x + i * dx][y + i * dy] == 'H' || Board[x + i * dx][y + i * dy] == 'HK') {
                WasJump = true;
                Board[x + i * dx][y + i * dy] = 'N';
                DeletePlayer(x + i * dx, y + i * dy, 1000 * JumpIndex);
            }

        if (WasJump) {
            Jump = true;
            JumpVariable = [newX, newY];
        }

        if (GetChoosableIndexes(newX, newY, Jump).length == 0)
            WasJump = false; //Stop the loop altho there was a jump

        VicLoss('H');
        JumpIndex++;

    } while (WasJump);

    Jump = false;
    JumpVariable = [];
}

function SetChoosablePlyers() {
    if (JumpVariable.length == 0)
    {
        //Delete all the past unchoosable players
        let OldUnchoosable = document.getElementsByClassName("UnchoosablePlayer");
        while (OldUnchoosable.length != 0) {
            OldUnchoosable[0].setAttribute("onclick", "PlayerClick(this)");
            OldUnchoosable[0].classList.remove("UnchoosablePlayer");
        }

        let AllIndexes = [];
        for (var i = 0; i < 8; i++)
            for (var j = 0; j < 8; j++)
                if (Board[i][j] == 'H' || Board[i][j] == 'HK')
                    AllIndexes.push([i, j]);
        var IsJump = false;
        for (var i = 0; i < AllIndexes.length && !IsJump; i++) {
            let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
            for (var j = 0; j < IndexesOfI.length && !IsJump; j++)
                if (IndexesOfI[j][2] == 'J')
                    IsJump = true;
        }

        //Only the jump is legal.
        if (IsJump) {
            Jump = true;
            for (var i = 0; i < AllIndexes.length; i++) {
                let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
                var Jmp = false;
                for (var j = 0; j < IndexesOfI.length && !Jmp; j++)
                    if (IndexesOfI[j][2] == 'J')
                        Jmp = true;
                //The player is illegal.
                if (!Jmp) {
                    var Player = document.getElementById("BoardPlayerItem_" + AllIndexes[i][0].toString() + '_' + AllIndexes[i][1].toString());
                    if (Player.hasAttribute("onclick"))
                        Player.attributes.removeNamedItem("onclick");
                    Player.classList.add("UnchoosablePlayer");
                }
            }
        }
        else {
            for (var i = 0; i < AllIndexes.length; i++) {
                //The player is illegal.
                if (GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump).length == 0) {
                    var Player = document.getElementById("BoardPlayerItem_" + AllIndexes[i][0].toString() + '_' + AllIndexes[i][1].toString());
                    if (Player.hasAttribute("onclick"))
                        Player.attributes.removeNamedItem("onclick");
                    Player.classList.add("UnchoosablePlayer");
                }
            }
        }
    }
    else {
        for (var i = 0; i < 8; i++)
            for (var j = 0; j < 8; j++)
                if ((i != JumpVariable[0] || j != JumpVariable[1]) && (Board[i][j] == 'H' || Board[i][j] == 'HK')) {
                    var Player = document.getElementById("BoardPlayerItem_" + i.toString() + '_' + j.toString())
                    if (Player.hasAttribute("onclick"))
                        Player.attributes.removeNamedItem("onclick");
                    Player.classList.add("UnchoosablePlayer");
                }
    }
}

function VicLoss(X) {
    if (GameState(X) == Infinity) {
        let win = document.getElementById("WinLossPanel");
        win.style.display = "block";
        win.innerText = "Computer win";
    }

    if (GameState(X) == -Infinity) {
        let win = document.getElementById("WinLossPanel");
        win.style.display = "block";
        win.innerText = "You win";
        return;
    }
}

function GetComputerNextMove() {
    if (JumpVariable.length == 0) {
        let AllIndexes = [];
        for (var i = 0; i < 8; i++)
            for (var j = 0; j < 8; j++)
                if (Board[i][j] == 'C' || Board[i][j] == 'CK')
                    AllIndexes.push([i, j]);
        //Look for jumps
        var IsJump = false;
        for (var i = 0; i < AllIndexes.length && !IsJump; i++) {
            let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
            for (var j = 0; j < IndexesOfI.length && !IsJump; j++)
                if (IndexesOfI[j][2] == 'J')
                    IsJump = true;
        }

        let LegalIndexes = [];
        for (var i = 0; i < AllIndexes.length; i++) {
            let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
            for (var j = 0; j < IndexesOfI.length; j++)
                if (!IsJump || IndexesOfI[j][2] == 'J')
                    LegalIndexes.push([AllIndexes[i], IndexesOfI[j]]);
        }

        //Find the best move
        var RIndex = [0, -Infinity];
        for (var i = 0; i < LegalIndexes.length; i++) {
            //Make one move forward
            var x = LegalIndexes[i][0][0];
            var y = LegalIndexes[i][0][1];
            var newX = LegalIndexes[i][1][0];
            var newY = LegalIndexes[i][1][1];
            let log = MinMaxMoveForward(x, y, newX, newY);

            var Value;
            if (JumpVariable.length != 0)
                Value = MinMaxAlphaBeta(GlobalDepth, -Infinity, Infinity, true);
            else
                Value = MinMaxAlphaBeta(GlobalDepth, -Infinity, Infinity, false);
            if (RIndex[1] < Value)
                RIndex = [i, Value];

            //Make back the move
            MinMaxMoveBack(x, y, newX, newY, log);
        }

        //Return the best move
        console.log("RIndex[1]=" + RIndex[1].toString());
        return LegalIndexes[RIndex[0]]; //Return old position & new position. [old, new]
    }
    //Double jump
    else {
        let Indexes = GetChoosableIndexes(JumpVariable[0], JumpVariable[1], Jump);
        if (Indexes.length == 0)
            return [];

        //Find the best move
        var RIndex = [0, -Infinity];
        for (var i = 0; i < Indexes.length; i++) {
            //Make one move forward
            var x = JumpVariable[0];
            var y = JumpVariable[1];
            var newX = Indexes[i][0];
            var newY = Indexes[i][1];
            let log = MinMaxMoveForward(x, y, newX, newY);

            var Value;
            if (JumpVariable.length != 0)
                Value = MinMaxAlphaBeta(GlobalDepth, -Infinity, Infinity, true);
            else
                Value = MinMaxAlphaBeta(GlobalDepth, -Infinity, Infinity, false);
            if (RIndex[1] < Value)
                RIndex = [i, Value];

            //Make back the move
            MinMaxMoveBack(x, y, newX, newY, log);
        }

        //Return the best move
        console.log("RIndex[1]=" + RIndex[1].toString());
        return [[JumpVariable[0], JumpVariable[1]], Indexes[RIndex[0]]]; //Return old position & new position. [old, new]    }
    }
}

function MovePlayer(x, y, newX, newY, ms) {
    let Player = document.getElementById("BoardPlayerItem_" + x.toString() + '_' + y.toString());
    Player.id = "BoardPlayerItem_" + newX.toString() + '_' + newY.toString();
    setTimeout(function F() {
        Player.style.left = (12.5 * newY + 1.875).toString() + '%';
        Player.style.top = (12.5 * newX + 1.875).toString() + '%';
    }, ms);
}

function DeletePlayer(x, y, ms) {
    let Player = document.getElementById("BoardPlayerItem_" + x.toString() + '_' + y.toString());
    Player.attributes.removeNamedItem("id");
    setTimeout(function F() {
        Player.style.opacity = 0;
        setTimeout(function F() {
            Player.style.display = "none";
        }, 1000);
    }, ms);
}

function MinMaxAlphaBeta(depth, alpha, beta, MaxPlayer) {
    if (depth == 0 || Math.abs(GameState(MaxPlayer)) == Infinity)
        return GameState(MaxPlayer);

    //Take the best move
    if (MaxPlayer) {
        var RIndex = -Infinity;

        if (JumpVariable.length == 0) {
            let AllIndexes = [];
            for (var i = 0; i < 8; i++)
                for (var j = 0; j < 8; j++)
                    if (Board[i][j] == 'C' || Board[i][j] == 'CK')
                        AllIndexes.push([i, j]);
            //Look for jumps
            var IsJump = false;
            for (var i = 0; i < AllIndexes.length && !IsJump; i++) {
                let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
                for (var j = 0; j < IndexesOfI.length && !IsJump; j++)
                    if (IndexesOfI[j][2] == 'J')
                        IsJump = true;
            }

            let LegalIndexes = [];
            for (var i = 0; i < AllIndexes.length; i++) {
                let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
                for (var j = 0; j < IndexesOfI.length; j++)
                    if (!IsJump || IndexesOfI[j][2] == 'J')
                        LegalIndexes.push([AllIndexes[i], IndexesOfI[j]]);
            }

            //Find the best move
            for (var i = 0; i < LegalIndexes.length; i++) {
                //Make one move forward
                var x = LegalIndexes[i][0][0];
                var y = LegalIndexes[i][0][1];
                var newX = LegalIndexes[i][1][0];
                var newY = LegalIndexes[i][1][1];
                let log = MinMaxMoveForward(x, y, newX, newY);

                var Value;
                if (JumpVariable.length != 0)
                    Value = MinMaxAlphaBeta(depth, alpha, beta, true);
                else
                    Value = MinMaxAlphaBeta(depth -1, alpha, beta, false);
                if (RIndex < Value)
                    RIndex = Value;

                //Make back the move
                MinMaxMoveBack(x, y, newX, newY, log);

                //Beta pruning
                if (RIndex >= beta)
                    break;

                if (alpha < RIndex)
                    alpha = RIndex;
            }

            //Return the best move
        }
        //Double jump
        else {
            let Indexes = GetChoosableIndexes(JumpVariable[0], JumpVariable[1], Jump);

            //Find the best move
            for (var i = 0; i < Indexes.length; i++) {
                //Make one move forward
                var x = JumpVariable[0];
                var y = JumpVariable[1];
                var newX = Indexes[i][0];
                var newY = Indexes[i][1];
                let log = MinMaxMoveForward(x, y, newX, newY);

                var Value;
                if (JumpVariable.length != 0)
                    Value = MinMaxAlphaBeta(depth, alpha, beta, true);
                else
                    Value = MinMaxAlphaBeta(depth - 1, alpha, beta, false);
                if (RIndex < Value)
                    RIndex = Value;

                //Make back the move
                MinMaxMoveBack(x, y, newX, newY, log);

                //Beta pruning
                if (RIndex >= beta)
                    return RIndex;

                if (alpha < RIndex)
                    alpha = RIndex;
            }

            //Return the best move
        }

        //Return the best move
        return RIndex;
    }

    //Find the worst move
    else {
        var RIndex = Infinity;

        if (JumpVariable.length == 0) {
            let AllIndexes = [];
            for (var i = 0; i < 8; i++)
                for (var j = 0; j < 8; j++)
                    if (Board[i][j] == 'H' || Board[i][j] == 'HK')
                        AllIndexes.push([i, j]);
            //Look for jumps
            var IsJump = false;
            for (var i = 0; i < AllIndexes.length && !IsJump; i++) {
                let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
                for (var j = 0; j < IndexesOfI.length && !IsJump; j++)
                    if (IndexesOfI[j][2] == 'J')
                        IsJump = true;
            }

            let LegalIndexes = [];
            for (var i = 0; i < AllIndexes.length; i++) {
                let IndexesOfI = GetChoosableIndexes(AllIndexes[i][0], AllIndexes[i][1], Jump);
                for (var j = 0; j < IndexesOfI.length; j++)
                    if (!IsJump || IndexesOfI[j][2] == 'J')
                        LegalIndexes.push([AllIndexes[i], IndexesOfI[j]]);
            }

            //Find the worst move
            for (var i = 0; i < LegalIndexes.length; i++) {
                //Make one move forward
                var x = LegalIndexes[i][0][0];
                var y = LegalIndexes[i][0][1];
                var newX = LegalIndexes[i][1][0];
                var newY = LegalIndexes[i][1][1];
                let log = MinMaxMoveForward(x, y, newX, newY);

                var Value;
                if (JumpVariable.length != 0)
                    Value = MinMaxAlphaBeta(depth, alpha, beta, false);
                else
                    Value = MinMaxAlphaBeta(depth - 1, alpha, beta, true);
                if (RIndex > Value)
                    RIndex = Value;

                //Make back the move
                MinMaxMoveBack(x, y, newX, newY, log);

                //Alpha pruning
                if (RIndex <= alpha)
                    break;

                if (beta > RIndex)
                    beta = RIndex;
            }
        }
        //Double jump
        else {
            let Indexes = GetChoosableIndexes(JumpVariable[0], JumpVariable[1], Jump);

            //Find the worst move
            for (var i = 0; i < Indexes.length; i++) {
                //Make one move forward
                var x = JumpVariable[0];
                var y = JumpVariable[1];
                var newX = Indexes[i][0];
                var newY = Indexes[i][1];
                let log = MinMaxMoveForward(x, y, newX, newY);

                var Value;
                if (JumpVariable.length != 0)
                    Value = MinMaxAlphaBeta(depth, alpha, beta, false);
                else
                    Value = MinMaxAlphaBeta(depth - 1, alpha, beta, true);
                if (RIndex > Value)
                    RIndex = Value;

                //Make back the move
                MinMaxMoveBack(x, y, newX, newY, log);

                //Alpha pruning
                if (RIndex <= alpha)
                    break;

                if (beta > RIndex)
                    beta = RIndex;
            }
        }

        //Return the worst move
        return RIndex;
    }
}

function MinMaxMoveForward(x, y, newX, newY) {
    if (x == undefined || y == undefined) {
        console.log("Error \n MinMaxMoveForward(underfined number)");
        return [];
    }

    let log = [[], Array.from(JumpVariable), Jump]; // [Deleted item, JumpVariable, Jump]

    var A = 'H';
    if (Board[x][y] == 'H' || Board[x][y] == 'HK')
        A = 'C';
    Board[newX][newY] = Board[x][y];
    Board[x][y] = 'N';
    var dx = (newX - x) / Math.abs(newX - x);
    var dy = (newY - y) / Math.abs(newY - y);
    for (var j = 1; x + j * dx != newX; j++)
        if (Board[x + j * dx][y + j * dy] == A || Board[x + j * dx][y + j * dy] == A + 'K') {
            log[0] = [x + j * dx, y + j * dy, Board[x + j * dx][y + j * dy]];
            Board[x + j * dx][y + j * dy] = 'N';
            if (GetChoosableIndexes(newX, newY, true).length != 0) {
                JumpVariable = [newX, newY];
                Jump = true;
            }
            else {
                JumpVariable = [];
                Jump = false;
            }
        }

    return log;
}

function MinMaxMoveBack(x, y, newX, newY, log) {
    //log = [Deleted item, JumpVariable, Jump]
    Board[x][y] = Board[newX][newY];
    Board[newX][newY] = 'N';
    if (log[0].length != 0)
        Board[log[0][0]][log[0][1]] = log[0][2];
    JumpVariable = log[1];
    Jump = log[2];
}

function ComputerFirst() {
    OrganizeRightBar();

    ComputerMove();
    SetChoosablePlyers();
}

var OrganizeRightBarVariable = true;
function OrganizeRightBar() {
    if (OrganizeRightBarVariable) {
        //Remove 'Computer First' button
        document.getElementById("ComputerFirstButton").style.opacity = 0;
        setTimeout(function F() { document.getElementById("ComputerFirstButton").style.display = "none"; }, 1000);

        //Remove the depth selection
        GlobalDepth = parseInt(document.getElementById("DepthSelection").value);
        document.getElementById("DepthSelection").style.display = "none";
        document.getElementById("DepthValue").innerText = GlobalDepth.toString();
    }
    OrganizeRightBarVariable = false;
}