'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

import { Score } from "./Score.js";

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

const sound = new Audio('./assets/audio/game-sound.wav');
sound.type = 'audio/wav';
sound.volume = 0.04;

const soundTwo = new Audio('./assets/audio/right.mp3');
soundTwo.type = 'audio/mp3';
soundTwo.volume = 0.07;


const scores = [];

const start = select('.start');
const time = select('.time');
const hits = select('.hits span');
const myWord = select('.my-word');
const input = select('.input');
const result = select('.result');
const background = select('.background');
const resultContent = select('.result h1');
const restart = select('.restart');
const SECOND_IN_MILLISECONDS = 1000;

let seconds = 90;
let hitNum = 0;

time.innerText = `${seconds}`;

onEvent('load', window, () => {
    input.value = '';
    restart.classList.add('hidden');
    result.classList.add('hidden');
    input.focus();
});

function updateTime() {
    seconds--;
    time.innerText = `${seconds}`;
    if (seconds === 0) {
        clearInterval(checkTime);
    }
}

let checkTime;

function timeInterval() {
    checkTime = setInterval(updateTime, SECOND_IN_MILLISECONDS);
}

function playSound() {
    sound.play();
}

let soundInterval;

function randomIndex(length) { 
    return Math.floor(Math.random() * length);
}

let copy = [...words];
function addNewWord() {
    let index = randomIndex(copy.length);
    myWord.innerText = `${copy[index]}`;
    copy.splice(index, 1);
}

let gameIsOn = false;

onEvent('click', start, () => {
    if (!gameIsOn) {
        soundInterval = setInterval(playSound, SECOND_IN_MILLISECONDS);
        input.focus();
        playSound();
        timeInterval();
        addNewWord();
    }
    gameIsOn = true;
});

function wordHit() {
    gameOver();
    let userWord = input.value;
        if (userWord.toLowerCase().trim() === myWord.innerText) {
        if (userWord !== '' && myWord.innerText !== '') {
            soundTwo.play();
            hitNum++;
            hits.innerText = hitNum;
            input.value = '';
            addNewWord();
        }
    }
}

let checkInput = setInterval(wordHit, 1);

function resetIntervals() {
    if (!gameIsOn) {
        seconds = 5;
        time.innerText = `${seconds}`;
        checkInput = setInterval(wordHit, 1);
        soundInterval = setInterval(playSound, SECOND_IN_MILLISECONDS);
        timeInterval();
    }
}

function removeGameOver() {
    resultContent.innerText = 'Game Over';
    start.classList.add('hidden');
    result.classList.remove('hidden');
    restart.classList.remove('hidden');
    background.classList.add('bg-blur');
}

function resetGame() {
    copy = [...words];
    result.classList.add('hidden');
    resultContent.innerText = '';
    input.value = '';
    background.classList.remove('bg-blur');
    hitNum = 0;
    hits.innerText = hitNum;
    resetIntervals();
    addNewWord();
    gameIsOn = true;
}

function createScore() {
    let percentage = Math.round(((hitNum / words.length)) * 100) ;
    let newScore = new Score(`${new Date().toDateString()}`, `${hitNum}`, `${percentage}%`);
    scores.push(newScore);
}

function getScoreObj() {
    let scoreObj = scores[scores.length - 1];
    const {date, hits, percentage} = scoreObj;
    return {
        Date: date,
        Username: 'Anonymous 001', 
        Hits: hits,
        Percentage: percentage,
    }
}

let resultParagraphs;

function displayData() {
    let obj = getScoreObj();
    let parag;
    resultParagraphs = selectAll('.result p');

    for (const prop in obj) {
        parag = create('p');
        parag.innerText = `${prop}: ${obj[prop]}`;
        result.appendChild(parag);
    }
    resultParagraphs.forEach(parag => parag.remove());
}

function gameOverFns() {
    createScore();
    displayData();
    input.value = '';
    clearInterval(checkInput);
    clearInterval(soundInterval);
    removeGameOver();
    sound.pause();
}

function gameOver() {
    gameIsOn = false;
    if (time.innerText === '0') {
        gameOverFns();

        onEvent('click', restart, () => {
            resetGame();
            input.focus();
        });
    }
}