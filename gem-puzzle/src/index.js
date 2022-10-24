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

let audio = new Audio('audio/click.wav');
let soundOn = true;


class Tile {
    constructor(position, value, isClickable){
        this.position = position;
        this.value = value;
        this.isClickable = isClickable;
    }
}

function initializeLayout(size){
    const body = document.querySelector('body');
    body.innerHTML = puzzleWrapper;
    
    const grid = document.querySelector('.game-grid');
    
    const newGame = document.querySelector('.shuffle')
    const check = document.querySelector('.check')
    const audioTumbler = document.querySelector('.sound')

    const size3 = document.querySelector('.size3')
    const size4 = document.querySelector('.size4')
    const size5 = document.querySelector('.size5')
    const size6 = document.querySelector('.size6')
    const size7 = document.querySelector('.size7')
    const size8 = document.querySelector('.size8')

    grid.classList.remove(`size-${previousSize}`)
    grid.classList.add(`size-${size}`)

    let newEmptyTile = document.createElement('div');
    newEmptyTile.classList.add('game-tile', 'empty-tile')
    newEmptyTile.numValue = 0;
    newEmptyTile.textContent = 0;
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

    newGame.addEventListener('click', shuffleNumbers)
    newGame.addEventListener("click", () => {
        clearInterval(timeInterval, 1000)
        const timeDisplay = document.querySelector('.timer')
        timeDisplay.textContent = `00:00:00`;
        elapsedTime = 0;
        startTime = Date.now() - elapsedTime;
        timeInterval = setInterval(updateTime, 1000);
    });

    audioTumbler.addEventListener('click', changeSound)
    check.addEventListener('click', checkPositions)
    emptyTile.addEventListener('mouseover', checkPositions)

    size3.addEventListener('click', ()=>{
        changeSize(3);
    })
    size4.addEventListener('click', ()=>{
        changeSize(4);
    })
    size5.addEventListener('click', ()=>{
        changeSize(5);
    })
    size6.addEventListener('click', ()=>{
        changeSize(6);
    })
    size7.addEventListener('click', ()=>{
        changeSize(7);
    })
    size8.addEventListener('click', ()=>{
        changeSize(8);
    })

    let startTime = 0;
    let elapsedTime = 0;
    let timeInterval;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

function updateTime(){
    elapsedTime = Date.now() - startTime;
    console.log(elapsedTime);
    seconds = Math.floor((elapsedTime / 1000) % 60);
    minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60);

    seconds = pad(seconds);
    minutes = pad(minutes);
    hours = pad(hours);
    const timeDisplay = document.querySelector('.timer')
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    function pad(timeUnit){
        return (("0") + timeUnit).length > 2 ? timeUnit : "0" + timeUnit;
        
}
}

}

function shuffleNumbers(){
    updateCount(0, true)
    removeListeners()
    const emptyTile = document.querySelector('.empty-tile')
    emptyTile.addEventListener('mouseover', checkPositions)

    const tileNumbers = document.querySelectorAll('.game-tile');

    let randomNumbers = []
    for (let i = 0; i < tileNumbers.length; i++) {
        let randomNumber = Math.round(Math.random() * (tileNumbers.length - 1) + 1);
        while(randomNumbers.includes(randomNumber)){
            randomNumber = Math.round(Math.random() * (tileNumbers.length - 1) + 1);
        }
        randomNumbers.push(randomNumber)
    }

    for (let i = 0; i < tileNumbers.length; i++) {
        tileNumbers[i].parentNode.insertBefore(tileNumbers[i], tileNumbers[randomNumbers[i]])
    }
    
    checkPositions();
}

function checkPositions(){
    let tileNumber = []
    const tiles = document.querySelectorAll('.game-tile');

    for (let i = 0; i < tiles.length; i++) {
        tileNumber.push(tiles[i].textContent);
    }

    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i].textContent == 0){
                                            //just i because we count table from 0
                if(tiles[i-1] !== undefined && (i) % width > 0 ){//left from zero
                    tiles[i-1].classList.add('red')
                    setTimeout(() => {
                        tiles[i-1].classList.remove('red')}
                    , 150)
                    tiles[i-1].addEventListener('click', moveRight)
                } else {
                    console.log('ашипка влево');
                }

                if(tiles[i+1] !== undefined && (i+1) % width > 0 ){//right from zero
                    tiles[i+1].classList.add('red')
                    setTimeout(() => {
                        tiles[i+1].classList.remove('red')}
                    , 150)
                    tiles[i+1].addEventListener('click', moveLeft)
                } else {
                    console.log('ашипка вправо');
                }

                if(tiles[i-width] !== undefined){//up from zero
                    tiles[i-width].classList.add('red')
                    setTimeout(() => {
                        tiles[i-width].classList.remove('red')}
                    ,150)
                    tiles[i-width].addEventListener('click', moveDown)
                } else {
                    console.log(tiles[i-1]);
                    console.log('ашипка вверх');
                }
                if(tiles[i+width] !== undefined){//down from zero
                    tiles[i+width].classList.add('red')
                    setTimeout(() => {
                        tiles[i+width].classList.remove('red')}
                    ,150)
                    tiles[i+width].addEventListener('click', moveUp)
                } else {
                    console.log('ашипка вниз');
                }
            }
        }
    
}

function updateCount(add=1, reset){
    const counter = document.querySelector('.count')
    count+=add;
    if(reset){
        count = 0;
    }
    counter.textContent = `Count: ${count}`;
}
/*move functions*/
function moveRight(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i+2])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
    updateCount();
    playSound()
}
function moveLeft(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i-1])
            event.target.removeEventListener('click', moveLeft)
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
    updateCount();
    playSound()
}
function moveDown(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i+5])
            tiles[i+4].parentNode.insertBefore(tiles[i+4], tiles[i+1])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
    updateCount();
    playSound()
}
function moveUp(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i-4])
            tiles[i-4].parentNode.insertBefore(tiles[i-4], tiles[i+1])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
    updateCount();
    playSound()
}

function removeListeners(){
    const tiles = document.querySelectorAll('.game-tile')
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].parentNode.replaceChild(tiles[i].cloneNode(true), tiles[i])        
    }
}

/*app logic*/
initializeLayout();
shuffleNumbers();

/*звуки*/

function changeSound(){
    const audioTumbler = document.querySelector('.sound')
    soundOn === true ? soundOn = false : soundOn = true;
    if(soundOn === false){
        audioTumbler.textContent = "Sound: Off"
    } else{
        audioTumbler.textContent = "Sound: On"
    }
}

function playSound(){
    if(soundOn){
        audio.play()
    }
}

/*change size*/
function changeSize(size){
    if(size === 3){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if(size === 4){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if(size === 5){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if(size === 6){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if(size === 7){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
    if(size === 8){
        width = size;
        previousSize = currentSize;
        currentSize = size;
        gridSize = size * size
        const grid = document.querySelector('.game-grid')
        initializeLayout(size);
        shuffleNumbers();
    }
}