document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const textDisplay = document.getElementById('textDisplay');
    const textInput = document.getElementById('textInput');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const timeDisplay = document.getElementById('time');
    const restartBtn = document.getElementById('restartBtn');
    const newTextBtn = document.getElementById('newTextBtn');
    
    // Variables for tracking state
    let wordList = [];
    let currentIndex = 0;
    let startTime = null;
    let timerInterval = null;
    let correctCharacters = 0;
    let totalCharacters = 0;
    let isActive = false;
    
    // Common words for practice
    const commonWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 'it',
        'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but',
        'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will',
        'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
        'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
        'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into',
        'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
        'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
        'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 
        'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
        'most', 'us'
    ];
    
    // Generate random text for typing practice
    function generateRandomText(length = 50) {
        let result = [];
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * commonWords.length);
            result.push(commonWords[randomIndex]);
        }
        return result;
    }
    
    // Initialize the typing practice
    function initTypingPractice() {
        wordList = generateRandomText();
        currentIndex = 0;
        startTime = null;
        clearInterval(timerInterval);
        correctCharacters = 0;
        totalCharacters = 0;
        isActive = false;
        
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100%';
        timeDisplay.textContent = '0:00';
        
        displayText();
        textInput.value = '';
        textInput.focus();
    }
    
    // Display the text for typing
    function displayText() {
        textDisplay.innerHTML = '';
        wordList.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            if (index === currentIndex) {
                wordSpan.classList.add('current');
            }
            textDisplay.appendChild(wordSpan);
            
            // Add space after each word except the last one
            if (index < wordList.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.textContent = ' ';
                textDisplay.appendChild(spaceSpan);
            }
        });
    }
    
    // Start the timer
    function startTimer() {
        startTime = new Date();
        timerInterval = setInterval(updateTime, 1000);
    }
    
    // Update the timer display
    function updateTime() {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Update WPM
        if (timeElapsed > 0) {
            const wordsTyped = correctCharacters / 5; // Assuming 5 characters per word
            const wpm = Math.round((wordsTyped / timeElapsed) * 60);
            wpmDisplay.textContent = wpm;
        }
    }
    
    // Calculate accuracy
    function updateAccuracy() {
        if (totalCharacters === 0) return;
        const accuracy = Math.floor((correctCharacters / totalCharacters) * 100);
        accuracyDisplay.textContent = `${accuracy}%`;
    }
    
    // Handle the text input
    textInput.addEventListener('input', function(e) {
        const currentWord = wordList[currentIndex];
        const typedValue = textInput.value.trim();
        
        if (!isActive && typedValue.length > 0) {
            isActive = true;
            startTimer();
        }
        
        // If space is pressed, check the word
        if (e.data === ' ' && typedValue) {
            totalCharacters += currentWord.length + 1; // Add 1 for the space
            
            if (typedValue === currentWord) {
                correctCharacters += currentWord.length + 1; // Add 1 for the space
            }
            
            textInput.value = '';
            currentIndex++;
            
            if (currentIndex === wordList.length) {
                endTypingSession();
            } else {
                displayText();
            }
            
            updateAccuracy();
        }
    });
    
    // End the typing session
    function endTypingSession() {
        clearInterval(timerInterval);
        isActive = false;
        textInput.value = '';
        alert('Great job! You completed this typing exercise.');
    }
    
    // Event listeners for buttons
    restartBtn.addEventListener('click', function() {
        initTypingPractice();
    });
    
    newTextBtn.addEventListener('click', function() {
        initTypingPractice();
    });
    
    // Initialize on page load
    initTypingPractice();
});
