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

const sound = new Audio('./assets/audio/game-sound.mp3');
sound.type = 'audio/mp3';

const soundTwo = new Audio('./assets/audio/right.mp3');
soundTwo.type = 'audio/mp3';

const SECOND_IN_MILLISECONDS = 1000;

const start = select('.start');
const time = select('.time');
const hits = select('.hits span');
const myWord = select('.my-word');
const input = select('.input');
const result = select('.result');
const background = select('.background');
const resultContent = select('.result h1');
const restart = select('.restart');
const scoreBtn = select('.score-btn');
const dialog = select('dialog');
const instruction = select('.instruction');

let seconds = 60;
let hitNum = 0;

time.innerText = `${seconds}`;

function continuePlaying() {
    if (sound.paused) {
        sound.play();
    }
}

onEvent('load', window, () => {
    input.value = '';
    restart.classList.add('hidden');
    result.classList.add('hidden');
    input.setAttribute('disabled', '');
});

function updateTime() {
    seconds--;
    time.innerText = `${seconds}`;
    continuePlaying();
}

function randomIndex(length) { 
    return Math.floor(Math.random() * length);
}

let copy = [...words];

function addNewWord() {
    let index = randomIndex(copy.length);
    myWord.innerText = `${copy[index]}`;
    copy.splice(index, 1);
}

function removeHidden() {
    restart.classList.remove('hidden');
    start.classList.add('hidden');
}

let checkTime;
let checkInput;

function setIntervals() {
    checkTime = setInterval(updateTime, SECOND_IN_MILLISECONDS);
    checkInput = setInterval(wordHit, 1);
}

onEvent('click', start, () => {
    input.removeAttribute('disabled', '');
    scoreBtn.style.display = 'none';
    input.focus();
    sound.play();
    setIntervals();
    addNewWord();
    removeHidden();
    instruction.innerText = `Ready to become the new champion?`;
});

function hit() {
    hitNum++;
    hits.innerText = hitNum;
    input.value = '';
    addNewWord();
}

function wordHit() {
    gameOver();
    let userWord = input.value;
        if (userWord.toLowerCase().trim() === myWord.innerText) {
        if (userWord !== '' && myWord.innerText !== '') {
            soundTwo.play();
            hit();
        }
    }
}

function addGameOver() {
    resultContent.innerText = 'Game Over';
    result.classList.remove('hidden');
    background.classList.add('bg-blur');
}

let scores = getScoresFromStorage();
let score;
let date;
let percentage;

function setScoreObj() {
    score = hitNum;
    date = new Date().toDateString();
    percentage = ((score / words.length) * 100).toFixed(1) ;
    scores.push({
        'score': score,
        'percentage': `${percentage}%`,
        'date': date
    });
}

function sortArray(arr) {
    return arr.toSorted((a, b) => b.score - a.score).splice(0, 9);
}

function getScoresFromStorage() {
    let storedScores = localStorage.getItem('scores');
    return storedScores ? JSON.parse(storedScores) : [];
}

function storeInLocalStorage() {
    let arrayOfScores = sortArray(scores);
    localStorage.setItem('scores', JSON.stringify(arrayOfScores));
}

let resultParagraphs;

function createParagraphs(obj, parag) {
    for (const prop in obj) {
        parag = create('p');
        parag.innerText = `${prop}: ${obj[prop]}`;
        result.appendChild(parag);
    }
}

function displayData() {
    setScoreObj();
    storeInLocalStorage();
    let obj = scores[scores.length - 1];
    let parag;
    resultParagraphs = selectAll('.result p');
    createParagraphs(obj, parag);
    resultParagraphs.forEach(parag => parag.remove());
}

let storedScores;

function createHighScores(num) {
    storedScores.forEach(obj => {
        let parag1 = create('p');
        let parag2 = create('p');
        let parag3 = create('p');
        let box = create('div');
        parag1.innerText = `#${num}`;
        parag2.innerText = `${obj.score} words`;
        parag3.innerText = `${obj.date}`;
        num++;
        [parag1, parag2, parag3].forEach(ele => {
            box.appendChild(ele);
            if (box.childElementCount == 3) dialog.appendChild(box);
        });
    });   
}

function appendScoresInfo() {
    storedScores = JSON.parse(localStorage.getItem('scores'));
    let count = 1;
    createHighScores(count);   
}

let noInfoIsAdded = false;

function noInfo() {
    if (!scores.length > 0 && !noInfoIsAdded) {
        let parag = create('p');
        parag.innerText =  'No games have been played';
        dialog.appendChild(parag);
        noInfoIsAdded = true;
    }
}

function clearDialog() {
    let pElements = dialog.querySelectorAll('dialog p');
    if (pElements.length > 0) {
        pElements.forEach(ele => ele.remove());
    }
}

function scoreBoardInfo() {
    if (scores.length > 0) {
        clearDialog();
        appendScoresInfo();
    } else {
        noInfo();
    }
}

let checkInputCleared;

function clearIntervals() {
    clearInterval(checkInput);
    clearInterval(checkTime);
}

function gameOverFns() {
    input.value = '';
    displayData();
    clearIntervals();
    addGameOver();
    sound.pause();
    checkInputCleared = true;
    scoreBtn.style.display = 'block';
}

function gameOver() {
    if (seconds === 0) {
        gameOverFns();
    }
}

function removeGameOver() {
    result.classList.add('hidden');
    background.classList.remove('bg-blur');
    resultContent.innerText = '';
}

function resetGame() {
    removeGameOver();
    copy = [...words];
    input.value = '';
    hitNum = 0;
    hits.innerText = hitNum;
    resetIntervals();
    addNewWord();
    scoreBtn.style.display = 'none';
}

function resetIntervals() {
    seconds = 20;
    time.innerText = `${seconds}`;
    if (checkInputCleared) checkInput = setInterval(wordHit, 1);
    checkTime = setInterval(updateTime, SECOND_IN_MILLISECONDS);
    sound.play();
    checkInputCleared = false;
}

onEvent('click', restart, () => {
    clearInterval(checkTime);
    resetGame();
    input.focus();
});

onEvent('click', scoreBtn, () => {
    scoreBoardInfo();
    noInfo();
    dialog.showModal();
});

onEvent('click', dialog, function(e) {
    const rect = this.getBoundingClientRect();

    if (e.clientY < rect.top || e.clientY > rect.bottom || 
        e.clientX < rect.left || e.clientX > rect.right) {
        dialog.close();
    }
});