import "@babel/polyfill";
import './index.html';
import puzzleWrapper from './layout.html';
import './style.scss';

let gridSize = 16;
let width = 4

class Tile {
    constructor(position, value, isClickable){
        this.position = position;
        this.value = value;
        this.isClickable = isClickable;
    }
}

function initializeLayout(){
    const body = document.querySelector('body');
    body.innerHTML = puzzleWrapper;

    const grid = document.querySelector('.game-grid');
    const tile = document.querySelector('.game-tile');
    const emptyTile = document.querySelector('.empty-tile')

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
}

function shuffleNumbers(){
    const tileNumbers = document.querySelectorAll('.game-tile');
    const emptyTile = document.querySelector('.empty-tile')
    console.log(tileNumbers.length);

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

}

function checkPositions(){
    let tileNumber = []
    const tiles = document.querySelectorAll('.game-tile');

    for (let i = 0; i < tiles.length; i++) {
        tileNumber.push(tiles[i].textContent);
    }

    console.log(tileNumber);
    console.log(tiles);

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

function moveRight(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            console.log('moved-right');
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i+2])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
}
function moveLeft(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            console.log('moved-left');
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i-1])
            event.target.removeEventListener('click', moveLeft)
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
}
function moveDown(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            console.log('moved-down');
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i+5])
            tiles[i+4].parentNode.insertBefore(tiles[i+4], tiles[i+1])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
}
function moveUp(event){
    const tiles = document.querySelectorAll('.game-tile');
    for (let i = 0; i < tiles.length; i++) {
        if(tiles[i] === event.target){
            console.log('moved-up');
            tiles[i].parentNode.insertBefore(tiles[i], tiles[i-4])
            tiles[i-4].parentNode.insertBefore(tiles[i-4], tiles[i+1])
            removeListeners()
            const emptyTile = document.querySelector('.empty-tile')
            emptyTile.addEventListener('mouseover', checkPositions)
        }
    }
}

function removeListeners(){
    const tiles = document.querySelectorAll('.game-tile')
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].parentNode.replaceChild(tiles[i].cloneNode(true), tiles[i])        
    }
}

function moveElement(event/* , tiles, firstIndx, secondIndx */){
    console.log(event.target);
/*     console.log('i worked');
    tiles[firstIndx].parentNode.insertBefore(tiles[firstIndx], tiles[secondIndx+1]) */
}


function changePositions(){

}

initializeLayout();
shuffleNumbers();
checkPositions();


const newGame = document.querySelector('.shuffle')
const check = document.querySelector('.check')
const emptyTile = document.querySelector('.empty-tile')

newGame.addEventListener('click', shuffleNumbers)

check.addEventListener('click', checkPositions)

emptyTile.addEventListener('mouseover', checkPositions)