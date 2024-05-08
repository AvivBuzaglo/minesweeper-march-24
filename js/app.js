'use strict'

const MINE = '💣'
const EMPTY = ' '

var gBoard
var gFirstClick = true
var gHintClick = false
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
    hints: 3
}

function onInit(rows, cols) {
    gBoard = buildBorad(rows, cols)
    renderBoard(gBoard)
    resetValues()
    gLevel.size = rows
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
            if(i === rowIdx && j === colIdx) cellClass = "show" 
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
    if(gHintClick && !gFirstClick) {
        gHintClick = false
        gGame.hints--
        hintAddShow(i, j)
        setTimeout(() => hintRemoveShow(i, j), 1000)

        var elImg = document.querySelector('.hints')
        elImg.innerHTML = '<img src="css/img/hint1.png">'

        return
    }
    
    if(gFirstClick) {
        gIntervalId = setInterval(timer, 10)
        gFirstClick = false
        gBoard[i][j].isShow = true
        gGame.shownCount++
        addMinesIdx(gBoard, gLevel.size)
        renderBoard(setMinesNegsCount(gBoard), i, j)
        return
    } 
    if(gBoard[i][j].isMine) {
        var elLives = document.querySelector(".lives")
        var hearts
        gGame.lives--
        gLevel.mines--

        hearts = (gGame.lives > 1) ? '❤️❤️' : '❤️'
        if(gGame.lives < 1) hearts = '💥' 
        
        elCell.classList.add("show")
        elLives.innerHTML = `Lives: ${hearts}`
        checkGameOver(gBoard)
        if(gLevel.mines < 1) checkGameOver(gBoard)
    }
    else {    
        gBoard[i][j].isShow = true
        gGame.shownCount++
        elCell.classList.add("show")
        
        if(gBoard[i][j].isMarked === true) {
            gBoard[i][j].isMarked = false
            elCell.classList.remove("flag")
            if(gBoard[i][j].isMine) gGame.markedCount--
        }  
    } 
    checkGameOver(gBoard)
    checkWin(gBoard)
}


function onRightClick(elCell, i, j) {
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
    checkGameOver(gBoard)
    checkWin(gBoard)
}


function checkGameOver(board) {
    var elRestartBtn = document.querySelector(".restartBtn")
    if(gGame.markedCount === gLevel.mines && (gGame.shownCount - gLevel.mines) === (board.length*board.length) - gLevel.mines) {
        gGame.isOn = false
        elRestartBtn.innerHTML = '🤯'
        stopTimer()
        console.log('game over from 1');
    }
    if(gGame.lives === 0) {
        gGame.isOn = false
        elRestartBtn.innerHTML = '🤯'
        stopTimer()
        console.log('game over from 2');
    }
    if(gLevel.mines === 0 && gGame.lives === 0 || gLevel.mines === 0 && gGame.lives < 2 && gLevel.size === 4) {
        gGame.isOn = false
        elRestartBtn.innerHTML = '🤯'
        stopTimer()
        console.log('game over from 3');
    }
    if(board.length === 4 && gGame.lives === 1) {
        gGame.isOn = false
        elRestartBtn.innerHTML = '🤯'
        stopTimer()
        console.log('game over from 4');
    }
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

    var minesIdxs = createArr(board)
    while(mineCount !== 0) {
        var idx = minesIdxs.pop() 
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

function checkWin(board) {
    if(gGame.markedCount === gLevel.mines && gGame.lives > 0) {
        gGame.isOn = false

        var elRestartBtn = document.querySelector(".restartBtn")
        elRestartBtn.innerHTML = '😎'
        console.log('win from 1');
        stopTimer()
    }
    if(gGame.shownCount - gLevel.mines === board.length * board[0].length) {
        gGame.isOn = false

        var elRestartBtn = document.querySelector(".restartBtn")
        elRestartBtn.innerHTML = '😎'
        console.log('win from 2');
        stopTimer()
    }

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

