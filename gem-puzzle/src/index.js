import "@babel/polyfill";
import './index.html';
import puzzleWrapper from './layout.html';
import './style.scss';
import './click.wav'

let gridSize = 16;
let width = 4;
let count = 0;
let previousSize;
let currentSize = 4;

/* timer */

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
        return (("0") + timeUnit).length > 2 ? timeUnit : "0" + timeUnit;
    }
}

let audio = new Audio('audio/click.wav');
let soundOn = true;


/* class Tile {
    constructor(position, value, isClickable) {
        this.position = position;
        this.value = value;
        this.isClickable = isClickable;
    }
} */

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

    audioTumbler.addEventListener('click', changeSound)


    size3.addEventListener('click', () => {
        changeSize(3);
    })
    size4.addEventListener('click', () => {
        changeSize(4);
    })
    size5.addEventListener('click', () => {
        changeSize(5);
    })
    size6.addEventListener('click', () => {
        changeSize(6);
    })
    size7.addEventListener('click', () => {
        changeSize(7);
    })
    size8.addEventListener('click', () => {
        changeSize(8);
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
    /*loading data*/
    window.addEventListener('beforeunload', setLocalStorage)
}

function shuffleNumbers() {
    updateCount(0, true)
    removeListeners()
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
}

function checkPositions() {
    let tileNumber = []
    const tiles = document.querySelectorAll('.game-tile');

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
                tiles[i - 1].addEventListener('click', moveRight)
            } else {
                console.log('ашипка влево');
            }

            if (tiles[i + 1] !== undefined && (i + 1) % width > 0) {//right from zero
                tiles[i + 1].classList.add('glow')
                setTimeout(() => {
                    tiles[i + 1].classList.remove('glow')
                }
                    , 150)
                tiles[i + 1].addEventListener('click', moveLeft)
            } else {
                console.log('ашипка вправо');
            }

            if (tiles[i - width] !== undefined) {//up from zero
                tiles[i - width].classList.add('glow')
                setTimeout(() => {
                    tiles[i - width].classList.remove('glow')
                }
                    , 150)
                tiles[i - width].addEventListener('click', moveDown)
            } else {
                console.log(tiles[i - 1]);
                console.log('ашипка вверх');
            }
            if (tiles[i + width] !== undefined) {//down from zero
                tiles[i + width].classList.add('glow')
                setTimeout(() => {
                    tiles[i + width].classList.remove('glow')
                }
                    , 150)
                tiles[i + width].addEventListener('click', moveUp)
            } else {
                console.log('ашипка вниз');
            }
        }
    }

}

function updateCount(add = 1, reset) {
    const counter = document.querySelector('.count')
    count += add;
    if (reset) {
        count = 0;
    }
    counter.textContent = `Count: ${count}`;
}
/*move functions*/
function moveRight(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateX(${tileWidth}px)`
            setTimeout(()=>{
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i + 2])
            },100)
            setTimeout(()=>{
                removeListeners()
            },110)
        }
    }
    setTimeout(()=>{
        updateCount();
        playSound()
        checkPositions();
    },120)
}
function moveLeft(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateX(${-tileWidth}px)`
            setTimeout(()=>{
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i - 1])
            },100)
            setTimeout(()=>{
                removeListeners()
            }, 110)
        }
    }
    setTimeout(()=>{
        updateCount();
        playSound()
        checkPositions();
    }, 120)
}
function moveDown(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
                let tileWidth = tiles[i].offsetWidth;
                tiles[i].style.transform = `translateY(${tileWidth}px)`
                setTimeout(()=>{
                    tiles[i].style.transform = "none"
                    tiles[i].parentNode.insertBefore(tiles[i], tiles[i + width + 1])
                    tiles[i + width].parentNode.insertBefore(tiles[i + width], tiles[i + 1])
                }, 100)
                setTimeout(()=>{
                    removeListeners()
                }, 110)
        }
    }
    setTimeout(()=>{
        updateCount();
        playSound()
        checkPositions();
    }, 120)
}
function moveUp(event) {
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] === event.target) {
            let tileWidth = tiles[i].offsetWidth;
            tiles[i].style.transform = `translateY(${-tileWidth}px)`
            setTimeout(()=>{
                tiles[i].style.transform = "none"
                tiles[i].parentNode.insertBefore(tiles[i], tiles[i - width])
                tiles[i - width].parentNode.insertBefore(tiles[i - width], tiles[i + 1])
            }, 100)
            setTimeout(()=>{
                removeListeners()
            },110)
        }
    }
    setTimeout(()=>{
        updateCount();
        playSound()
        checkPositions();
    },120)
}

function removeListeners() {
    const tiles = document.querySelectorAll('.game-tile')
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].parentNode.replaceChild(tiles[i].cloneNode(true), tiles[i])
    }
}

/*app logic*/
initializeLayout();
shuffleNumbers();

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
function changeSize(size) {
    if (size === 3) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if (size === 4) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if (size === 5) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if (size === 6) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if (size === 7) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if (size === 8) {
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
}

/*storage*/
function setLocalStorage() {
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
  }


function getLocalStorage() {
    console.log('loading..');
if(localStorage.getItem('time')) {
    const timeDisplay = document.querySelector('.timer')
    timeDisplay.textContent = localStorage.getItem('time');
}
/* if(localStorage.getItem('tileNums')){
    let tileNumsArr = localStorage.getItem('tileNums').split(',');
    console.log(tileNumsArr);
    const tiles = document.querySelectorAll('.game-tile')
    const emptyTile = document.querySelector('.empty-tile')
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].textContent = tileNumsArr[i]
        if(tiles[i].textContent === ''){
            emptyTile.parentNode.insertBefore(emptyTile, tiles[i])
        }        
    }
    

} */
if(localStorage.getItem('numValues')){
    let b = localStorage.getItem('numValues');
    console.log(b);
}
if(localStorage.getItem('size')) {
    changeSize(parseInt(localStorage.getItem('size')));
}
if(localStorage.getItem('count')) {
    count = parseInt(localStorage.getItem('count'));
    updateCount(0)
}
if(localStorage.getItem('elapsedTime')) {
    elapsedTime = parseInt(localStorage.getItem('elapsedTime'));
}
if(localStorage.getItem('startTime')) {
    startTime = parseInt(localStorage.getItem('startTime'));
}
    clearInterval(timeInterval, 1000)
    const timeDisplay = document.querySelector('.timer')
    timeDisplay.textContent = localStorage.getItem('time');
    elapsedTime = parseInt(localStorage.getItem('elapsedTime'));;
    startTime = Date.now() - elapsedTime;
    timeInterval = setInterval(updateTime, 1000);
}




