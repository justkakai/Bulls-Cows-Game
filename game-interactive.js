const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors');

let guessBox = document.getElementById('guessBox');

const numberLength = 4;
let number = "";
let bull = 0;
let cow = 0;
let round = 1;
let newPrompt = "";
let guess = "";
let level = "";
let restartGame = true;

console.clear();

let name = prompt(`Hi there! It's very nice to meet you :) My name is numGenerator. What's your name? `) || 'Stranger';

console.clear();

// checks if player enters only whitespace and replaces it with "Spaceman" if so.
if (/^\s*$/.test(name)) {
    name = name.trim() + "Spaceman";
} 

console.log(`Okay ${name.cyan}, let's get right into it, shall we?
\nThis game is called 🐂 Bulls & Cows 🐄, and the rules are quite simple.
\nI'll come up with a secret ${numberLength}-digit number every time you start a new round 🤫 The digits will all be unique and will be between 0 and 9.
\nYou try to guess the number and are given the number of matches after each guess. If the matching digits are in their right positions, they are "bulls", otherwise they are "cows". 
\nEXAMPLE:\nSecret number: 4271\nYour attempt: 1234\nAnswer: 1 bull and 2 cows (the bull is "2", the cows are "4" and "1")
\nThe goal is to guess the number (which is equivalent to getting 4 bulls) before you run out of remaining attempts.
\nYou also get to pick your difficulty level: 
\nEasy 👉 unlimited number of attempts\nDifficult 👉 5 attempts\nLet Me Decide 👉 you decide the number of attempts you'll get`)

// basically the game. 
while (restartGame === true) {
    let madeAttempts = 0;
    let attemptsAllowed = 0;
    round++;
    randomizedNumber(4);
    // asks player what mode they would like to play in
    console.log(`\nWhat mode would you like to play in?`);
    level = prompt(`(Enter 'e' for "Easy", 'd' for "Difficult", or 'l' for "Let Me Decide") `.bgMagenta.black);
    console.clear();

    // confirms mode selection and asks player to make first guess.
    while (level.toLowerCase() !== "l" && level.toLowerCase() !== "d" && level.toLowerCase() !== "e") { // 
        console.log(`Sorry, I didn't quite get that 🤔`);
        level = prompt(`Please enter 'e' for "Easy", 'd' for "Difficult", or 'l' for "Let Me Decide" `);
        console.clear();
    }

    if (level.toLowerCase() === "l") {
        console.log(`Okay ${name}, you're the boss here!`);
        attemptsAllowed = prompt(`How many guesses would you like to have? 👀 `);
        console.clear();

        while (parseInt(attemptsAllowed) < 1 || isNaN(Number(attemptsAllowed))) {
            attemptsAllowed = prompt(`Please enter a positive integer. `);
            console.clear();
        }
        if (attemptsAllowed === "1") {
            console.log(`Wow, brave! 💪 1 guess it is!`);
            guessBox.value = `What's the lucky number? `;
        } else {
            console.log(`${attemptsAllowed} guesses it is!`);
            guessBox.value = `What will your first one be? `;
        }

    } else if (level.toLowerCase() === "d") {
        attemptsAllowed = 5;
        console.log(`Alright, you get 5 attempts in difficult mode. Let the games begin!`);
        guessBox.value = `What will your first guess be? `;
    } else if (level.toLowerCase() === "e") {
        attemptsAllowed = Infinity;
        console.log(`To infinity we go! 🦸‍♀️`);
        guessBox.value = `What will your first guess be? `;
    }
    validationAndResult();

    // validates the player's guess and outputs result.
    function validationAndResult() {

        // checks if guess is an integer and greater than 0
        while (parseInt(guessBox.value) < 1 || isNaN(Number(guessBox.value))) { // 
            guessBox.value = `Please enter positive integers only. Try again? `;
            if (parseInt(guessBox.value) >= 1 || !isNaN(Number(guessBox.value))) {
                validationAndResult();
            }   
        } 

        // checks if all 4 numbers in the player's guess are unique
        while (new Set(guessBox.value).size !== guessBox.value.length) {
            guessBox.value = `All your digits must be unique. Guess again? `;
            if (new Set(guessBox.value).size === guessBox.value.length) {
                validationAndResult();
            }
        }

        // checks if the player's guess is 4 digits long
        while (guessBox.value.length !== numberLength) {
            guessBox.value = `Oops! Your guess must be ${numberLength} digits long. Try again? `;
            if (guessBox.value.length === numberLength) {
                validationAndResult();
            }
        }

        // if guess if correct, calls on the function exitOrContinue() where player chooses to either exit the game or play another round
        if (guessBox.value === number) {
            madeAttempts++
            console.log(`\n${guessBox.value} IS CORRECT! Congratulations ${name}, you champ! ✨ You guessed correct in just ${madeAttempts} tries!`.yellow);
            newPrompt = prompt(`Care for another round? (y/n) `);
            console.clear();
            exitOrContinue();

        } else {
            madeAttempts++;

            // if there are no more attempts left, randomizedNumber is revealed and player is asked to either exit the game or play another round
            if (madeAttempts >= attemptsAllowed) {
                console.log(`\nAww, that's all the attempts you have for now 😵 The number you were looking for was ${number}.`);
                newPrompt = prompt(`Would you like to play another round? (y/n) `);
                console.clear();
                exitOrContinue();

            // if there are still attempts remaining and player's guess is incorrect, number of bulls and cows is calculated and result outputted    
            } else {
                calculation();
                output();
            }
        }
    }

    // outputs number of bulls and cows and asks player to make next guess.
    function output() {
        if (attemptsAllowed === Infinity) {
            console.log(`\nYour guess: ${guessBox.value}`.magenta);
        } else {
            console.log(`\nYour guess: ${guessBox.value} | Attempts remaining: ${attemptsAllowed - madeAttempts}`.green);
        }
    
        if (bull === 0 && cow === 0) {
            guessBox.value = `0 bulls and 0 cows! ${displayRandomMessage()} What will your next guess be? `;
        } else {
            guessBox.value = `Bulls: ${bull} | Cows: ${cow}. What will your next guess be? `;
        }
        validationAndResult();
    }

    // asks player if they want to continue playing or exit the game
    function exitOrContinue() {
        while (newPrompt !== 'y' && newPrompt !== 'n') {
            console.log(`Sorry, I didn't quite get that 🤔`);
            newPrompt = prompt(`Please enter "y" for YES or "n" for N0 `);
            console.clear();
        }
        if (newPrompt === 'y') {
            restartGame = true;
            console.log(`Great! 🙌 On to round ${round}. I have a new number for you.`);
        } else if (newPrompt === 'n') {
            restartGame = false;
            console.log(`That's okay. Hope to see you again sometime soon 🙋‍♀️`);
        }
    }
}

// calculation of bulls and cows.
function calculation() {
    bull = 0;
    cow = 0;
    for (let i = 0; i < number.length; i++) {
        if (number[i] !== guessBox.value[i] && number.includes(guessBox.value[i])) {
            cow++;
        } else if (number[i] === guessBox.value[i]) {
            bull++;
        }
    }
}

// outputs a random message if player gets 0 bulls and 0 cows.
function displayRandomMessage() {
    const messageCollection = [`Aww, I still believe in you ${name}!`, `Holy cow! Or rather, holy lack of cows 😏`, `Looks like we're starving tonight 😩`, `Moooooo.`, `Oh no, what will the village think 🥴`];
    let randomIndex = Math.floor(Math.random() * messageCollection.length);
    let message = messageCollection[randomIndex];
    return message;
}

// generates a random number each time the player starts a new round/ game.
function randomizedNumber(numberLength) {
    number = "";
    let numbersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let randomNum = 0;
    for (let i = 0; i < numberLength; i++) {
        randomNum = Math.floor(Math.random() * numbersArray.length); 
        number = number + numbersArray.splice(randomNum, 1);
    }
    return number;
    //console.log(number);
}


/************************************************************************ MAKING IT INTERACTIVE ************************************************************************/


