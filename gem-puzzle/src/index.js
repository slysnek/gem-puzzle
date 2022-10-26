import "@babel/polyfill";
import './index.html';
import puzzleWrapper from './layout.html';
import './style.scss';
import './click.wav'

/*metadata*/
let gridSize = 16;
let width = 4;
let count = 0;
let previousSize;
let currentSize = 4;
let winCondition1 = []
let winCondition2 = []
let records = 0;


let isSaved = false;

if(localStorage.getItem('saved')){
    let isSavedString = localStorage.getItem('saved')
    if(isSavedString=='true'){
        isSaved = isSavedString;
    }
}

let audio = new Audio('audio/click.wav');
let soundOn = true;

/* timer data */
let startTime = 0;
let elapsedTime = 0;
let timeInterval;
let hours = 0;
let minutes = 0;
let seconds = 0;

function updateTime() {
    elapsedTime = Date.now() - startTime;

    seconds = Math.floor((elapsedTime / 1000) % 60);
    minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

    seconds = pad(seconds);
    minutes = pad(minutes);
    hours = pad(hours);
    const timeDisplay = document.querySelector('.timer')
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    function pad(timeUnit) {
        let unit = (("0") + timeUnit).length > 2 ? timeUnit : "0" + timeUnit;
            return unit;
    }
}

/*app logic functions*/
function initializeLayout(size) {
    const body = document.querySelector('body');
    body.innerHTML = puzzleWrapper;

    const grid = document.querySelector('.game-grid');
    const newGame = document.querySelector('.shuffle')
    const audioTumbler = document.querySelector('.sound')
    const size3 = document.querySelector('.size3')
    const size4 = document.querySelector('.size4')
    const size5 = document.querySelector('.size5')
    const size6 = document.querySelector('.size6')
    const size7 = document.querySelector('.size7')
    const size8 = document.querySelector('.size8')

    const save = document.querySelector('.save')
    const load = document.querySelector('.load')
    const autoWin = document.querySelector('.auto-win')

    console.log(isSaved);
    console.log(typeof isSaved);

    if(isSaved === false){
        load.classList.add('load-unavailable')
    } else{
        load.classList.remove('load-unavailable')
    }


    grid.classList.remove(`size-${previousSize}`)
    if (currentSize === 3) {
        grid.classList.remove('size-4')
    }
    grid.classList.add(`size-${size}`)

    let newEmptyTile = document.createElement('div');
    newEmptyTile.classList.add('game-tile', 'empty-tile')
    newEmptyTile.numValue = 0;
    newEmptyTile.textContent = "";
    grid.appendChild(newEmptyTile)

    for (let i = 1; i < gridSize; i++) {
        let newTile = document.createElement('div')
        newTile.classList.add('game-tile')
        newTile.numValue = i;
        newTile.textContent = i
        grid.appendChild(newTile)
    }

    const tile = document.querySelector('.game-tile');
    const emptyTile = document.querySelector('.empty-tile')

    /* event listeners */
    newGame.addEventListener('click', shuffleNumbers)
    autoWin.addEventListener('click', win)
    audioTumbler.addEventListener('click', changeSound)


    size3.addEventListener('click', () => {
        changeSize(3, true);
    })
    size4.addEventListener('click', () => {
        changeSize(4, true);
    })
    size5.addEventListener('click', () => {
        changeSize(5, true);
    })
    size6.addEventListener('click', () => {
        changeSize(6, true);
    })
    size7.addEventListener('click', () => {
        changeSize(7, true);
    })
    size8.addEventListener('click', () => {
        changeSize(8, true);
    })

    save.addEventListener('click', setLocalStorage)
    load.addEventListener('click', getLocalStorage)
    /* timer */
    newGame.addEventListener("click", () => {
        clearInterval(timeInterval, 1000)
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = `00:00:00`;
        elapsedTime = 0;
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(updateTime, 1000);
    });
    window.addEventListener('load', () => {
        clearInterval(timeInterval, 1000)
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = `00:00:00`;
        elapsedTime = 0;
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(updateTime, 1000);
    });
    /* sound fix */
    if (soundOn === false) {
        audioTumbler.textContent = "Sound: Off"
    } else {
        audioTumbler.textContent = "Sound: On"
    }
    /*saving data*/
    window.addEventListener('beforeunload', setLocalStorage)
    /*loading data*/
    if (localStorage.getItem('records')) {
        records = localStorage.getItem('records')
    }
    getRecord()
}

function shuffleNumbers() {
    updateCount(0, true)
    removeListeners()
    const newGame = document.querySelector('.shuffle')
    newGame.removeEventListener('click', shuffleNumbers)
    const emptyTile = document.querySelector('.empty-tile')

    const tileNumbers = document.querySelectorAll('.game-tile');

    clearInterval(timeInterval, 1000)
    const timeDisplay = document.querySelector('.timer')
    timeDisplay.textContent = `00:00:00`;
    elapsedTime = 0;
    startTime = Date.now() - elapsedTime;
    timeInterval = setInterval(updateTime, 1000);

    let randomNumbers = []
    for (let i = 0; i < tileNumbers.length; i++) {
        let randomNumber = Math.round(Math.random() * (tileNumbers.length - 1) + 1);
        while (randomNumbers.includes(randomNumber)) {
            randomNumber = Math.round(Math.random() * (tileNumbers.length - 1) + 1);
        }
        randomNumbers.push(randomNumber)
    }

    for (let i = 0; i < tileNumbers.length; i++) {
        tileNumbers[i].parentNode.insertBefore(tileNumbers[i], tileNumbers[randomNumbers[i]])
    }

    checkPositions();
    setTimeout(() => {
        newGame.addEventListener('click', shuffleNumbers)
    }, 250)
}

function checkPositions() {
    let tileNumber = []
    const tiles = document.querySelectorAll('.game-tile');
    const emptyTile = document.querySelector('.empty-tile')
    for (let i = 0; i < tiles.length; i++) {
        tileNumber.push(tiles[i].textContent);
    }

    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent == 0) {
            //just i because we count table from 0
            if (tiles[i - 1] !== undefined && (i) % width > 0) {//left from zero
                tiles[i - 1].classList.add('glow')
                setTimeout(() => {
                    tiles[i - 1].classList.remove('glow')
                }
                    , 150)

                tiles[i - 1].draggable = true;
                tiles[i - 1].addEventListener('click', moveRight)
                tiles[i - 1].addEventListener('dragstart', (event)=>{
                    event.dataTransfer.setData("Text", event.target.textContent);
                })
/*                 emptyTile.addEventListener('drop', (event) => {
                    event.preventDefault();
                    dragAndDrop(event, tiles[i - 1])
                })
                emptyTile.addEventListener('dragover', (event) => {
                    event.preventDefault();
                }) */

            }
            if (tiles[i + 1] !== undefined && (i + 1) % width > 0) {//right from zero
                tiles[i + 1].classList.add('glow')
                setTimeout(() => {
                    tiles[i + 1].classList.remove('glow')
                }
                    , 150)
                tiles[i + 1].addEventListener('click', moveLeft)
                tiles[i + 1].draggable = true;
                tiles[i + 1].addEventListener('dragstart', (event)=>{
                    event.dataTransfer.setData("Text", event.target.textContent);
                })
/*                 emptyTile.addEventListener('drop', (event) => {
                    event.preventDefault();
                    dragAndDrop(event, tiles[i+1])
                })
                emptyTile.addEventListener('dragover', (event) => {
                    event.preventDefault();
                }) */
            }
            if (tiles[i - width] !== undefined) {//up from zero
                tiles[i - width].classList.add('glow')
                setTimeout(() => {
                    tiles[i - width].classList.remove('glow')
                }
                    , 150)
                tiles[i - width].addEventListener('click', moveDown)
                tiles[i - width].draggable = true;
                tiles[i - width].addEventListener('dragstart', (event)=>{
                    event.dataTransfer.setData("Text", event.target.textContent);
                })
/*                 emptyTile.addEventListener('drop', (event) => {
                    event.preventDefault();
                    dragAndDrop(event, tiles[i - width])
                })
                emptyTile.addEventListener('dragover', (event) => {
                    event.preventDefault();
                }) */
            }
            if (tiles[i + width] !== undefined) {//down from zero
                tiles[i + width].classList.add('glow')
                setTimeout(() => {
                    tiles[i + width].classList.remove('glow')
                }
                    , 150)
                tiles[i + width].addEventListener('click', moveUp)
                tiles[i + width].draggable = true;
                tiles[i + width].addEventListener('dragstart', (event)=>{
                    event.dataTransfer.setData("Text", event.target.textContent);
                })

            }
        }
    }
    emptyTile.addEventListener('drop', (event) => {
        event.preventDefault();
        dragAndDrop(event)
    })
    emptyTile.addEventListener('dragover', (event) => {
        event.preventDefault();
    })
}

function updateCount(add = 1, reset) {
    const counter = document.querySelector('.count')
    count += add;
    if (reset) {
        count = 0;
    }
    counter.textContent = `Count: ${count}`;
}

function removeListeners() {
    const tiles = document.querySelectorAll('.game-tile')
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].parentNode.replaceChild(tiles[i].cloneNode(true), tiles[i])
    }
}
/*move functions*/
function moveRight(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateX(${tileWidth}px)`
            setTimeout(() => {
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i + 2])
            }, 100)
            setTimeout(() => {
                removeListeners()
            }, 110)
        }
    }
    setTimeout(() => {
        updateCount();
        playSound()
        checkPositions();
        checkIfWin()
    }, 120)
}
function moveLeft(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateX(${-tileWidth}px)`
            setTimeout(() => {
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i - 1])
            }, 100)
            setTimeout(() => {
                removeListeners()
            }, 110)
        }
    }
    setTimeout(() => {
        updateCount();
        playSound()
        checkPositions();
        checkIfWin()
    }, 120)
}
function moveDown(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateY(${tileWidth}px)`
            setTimeout(() => {
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i + width + 1])
                tiles[i + width].parentNode.insertBefore(tiles[i + width], tiles[i + 1])
            }, 100)
            setTimeout(() => {
                removeListeners()
            }, 110)
        }
    }
    setTimeout(() => {
        updateCount();
        playSound()
        checkPositions();
        checkIfWin()
    }, 120)
}
function moveUp(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateY(${-tileWidth}px)`
            setTimeout(() => {
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i - width])
                tiles[i - width].parentNode.insertBefore(tiles[i - width], tiles[i + 1])
            }, 100)
            setTimeout(() => {
                removeListeners()
            }, 110)
        }
    }
    setTimeout(() => {
        updateCount();
        playSound()
        checkPositions();
        checkIfWin()
    }, 120)
}

/*drag and drop movement*/
function dragAndDrop(event) {
    let data = event.dataTransfer.getData("Text");
    const tiles = document.querySelectorAll('.game-tile');

    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === data) {
            let tileWidth = tiles[i].offsetWidth;
            if (event.target === tiles[i + 1]) {
                console.log('num moving RIght');
                tiles[i].style.transform = `translateX(${tileWidth}px)`
                setTimeout(() => {
                    tiles[i].style.transform = "none"
                    //right
                    tiles[i].parentNode.insertBefore(tiles[i], tiles[i + 2])
                }, 100)
            } 
            else if(event.target === tiles[i - 1]){
                console.log('num moving left');
                tiles[i].style.transform = `translateX(${-tileWidth}px)`
                setTimeout(() => {
                    tiles[i].style.transform = "none"
                    //left
                    tiles[i].parentNode.insertBefore(tiles[i], tiles[i - 1])
                }, 100)
            }
            else if(event.target === tiles[i + width]){
                console.log('num moving down');
                tiles[i].style.transform = `translateY(${tileWidth}px)`
                setTimeout(() => {
                    tiles[i].style.transform = "none"
                    //down
                    tiles[i].parentNode.insertBefore(tiles[i], tiles[i + width + 1])
                    tiles[i + width].parentNode.insertBefore(tiles[i + width], tiles[i + 1])
                }, 100)
            }
            else if(event.target === tiles[i - width]){
                console.log('num moving up');
                tiles[i].style.transform = `translateY(${-tileWidth}px)`
                setTimeout(() => {
                    tiles[i].style.transform = "none"
                    //up
                    tiles[i].parentNode.insertBefore(tiles[i], tiles[i - width])
                    tiles[i - width].parentNode.insertBefore(tiles[i - width], tiles[i+1])
                }, 100)
            }

                setTimeout(() => {
                    removeListeners()
                }, 110)
            }
        }
        setTimeout(() => {
            updateCount();
            playSound()
            checkPositions();
            checkIfWin()
        }, 120)
    }


/*звуки*/
function changeSound() {
    const audioTumbler = document.querySelector('.sound')
    soundOn === true ? soundOn = false : soundOn = true;
    if (soundOn === false) {
        audioTumbler.textContent = "Sound: Off"
    } else {
        audioTumbler.textContent = "Sound: On"
    }
}
function playSound() {
    if (soundOn) {
        audio.play()
    }
}

/*change size*/
function changeSize(size, shuffle) {
    if (size === 3) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    if (size === 4) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    if (size === 5) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    if (size === 6) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    if (size === 7) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    if (size === 8) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        if (shuffle) {
            shuffleNumbers();
        }
    }
    setWinCondition()
}

/*storage*/
function setLocalStorage() {
    isSaved = true;
    const load = document.querySelector('.load')
    load.classList.remove('load-unavailable')
    console.log('saving...');
    const timeDisplay = document.querySelector('.timer')
    const tiles = document.querySelectorAll('.game-tile')
    const tileNums = []
    const numValues = []
    for (let i = 0; i < tiles.length; i++) {
        tileNums.push(tiles[i].textContent)
        numValues.push(tiles[i].numValue)
    }

    localStorage.setItem('time', timeDisplay.textContent);
    localStorage.setItem('count', count);
    localStorage.setItem('elapsedTime', elapsedTime)
    localStorage.setItem('startTime', startTime)
    localStorage.setItem('size', currentSize)
    localStorage.setItem('numValues', numValues)
    localStorage.setItem('tileNums', tileNums)
    localStorage.setItem('records', records)
    localStorage.setItem('saved', isSaved)
}
function getLocalStorage() {
    if (isSaved === false){
        return
    }
    console.log('loading..');
    if (localStorage.getItem('time')) {
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = localStorage.getItem('time');
    } else {
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = '00:00:00';
    }
    if (localStorage.getItem('size')) {
        changeSize(parseInt(localStorage.getItem('size')), false);
    }
    if (localStorage.getItem('tileNums')) {
        let tileNumsArr = localStorage.getItem('tileNums').split(',');
        const grid = document.querySelector('.game-grid')

        grid.innerHTML = ''

        for (let i = 0; i < tileNumsArr.length; i++) {
            if (tileNumsArr[i] === "") {
                let newEmptyTile = document.createElement('div');
                newEmptyTile.classList.add('game-tile', 'empty-tile')
                newEmptyTile.numValue = 0;
                newEmptyTile.textContent = "";
                grid.appendChild(newEmptyTile);
            } else {
                let newTile = document.createElement('div')
                newTile.classList.add('game-tile')
                newTile.numValue = tileNumsArr[i];
                newTile.textContent = tileNumsArr[i];
                grid.appendChild(newTile);
            }
        }
        checkPositions()
    }
    if (localStorage.getItem('count')) {
        count = parseInt(localStorage.getItem('count'));
        updateCount(0)
    }
    if (localStorage.getItem('elapsedTime')) {
        elapsedTime = parseInt(localStorage.getItem('elapsedTime'));
    }
    if (localStorage.getItem('startTime')) {
        startTime = parseInt(localStorage.getItem('startTime'));
    }
    clearInterval(timeInterval, 1000)
    if (localStorage.getItem('time')) {
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = localStorage.getItem('time');
    } else {
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = '00:00:00';
    }
    elapsedTime = parseInt(localStorage.getItem('elapsedTime'));;
    startTime = Date.now() - elapsedTime;
    timeInterval = setInterval(updateTime, 1000);
}
function setRecords(playerNumber, recordText) {
    localStorage.setItem(`playerRecords${playerNumber}`, recordText)
}
function getRecord() {
    for (let i = 1; i <= records; i++) {
        const leaderboard = document.querySelector('.leaderboard-table');
        let record = document.createElement('div');
        record.textContent = localStorage.getItem(`playerRecords${i}`)
        console.log(record.textContent);
        leaderboard.appendChild(record)
    }
    /*  while(localStorage.getItem(`playerRecords${i}`)){
 
     } */
}

/*win condition*/
function setWinCondition() {
    winCondition1 = []
    winCondition2 = []
    for (let i = 1; i < gridSize; i++) {
        winCondition1.push(i.toString())
        winCondition2.push(i.toString())
    }
    winCondition1.unshift('')
    winCondition2.push('')
    console.log(winCondition1);
    console.log(winCondition2);
}

function checkIfWin() {
    let tileNums = [];
    const tiles = document.querySelectorAll('.game-tile')
    for (let i = 0; i < tiles.length; i++) {
        tileNums.push(tiles[i].textContent)
    }
    let result = tileNums.length === winCondition1.length
        && tileNums.every((value, index) => value === winCondition1[index])
    if (result) {
        displayWin()
    }
}

function displayWin() {
    const body = document.querySelector('body')
    const winMessage = document.createElement('div')
    const timer = document.querySelector('.timer')
    const time = timer.textContent;
    const moveCount = count;

    winMessage.classList.add('win-message')
    if (count === 0) {
        winMessage.textContent = `Cheater! :P You solved the puzzle in ${time} and ${moveCount} moves!`
    } else {
        winMessage.textContent = `Hooray! You solved the puzzle in ${time} and ${moveCount} moves!`
    }

    body.appendChild(winMessage)
    clearInterval(timeInterval, 1000)
    setTimeout(() => {
        winMessage.remove()
    }, 3000)
    setTimeout(() => {
        let playerName = prompt('Enter your name:')
        if (playerName === null) {
            playerName = 'Anonimus'
        }
        setNewRecord(playerName, moveCount, time, currentSize)
    }, 1000)
}

function win() {
    count = 0;
    changeSize(currentSize)
    removeListeners()
    checkIfWin()
}

/*leaderboard*/
function setNewRecord(playerName, moveCount, time, size) {
    const leaderboard = document.querySelector('.leaderboard-table')
    let record = document.createElement('div')
    record.innerText = `${playerName} ---  ${moveCount} --- ${time} --- ${size}x${size}`
    leaderboard.appendChild(record)
    console.log(record.innerText);
    records++;
    localStorage.setItem('records', records)
    setRecords(records, record.innerText)
}

/*start app*/
initializeLayout();
shuffleNumbers();
setWinCondition()
checkIfWin()

