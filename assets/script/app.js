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

const start = select('.start');
const time = select('.time');
const info = select('.info');
const hits = select('.hits span');
const myWord = select('.my-word');
const input = select('.input');

let seconds = 10;
let randomIndex = Math.floor(Math.random() * 120);
let hitNum = 0;

time.innerText = seconds;

function updateTime() {
    seconds--;
    time.innerText = seconds;
}

function playSound() {
    sound.play();
}

// setInterval(playSound, 1000);

function addNewWord() {
    let index = randomIndex;
    myWord.innerText = `${words[index]}`;
    words.splice(index, 1);
}

onEvent('click', start, () => {
    playSound();
    const checkTime = setInterval(updateTime, 1000);
    addNewWord();
    if (time.innerText === 0) clearInterval(checkTime);
});

function gameOver() {
    if (time.innerText === '0') {
        clearInterval()
        clearInterval(checkInput);
        resultContent.innerText = 'Game Over';
        result.classList.remove('hidden');
        result.classList.add('visible');
        background.classList.add('bg-blur');
    }

}

function wordHit() {
    gameOver();
    let userWord = input.value;
        if (userWord === myWord.innerText) {
        if (userWord !== '' && myWord.innerText !== '') {
            hitNum++;
            hits.innerText = hitNum;
            input.value = '';
            addNewWord();
        }
    }
}

const checkInput = setInterval(wordHit, 1000)



const result = select('.result');
const background = select('.background');
const secretNum = select('.result p');
const resultContent = select('.result h1');

onEvent('load', window, () => {
    // input.value = '';
    result.classList.add('hidden');
});
