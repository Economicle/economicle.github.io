let currentRow = 0;
const maxGuesses = 6;
let answerData;
let answer;
let board = [];

window.onload = function () {
    // Choose random term from economicsTerms list
    const idx = Math.floor(Math.random() * economicsTerms.length);
    answerData = economicsTerms[idx];
    answer = answerData.term.toLowerCase();
    document.getElementById("hint").innerText = `Hint: ${answerData.hint}`;

    // Create the game board - ensure we use the actual length of the term
    const wordLength = answer.length;
    
    // Set the grid template columns based on word length
    document.getElementById("board").style.gridTemplateColumns = `repeat(${wordLength}, 50px)`;
    
    for (let i = 0; i < maxGuesses; i++) {
        const row = [];
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `tile-${i}-${j}`;
            document.getElementById("board").appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }

    document.getElementById("guessInput").addEventListener("keydown", function (e) {
        if (e.key === "Enter") submitGuess();
    });
    
    // Update maxlength attribute to match the word length
    document.getElementById("guessInput").setAttribute("maxlength", wordLength);
};

function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toLowerCase();
    input.value = "";
    
    const wordLength = answer.length;

    if (guess.length !== wordLength) {
        showMessage(`Guess must be ${wordLength} letters.`);
        return;
    }

    // Check if the guess is a valid word (from wordList in words.js)
    // OR if it's in economicsTerms
    let isValidWord = wordList.includes(guess);
    
    // Also check if it's an eco term (for validation messages)
    let isEcoTerm = false;
    for (let i = 0; i < economicsTerms.length; i++) {
        if (economicsTerms[i].term.toLowerCase() === guess) {
            isEcoTerm = true;
            isValidWord = true; // Economics terms are always valid
            break;
        }
    }

    if (!isValidWord) {
        showMessage("Not a valid word.");
        return;
    }

    if (currentRow >= maxGuesses) return;

    const letters = answer.split('');
    const guessLetters = guess.split('');

    for (let i = 0; i < wordLength; i++) {
        const tile = board[currentRow][i];
        tile.textContent = guess[i];
        if (guess[i] === answer[i]) {
            tile.classList.add("correct");
            letters[i] = null;
        }
    }

    for (let i = 0; i < wordLength; i++) {
        const tile = board[currentRow][i];
        if (!tile.classList.contains("correct")) {
            const idx = letters.indexOf(guess[i]);
            if (idx !== -1) {
                tile.classList.add("present");
                letters[idx] = null;
            } else {
                tile.classList.add("absent");
            }
        }
    }

    if (guess === answer) {
        showMessage("Congratulations! 🎉");
        document.getElementById("guessInput").disabled = true;
    } else {
        currentRow++;
        if (currentRow === maxGuesses) {
            showMessage(`Game over! The term was "${answer.toUpperCase()}".`);
            document.getElementById("guessInput").disabled = true;
        }
    }
}

function showMessage(msg) {
    document.getElementById("message").innerText = msg;
}