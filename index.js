var words = [
    'bananas',
    'grapes',
    'carousel',
    'milkshake',
    'javascript',
    'limousine',
    'chocolate',
    'programming', 
    'meatloaf',
    'ukulele',
    'mango'
  ];
  
var previousWord = ""
var remainingGuessesLeft = 10
var correctLetters = []
var incorrectLettersGuesses = []
var wins = 0
var losses = 0
var answer = false
var mysteryWord = document.getElementById("word-to-guess")
mysteryWord.textContent = ""
var previousWord = document.getElementById("previous-word")
var incorrectLetters = document.getElementById("incorrect-letters")
var remainingGuesses = document.getElementById("remaining-guesses")
remainingGuesses.textContent = remainingGuessesLeft
var amountOfWins = document.getElementById("wins")
var amountOfLosses = document.getElementById("losses")
var correctWord = words[Math.floor(Math.random() * words.length)]
var lettersGuessed = correctWord.length



var solvedWord = correctWord.split("")
for (i = 0; i < correctWord.length; i++) {
    solvedWord[i] = "_"
  }
  
var displayWord = solvedWord.join("")
  console.log(correctWord)
  mysteryWord.textContent = displayWord
  
  
// ***Game Code***
document.body.onkeyup = function(e){
  
var key = e.key.toLowerCase();
    console.log(e.key);
    if (
      incorrectLettersGuesses.includes(key) == false &&
      correctLetters.includes(key) == false) {

    for (i = 0; i < correctWord.length; i++) {
        if (correctWord[i] == key) {
          answer = true;
          lettersGuessed--;
          correctLetters.push(key);
          solvedWord[i] = key;
        }
    }

        if (answer == true) {
        displayWord = solvedWord.join("");
        mysteryWord.textContent = displayWord;
        
        if (lettersGuessed == 0) {
          wins++;
          amountOfWins.textContent = wins;
          previousWord.textContent = correctWord;
          mysteryWord.textContent = "";
          correctWord = words[Math.floor(Math.random() * words.length)];
          solvedWord = correctWord.split("");
  
        for (i = 0; i < correctWord.length; i++) {
            mysteryWord.textContent = mysteryWord.textContent + "_";
            solvedWord[i] = "_";
            remainingGuessesLeft = 10;
            displayWord = solvedWord.join("");
            console.log(correctWord);
            correctLetters = [];
            incorrectLettersGuesses = [];
            lettersGuessed = correctWord.length;
            incorrectLetters.textContent = "";
            remainingGuesses.textContent = remainingGuessesLeft;
            mysteryWord.textContent = displayWord;
          }
        }

    }else {
        incorrectLettersGuesses.push(key);
        remainingGuessesLeft--;
        remainingGuesses.textContent = remainingGuessesLeft;
        incorrectLetters.textContent = incorrectLettersGuesses;
    }
  
        if (remainingGuessesLeft == 0) {
            losses++;
            amountOfLosses.textContent = losses;
            previousWord.textContent = correctWord;
            mysteryWord.textContent = "";
            solvedWord = correctWord.split("");
  
        for (i = 0; i < correctWord.length; i++) {
            mysteryWord.textContent = mysteryWord.textContent + "_";
            solvedWord[i] = "_";
            remainingGuessesLeft = 10;
            displayWord = solvedWord.join("");
            console.log(correctWord);
            correctLetters = [];
            incorrectLettersGuesses = [];
            lettersGuessed = correctWord.length;
            incorrectLetters.textContent = "";
            remainingGuesses.textContent = remainingGuessesLeft;
            mysteryWord.textContent = displayWord;
            }
        }
    }

var answer = false;
}
  
  
  
  
  
      