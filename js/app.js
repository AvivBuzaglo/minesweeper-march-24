'use strict'

const MINE = '💣'
const EMPTY = ' '

var gBoard
var gMinesIdxs = []
var gFirstClick = true
var gFirstIdx
var gHintClick = false
var gManuallMines = false
var gManuallMinesCount
var gMegaHint = false
var gMegaHintClicks = 2
var gMegaHintIdxs = []
var gSavedMoves = []
var gTimer 
var gIntervalId
var gBestScore_4x4 = Number(localStorage.getItem('4x4 Best score')) || undefined
var gBestScore_8x8 = Number(localStorage.getItem('8x8 Best score')) || undefined
var gBestScore_12x12 = Number(localStorage.getItem('12x12 Best score')) || undefined

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    safeClicks: 3,
    megaHint: 1,
    moves: 0
}


function onInit(rows, cols) {
    gBoard = buildBorad(rows, cols)
    renderBoard(gBoard)
    resetValues()
    gLevel.size = rows
    if(rows === 4) {
        gGame.lives = 1
        var elLives = document.querySelector(".lives")
        var hearts = '❤️'
        elLives.innerHTML = `Lives: ${hearts}`
    }
    gManuallMinesCount = gLevel.mines
    saveGameState()
}

function buildBorad(rows = 4, cols = 4) {
    const BOARD = createMat(rows, cols)

    for(var i = 0; i < rows; i++) {
        for(var j = 0; j < cols; j++) {
            BOARD[i][j] = {
                minesAroundCount: null,
                isShow: false,
                isMine: false,
                isMarked: false
            }       
        }
    } return BOARD
} 


function renderBoard(board, rowIdx, colIdx) {
    var strHTML = ''
    for(var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for(var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j].minesAroundCount
            var cellClass = (board[i][j].isMine === true) ? 'mine' : ''
            if(i === rowIdx && j === colIdx || gBoard[i][j].isShow === true) cellClass = "show" 
            var cellPosClass = getClassName({i, j})
            var cellData = `data="cell-${i}-${j}"`
            strHTML += `
            <td class="cell ${cellClass} ${cellPosClass}" ${cellData} onclick="onCellClick(this, ${i}, ${j})"; oncontextmenu="onRightClick(this, ${i}, ${j})">
            ${currCell}
            </td>
            ` 
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board) {
    for(var i = 0; i < board.length; i++) {
        for(var j = 0; j < board[i].length; j++) {
            if(!board[i][j].isMine) {
                var minesAroundCount = 0
                for(var l = i - 1; l <= i + 1; l++) {
                    if(l < 0 || l >= board.length) continue
                    for(var d = j - 1; d <= j + 1; d++) {
                        if(l === i && d === j) continue
                        if(d < 0 || d >= board[0].length) continue
                        var currCell = board[l][d]
                        if(currCell.isMine === true) minesAroundCount++
                        if(minesAroundCount <= 0) minesAroundCount = EMPTY
                        board[i][j].minesAroundCount = minesAroundCount
                    }
                }
            }
        }
    } return board
}

function onCellClick(elCell, i, j) {
    if(!gGame.isOn && !gFirstClick) return
    saveGameState()
    if(gHintClick && !gFirstClick) {
        gHintClick = false
        gGame.hints--
        hintAddShow(i, j)
        setTimeout(() => hintRemoveShow(i, j), 1000)

        var elImg = document.querySelector('.hints')
        elImg.innerHTML = '<img src="css/img/hint1.png">'

        return
    }
    if(gFirstClick && !gManuallMines) {
        gFirstIdx = {i: i, j: j}
        gIntervalId = setInterval(timer, 10)
        gFirstClick = false
        gBoard[i][j].isShow = true
        gGame.shownCount++
        addMinesIdx(gBoard, gLevel.size)
        renderBoard(setMinesNegsCount(gBoard), i, j)
        emptyCellOpen(i, j)
        return
    }
    if(gManuallMines && gFirstClick) {
        gBoard[i][j].minesAroundCount = MINE
        gBoard[i][j].isMine = true
        gManuallMinesCount--
        elCell.classList.add('safe-clicked')
        setTimeout(() => elCell.classList.remove('safe-clicked'), 2000)
        console.log(gManuallMines, gManuallMinesCount);

         
        if(gManuallMinesCount === 0) {
            setTimeout(() => renderBoard(setMinesNegsCount(gBoard, i, j)), 1000)
            gManuallMines = false
            gFirstClick = false
            gIntervalId = setInterval(timer, 10)
        }
        return
    }
    if(gMegaHint) {
        if(gMegaHintClicks === 2) {
            gMegaHintIdxs.push({i: i, j: j})
            elCell.classList.add('hintShow')
            gMegaHintClicks--
            return
        }
        if(gMegaHintClicks === 1) {
            console.log('im in');
            gMegaHintIdxs.push({i: i, j: j})
            megaHintReveal(gMegaHintIdxs[0], gMegaHintIdxs[1])

            setTimeout(() => megaHintHide(gMegaHintIdxs[0], gMegaHintIdxs[1]), 2000)
        }
        gMegaHintClicks--
        gMegaHint = false
        gGame.megaHint--
        return
    }
    if(gBoard[i][j].isMine && !gManuallMines) {
        var elLives = document.querySelector(".lives")
        var hearts
        gGame.lives--
        gLevel.mines--
        gGame.shownCount++
        gBoard[i][j].isShow = true

        hearts = (gGame.lives > 1) ? '❤️❤️' : '❤️'
        if(gGame.lives < 1) hearts = '💥' 
        
        elCell.classList.add("show")
        elLives.innerHTML = `Lives: ${hearts}`
            checkEndOfGame(gBoard)
            return
    }
    if(gBoard[i][j].minesAroundCount === EMPTY) {


        elCell.classList.add("show")

        emptyCellOpen(i, j)
        
    }
    else {    
        gBoard[i][j].isShow = true
        gGame.shownCount++
        elCell.classList.add("show")
        
        if(gBoard[i][j].isMarked === true) {
            gBoard[i][j].isMarked = false
            elCell.classList.remove("flag")
            if(gBoard[i][j].isMine) {
                gGame.markedCount--
                var elLives = document.querySelector(".lives")
                var hearts
                gGame.lives--
                gLevel.mines--
                gGame.shownCount++
                gBoard[i][j].isShow = true
        
                hearts = (gGame.lives > 1) ? '❤️❤️' : '❤️'
                if(gGame.lives < 1) hearts = '💥' 
                
                elCell.classList.add("show")
                elLives.innerHTML = `Lives: ${hearts}`
            }  
        } 
    }
    gGame.moves++
    checkEndOfGame(gBoard)
}


function onRightClick(elCell, i, j) {
    if(!gGame.isOn && !gFirstClick) return
    if(gBoard[i][j].isShow === true) return
    
    if(gBoard[i][j].isMarked === true) {
        gBoard[i][j].isMarked = false
        elCell.classList.remove("flag")
        if(gBoard[i][j].isMine) gGame.markedCount--
    } 
    
    else {
        gBoard[i][j].isMarked = true
        elCell.classList.toggle("flag")
        if(gBoard[i][j].isMine) gGame.markedCount++
    } 
    gGame.moves++
    saveGameState()
    checkEndOfGame(gBoard)
}




function addMinesIdx(board, rows) {
    var mineCount
    if(rows === 4) {
        mineCount = 2
        gLevel.mines = 2
    }
    
    else if(rows === 8) {
        mineCount = 14
        gLevel.mines = 14
    }
    else if(rows === 12) {
        mineCount = 32
        gLevel.mines = 32
    }


    var minesIdxs = firstClickEmpty(board, gFirstIdx.i, gFirstIdx.j)
    console.log(minesIdxs);
    while(mineCount !== 0) {
        var idx = minesIdxs.pop()
        gMinesIdxs.push(idx)
        var putMine = board[idx.i][idx.j]
        if(putMine.isMine === true) continue
        if(putMine.isShow === true) continue
        else {
        putMine.isMine = true
        putMine.minesAroundCount = MINE
        mineCount--
        }
    } return board
}

function restartGame() {
    onInit(gLevel.size, gLevel.size)
    var elRestartBtn = document.querySelector(".restartBtn")
    elRestartBtn.innerHTML = '😁'
}



function giveHint() {
   if(gGame.hints > 0) {
        var elImg = document.querySelector('.hints')
        elImg.innerHTML = '<img src="css/img/hint2.png">' 
        gHintClick = true
        
    } else if (gGame.hints === 0){
        var elImg = document.querySelector('.hints')
        elImg.innerHTML = '<img src="css/img/hint3.png">'
    }
}

function checkEndOfGame(board) {
    var elRestartBtn = document.querySelector(".restartBtn")
    // check for lose
    if(gGame.lives === 0) {
        gGame.isOn = false
        elRestartBtn.innerHTML = '🤯'
        stopTimer()
        console.log('game over, out of lives...');
        return
    }

    //check for win
    if(gGame.markedCount === gLevel.mines && gGame.shownCount + gGame.markedCount === (board.length * board.length)) {
        gGame.isOn = false

        elRestartBtn.innerHTML = '😎'
        console.log('win from 1');
        stopTimer()
        return
    }
}

function safeClick() {
    if(!gGame.isOn) return
    if(gGame.safeClicks > 0) {
        gGame.safeClicks--
        var safeCell = findEmptyCell(gBoard)
        console.log(safeCell);

        var elCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
        elCell.classList.add('safe-clicked')
        
        setTimeout(() => elCell.classList.remove('safe-clicked'), 2000)

        var elSafeBtn = document.querySelector('.safe-click')
        elSafeBtn.innerHTML = `${gGame.safeClicks} <br> Safe Clicks`

    }
    else return
}

function manuallySetMines() {
    if(!gFirstClick) return
    
    var elBtn = document.querySelector('.custom-mode')
    elBtn.classList.add('safe-clicked')

    gManuallMines = true

}

function undo() {
    var currMoveUndo = gSavedMoves.pop()

    console.log(gSavedMoves[gSavedMoves.length -1]);
    console.log(gSavedMoves[gSavedMoves.length -2]);

    gBoard = currMoveUndo.board
    gGame.markedCount = currMoveUndo.markedCount
    gGame.shownCount = currMoveUndo.shownCount

    renderBoard(gBoard)
    cellsUndo(gBoard)

}

function megaHint() {
    if(gGame.megaHint < 1) return
    gMegaHint = true
}

function exterminator() {
    var minesIdxs = shuffle(gMinesIdxs)
    

    for(var i = 0; i < 3; i++) {
        var currMine = minesIdxs.pop()

        gBoard[currMine.i][currMine.j].isMine = false
        gBoard[currMine.i][currMine.j].minesAroundCount =' '
        gLevel.mines--
    }
    renderBoard(setMinesNegsCount(gBoard))
}