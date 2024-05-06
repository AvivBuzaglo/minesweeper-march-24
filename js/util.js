'use strict'

function createMat(ROWS, COLS) {
	const mat = []
	for (var i = 0; i < ROWS; i++) {
		const row = []
		for (var j = 0; j < COLS; j++) {
			row.push('')
		}
		mat.push(row)
	}
	return mat
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}


function findEmptyCell(board) {
    var emptyCells = []
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            var currCell = board[i][j]
            if(currCell.minesAroundCount === EMPTY || currCell.minesAroundCount === null) {
                emptyCells.push({i: i, j: j})
            } 
        } 
    } shuffle(emptyCells)
    var emptyCell = emptyCells.pop()
    return emptyCell
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5)
    return array
}

function createArr(board) {
    var minesArr = []
    for(var i = 0; i < board.length; i++) { 
        for(var j = 0; j < board[i].length; j++) {
            minesArr.push({i: i, j: j})
        }
    } 
    shuffle(minesArr)    
    return minesArr
}