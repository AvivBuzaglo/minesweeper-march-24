'use strict'

const MINE = '💣'
const EMPTY = ' '

// var gMatrix = [
//     [EMPTY, EMPTY, MINE, EMPTY],
//     [EMPTY, EMPTY, EMPTY, EMPTY], 
//     [EMPTY, MINE, EMPTY, EMPTY],
//     [EMPTY, EMPTY, EMPTY, EMPTY]
// ]
var gBoard

function onInit() {
    // setMinesNegsCount(gMatrix)
    // renderBoard(setMinesNegsCount(gMatrix))
    gBoard = buildBorad(4, 4)
    renderBoard(setMinesNegsCount(gBoard))
    console.log(gBoard)
}

function buildBorad(rows = 4, cols = 4) {
    const BOARD = createMat(rows, cols)
    var mineCount
    if(rows === 4) mineCount = 2
    else if(rows === 8) mineCount = 14
    else if(rows === 12) mineCount = 32

    for(var i = 0; i < BOARD.length; i++) {
        for(var j = 0; j < BOARD[i].length; j++) {
            BOARD[i][j] = {
                minesAroundCount: null,
                isShow: false,
                isMine: false,
                isMarked: false
            }       
        }
    } 
    var minesIdxs = getMineIdxs(rows, BOARD)
    while(mineCount !== 0) {
        var idx = minesIdxs.pop() 
        var putMine = BOARD[idx.i][idx.j]
        if(putMine.isMine === true) continue
        else {
            putMine.isMine = true
            putMine.minesAroundCount = MINE
            mineCount--
        }
    } return BOARD

} 


function renderBoard(board) {
    var strHTML = ''
    for(var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for(var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j].minesAroundCount
            var cellClass = (board[i][j].isMine === true) ? 'mine' : ''
            var cellPosClass = getClassName({i, j})
            var cellData = `data="cell-${i}-${j}"`
            strHTML += `
            <td class="cell ${cellClass} ${cellPosClass}" ${cellData} onclick="onCellClick(this, ${i}, ${j})">
            ${currCell}
            </td>
            ` 
        }
        strHTML += '</tr>'
    }
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    console.log(strHTML);
}

function setMinesNegsCount(board) {
    // var mineNegsCount = 0
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
    elCell.classList.add("show")
}

// function renderCell(i, j) {
//     var elCell = document.querySelector(`[data=cell-${i}-${j}]`)
    
//     elCell.innerHTML = `${elCell}`
// }

function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}

function getMineIdxs(num, board) {
    var mineCount 
    var mineIdxs = []
    if(num === 4) mineCount = 2
    else if(num === 8) mineCount = 14
    else if(num === 12) mineCount = 16
    
    for(var i = 0; i <= mineCount; i++) {
        var emptyCell = findEmptyCell(board)
        mineIdxs.push({i: emptyCell.i , j: emptyCell.j})
    } return mineIdxs
}