'use strict'

const MINE = '💣'
const EMPTY = ' '

var gBoard
var firstClick = true

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}

function onInit(rows, cols) {
    firstClick = true
    gBoard = buildBorad(rows, cols)
    renderBoard(gBoard)
    gGame.isOn = true
    gLevel.size = rows

    gGame.lives = 3
    var elLives = document.querySelector(".lives")
    elLives.innerHTML = `Lives: ❤️❤️❤️`
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
    if(firstClick) {
        firstClick = false
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


function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
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
    if(gGame.markedCount === gLevel.mines && (gGame.shownCount - gLevel.mines) === (board.length*board.length) - gLevel.mines) {
        gGame.isOn = false
        var elRestartBtn = document.querySelector(".restartBtn")
        elRestartBtn.innerHTML = '🤯'
        console.log('game over');
    }
    if(gGame.lives === 0) {
        gGame.isOn = false
        var elRestartBtn = document.querySelector(".restartBtn")
        elRestartBtn.innerHTML = '🤯'
        console.log('game over');
    }
    if(gLevel.mines === 0 && gGame.lives === 0 || gLevel.mines === 0 && gGame.lives < 2 && gLevel.size === 4) {
        gGame.isOn = false
        var elRestartBtn = document.querySelector(".restartBtn")
        elRestartBtn.innerHTML = '🤯'
        console.log('game over');
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
    }
    // add more options here tomorrow...
}