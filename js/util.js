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

function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}

function neighborsLopp(board, rowIdx, colIdx) {
    var neighbors = []

    for(var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if(i < 0 || i >= board.length) continue
        for(var j = colIdx - 1; j <= colIdx + 1; j++) {
            if(j < 0 || j >= board[0].length) continue
            
            var currCell = {i: i, j: j}
            neighbors.push(currCell)

        }
    } return neighbors
}

function hintAddShow(rowIdx, colIdx) {
    var neighbors = neighborsLopp(gBoard, rowIdx, colIdx)

    for(var n = 0; n <= neighbors.length - 1; n++) {
        var currCell = neighbors[n]
        var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)

        elCell.classList.add('hintShow')

        
    }
}

function hintRemoveShow(rowIdx, colIdx) {
    var neighbors = neighborsLopp(gBoard, rowIdx, colIdx)

    for(var n = 0; n <= neighbors.length - 1; n++) {
        console.log('im in');
        var currCell = neighbors[n]
        var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)
        
        elCell.classList.remove('hintShow')
    }
}

function timer() {
    var elTimer = document.querySelector('.timer')
    gTimer += 0.01
    elTimer.innerText = `|| Time: ${gTimer.toFixed(3)}`

    gGame.secsPassed = gTimer.toFixed(3)
}

function stopTimer(){
    if(gTimer === 0) return
    clearInterval(gIntervalId)
    saveBestTime(gTimer, gBoard)

    gTimer = 0

}

function resetValues() {
    stopTimerOnInit()
    gGame.isOn = true
    gFirstClick = true
    gHintClick = false
    
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = `|| Time: ${gTimer.toFixed(3)}`

    gGame.hints = 3
    var elImg = document.querySelector('.hints')
    elImg.innerHTML = '<img src="css/img/hint1.png">'
    
    gGame.lives = 3
    var elLives = document.querySelector(".lives")
    elLives.innerHTML = `Lives: ❤️❤️❤️`

    var elRestartBtn = document.querySelector(".restartBtn")
    elRestartBtn.innerHTML = '😁'

    var elScore_4x4 = document.getElementById('4x4-score')
    if(gBestScore_4x4)  elScore_4x4.innerText = `${gBestScore_4x4}` 
    else elScore_4x4.innerText = 'Didnt set a record yet...'

    var elScore_8x8 = document.getElementById('8x8-score')
    if(gBestScore_8x8) elScore_8x8.innerText = `${gBestScore_8x8}`
    else elScore_8x8.innerText = 'Didnt set a record yet...' 

    var elScore_12x12 = document.getElementById('12x12-score')
    if(gBestScore_12x12) elScore_12x12.innerText = `${gBestScore_12x12}`
    else elScore_12x12.innerText = 'Didnt set a record yet...'

    gGame.shownCount = 0
    gGame.markedCount = 0
}

function saveBestTime(time, board) {
    var currTime = time

    if(currTime < gBestScore_4x4 && board.length === 4 && gGame.lives > 0 || gBestScore_4x4 === undefined) {
        gBestScore_4x4 = currTime

        localStorage.setItem('4x4 Best score', `${gBestScore_4x4}`)
        return
    }
    if(currTime < gBestScore_8x8 && board.length === 8 && gGame.lives > 0 || gBestScore_8x8 === undefined) {
        gBestScore_8x8 = currTime

        localStorage.setItem('8x8 Best score', `${gBestScore_8x8}`)
        return
    }
    if(currTime < gBestScore_12x12 && board.length === 12 && gGame.lives > 0 || gBestScore_12x12 === undefined) {
        gBestScore_12x12 = currTime

        localStorage.setItem('12x12 Best score', `${gBestScore_12x12}`)
        return
    }


}

function stopTimerOnInit() {
    clearInterval(gIntervalId)
    gTimer = 0
}

