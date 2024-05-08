'use strict'
const MINE = '💣'
const EMPTY = ' '


var gboard




function onInit() {
   gboard = buildBoard(4, 4)
   renderBoard(gboard)
   setMinesNegsCount(gboard)
   console.table(gboard)
}

function buildBoard(rows, cols) {
    const board = []
    for (let i = 0; i < rows; i++) {
        const row = []
        for(var j = 0; j < cols; j++){
            row.push(EMPTY)
        }
        board.push(row)
    } return board
}
function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ""

    for(var i = 0; i < board.length; i++) {
        strHTML += "<tr>\n"
        for(var j = 0; j < board[i].length; j++){
            var currCell = board[i][j]

            var cellClass = getClassName({i, j})

            if(i !== 2){
                // currCell = EMPTY
                cellClass += 'empty'
                strHTML += `\t<td class="cell ${cellClass}" onclick="reveal(${i},${j})">`
                board[i][j] = EMPTY
                strHTML += EMPTY
            } 
            else {
                // currCell = MINE
                cellClass += 'mine'
                strHTML += `\t<td class="cell ${cellClass}" onclick="reveal(${i},${j})">`
                board[i][j] = MINE
                strHTML += MINE
            }


            strHTML += "</td>\n"
        }
        strHTML += "</tr>\n"
    }
    elBoard.innerHTML = strHTML
}

function getClassName(position) {
    const cellClass = `cell-${position.i}-${position.j}`
    return cellClass
}

function setMinesNegsCount(board) {
    var minesNegsCount = 0
    for(var i = 0; i < board.length; i++){
        minesNegsCount = 0 
        for(var j = 0; j < board.length; i++) {
                for(var d = i - 1; d <= i + 1; d++) {
                if(d < 0 || d >= board.length) continue
                for(var l = j - 1; l <= j + 1; l++) {
                    if(d === i && l === j) continue
                    if(l < 0 || l >= board[0].length) continue
                        var currCell = board[d][l]
                        if(currCell === MINE) minesNegsCount++
                        if(minesNegsCount <= 0) minesNegsCount = EMPTY
                        else minesNegsCount = minesNegsCount
                        if(board[i][j] === MINE) continue
                        else {
                        board[i][j] = minesNegsCount
                        }
                    }
                }
        }
    } renderBoard(board)
}

// function setMinesNegsCount() {
//     var minesNegsCount = 0
//     for(var i = 0 )
// }

 