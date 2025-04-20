// Enhanced typing test with real-time character highlighting and more features

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textDisplay = document.getElementById('text-to-type');
    const userInput = document.getElementById('user-input');
    const startButton = document.getElementById('start-test');
    const resetButton = document.getElementById('reset-test');
    const newTextButton = document.getElementById('new-text');
    const wpmDisplay = document.getElementById('wpm-display');
    const accuracyDisplay = document.getElementById('accuracy-display');
    const timerDisplay = document.getElementById('timer-display');
    const errorsDisplay = document.getElementById('errors-display');
    const resultsPanel = document.getElementById('results-panel');
    const difficultySelect = document.getElementById('difficulty');
    const themeSelect = document.getElementById('theme');
    const textTypeSelect = document.getElementById('textType');
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    
    // Test State
    let testActive = false;
    let testText = '';
    let startTime = null;
    let timer = null;
    let charIndex = 0;
    let errorCount = 0;
    let typedChars = 0;
    let correctChars = 0;
    
    // Sample texts by category
    const textSamples = {
        common: [
            "The quick brown fox jumps over the lazy dog.",
            "Pack my box with five dozen liquor jugs.",
            "How vexingly quick daft zebras jump!",
            "Amazingly few discotheques provide jukeboxes.",
            "Sphinx of black quartz, judge my vow."
        ],
        quotes: [
            "Life is what happens when you're busy making other plans.",
            "The only way to do great work is to love what you do.",
            "In three words I can sum up everything I've learned about life: it goes on.",
            "Be yourself; everyone else is already taken.",
            "The future belongs to those who believe in the beauty of their dreams."
        ],
        code: [
            "function hello() { console.log('Hello, world!'); }",
            "for (let i = 0; i < array.length; i++) { sum += array[i]; }",
            "if (condition) { doSomething(); } else { doSomethingElse(); }",
            "const result = array.map(item => item * 2).filter(item => item > 10);",
            "try { riskyOperation(); } catch (error) { handleError(error); }"
        ],
        numbers: [
            "3.14159 2.71828 1.61803 0.57721 4.66920",
            "100% + 50% = 150%, but 100% - 50% = 50%.",
            "Phone: +1-555-123-4567, Code: #FF5733, Price: $19.99",
            "Chapter 7, Section 2.3, Figure 4-1, Table 9.5",
            "2^8 = 256, 2^10 = 1024, 2^16 = 65536"
        ]
    };
    
    // Initialize the keyboard
    function initializeKeyboard() {
        const layout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl']
        ];
        
        virtualKeyboard.innerHTML = '';
        
        layout.forEach(rowKeys => {
            const row = document.createElement('div');
            row.className = 'row';
            
            rowKeys.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.className = 'key';
                keyElement.dataset.key = key.toLowerCase();
                keyElement.textContent = key;
                
                // Add special classes for wider keys
                if (key === 'Backspace' || key === 'Enter' || key === 'Caps') {
                    keyElement.classList.add('wide');
                } else if (key === 'Shift' || key === 'Tab') {
                    keyElement.classList.add('wide');
                } else if (key === 'Space') {
                    keyElement.classList.add('space');
                }
                
                row.appendChild(keyElement);
            });
            
            virtualKeyboard.appendChild(row);
        });
    }
    
    // Generate text based on settings
    function generateText() {
        const difficulty = difficultySelect.value;
        const textType = textTypeSelect.value;
        
        // Select sample texts based on type
        const selectedSamples = textSamples[textType] || textSamples.common;
        
        // Randomly select text(s)
        let selectedText;
        
        if (difficulty === 'easy') {
            selectedText = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
        } else if (difficulty === 'medium') {
            // For medium difficulty, combine two samples
            const sample1 = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
            const sample2 = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
            selectedText = sample1 + ' ' + sample2;
        } else {
            // For hard difficulty, combine three samples or use custom text
            const sample1 = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
            const sample2 = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
            const sample3 = selectedSamples[Math.floor(Math.random() * selectedSamples.length)];
            selectedText = sample1 + ' ' + sample2 + ' ' + sample3;
        }
        
        return selectedText;
    }
    
    // Display text for typing
    function displayText(text) {
        textDisplay.innerHTML = '';
        testText = text;
        
        // Create spans for each character
        [...text].forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.className = 'char untouched';
            if (index === 0) {
                charSpan.classList.add('current');
                charSpan.classList.remove('untouched');
            }
            textDisplay.appendChild(charSpan);
        });
    }
    
    // Start the typing test
    function startTest() {
        if (testActive) return;
        
        // Generate and display text
        const text = generateText();
        displayText(text);
        
        // Reset variables
        testActive = true;
        charIndex = 0;
        errorCount = 0;
        typedChars = 0;
        correctChars = 0;
        
        // Update UI
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100%';
        errorsDisplay.textContent = '0';
        timerDisplay.textContent = '0:00';
        resultsPanel.style.display = 'none';
        userInput.value = '';
        userInput.disabled = false;
        userInput.focus();
        
        // Start timer
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);
        
        // Update button states
        startButton.disabled = true;
        resetButton.disabled = false;
    }
    
    // Reset the test
    function resetTest() {
        clearInterval(timer);
        testActive = false;
        textDisplay.innerHTML = '<span class="placeholder">Click "Start Test" to begin...</span>';
        userInput.value = '';
        userInput.disabled = true;
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100%';
        errorsDisplay.textContent = '0';
        timerDisplay.textContent = '0:00';
        resultsPanel.style.display = 'none';
        
        // Reset button states
        startButton.disabled = false;
        resetButton.disabled = true;
    }
    
    // End the test
    function endTest() {
        clearInterval(timer);
        testActive = false;
        userInput.disabled = true;
        
        // Calculate final stats
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        const wpm = Math.round(correctChars / 5 / timeElapsed); // WPM formula
        const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
        
        // Display results
        showResults(wpm, accuracy, errorCount, timeElapsed);
        
        // Save stats
        saveStats(wpm, timeElapsed, errorCount, Math.round(correctChars / 5));
        
        // Update button states
        startButton.disabled = false;
    }
    
    // Update timer
    function updateTimer() {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Calculate and update WPM
        if (elapsedSeconds > 0) {
            const elapsedMinutes = elapsedSeconds / 60;
            const wpm = Math.round((correctChars / 5) / elapsedMinutes);
            wpmDisplay.textContent = wpm;
        }
    }
    
    // Process user input
    function processInput(event) {
        if (!testActive) return;
        
        const chars = textDisplay.querySelectorAll('.char');
        const typedChar = event.key;
        
        // Handle typing
        if (typedChar.length === 1) {
            typedChars++;
            const correctChar = testText[charIndex];
            
            // Check if typed character matches the correct character
            const isCorrect = typedChar === correctChar;
            
            // Update character styling based on correctness
            chars[charIndex].classList.remove('current', 'untouched');
            chars[charIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
            
            // Highlight keyboard key
            highlightKey(typedChar, isCorrect);
            
            // Update error count
            if (!isCorrect) {
                errorCount++;
                errorsDisplay.textContent = errorCount;
            } else {
                correctChars++;
            }
            
            // Move to next character
            charIndex++;
            
            // Update accuracy
            updateAccuracy();
            
            // Check if test is complete
            if (charIndex >= testText.length) {
                endTest();
                return;
            }
            
            // Highlight the next character
            chars[charIndex].classList.add('current');
            chars[charIndex].classList.remove('untouched');
        } 
        // Handle backspace
        else if (event.key === 'Backspace' && charIndex > 0) {
            charIndex--;
            
            // Update styling for the current and previous characters
            chars[charIndex].classList.remove('correct', 'incorrect');
            chars[charIndex].classList.add('current');
            
            // If the next character exists, remove the current class
            if (chars[charIndex + 1]) {
                chars[charIndex + 1].classList.remove('current');
                chars[charIndex + 1].classList.add('untouched');
            }
            
            // Update stats if the character was incorrect
            if (chars[charIndex].classList.contains('incorrect')) {
                errorCount--;
                errorsDisplay.textContent = errorCount;
            } else if (chars[charIndex].classList.contains('correct')) {
                correctChars--;
            }
            
            // Update accuracy
            typedChars--;
            updateAccuracy();
            
            // Highlight backspace key
            highlightKey('backspace', true);
        }
    }
    
    // Highlight key on virtual keyboard
    function highlightKey(key, isCorrect) {
        // Clear previous highlights
        document.querySelectorAll('.key.highlight, .key.error').forEach(k => {
            k.classList.remove('highlight', 'error');
        });
        
        // Find the key element
        let keyElement;
        if (key === ' ') {
            keyElement = document.querySelector('.key[data-key="space"]');
        } else {
            keyElement = document.querySelector(`.key[data-key="${key.toLowerCase()}"]`);
        }
        
        // Highlight the key
        if (keyElement) {
            keyElement.classList.add(isCorrect ? 'highlight' : 'error');
            
            // Remove highlight after a short delay
            setTimeout(() => {
                keyElement.classList.remove('highlight', 'error');
            }, 200);
        }
    }
    
    // Update accuracy display
    function updateAccuracy() {
        const accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
        accuracyDisplay.textContent = `${accuracy}%`;
    }
    
    // Show test results
    function showResults(wpm, accuracy, errors, time) {
        resultsPanel.innerHTML = `
            <h2>Test Results</h2>
            <div class="results-grid">
                <div class="result-item">
                    <h3>Typing Speed</h3>
                    <p>${wpm} WPM</p>
                </div>
                <div class="result-item">
                    <h3>Accuracy</h3>
                    <p>${accuracy}%</p>
                </div>
                <div class="result-item">
                    <h3>Errors</h3>
                    <p>${errors}</p>
                </div>
                <div class="result-item">
                    <h3>Time</h3>
                    <p>${Math.floor(time * 60)}s</p>
                </div>
            </div>
            <div class="share-results">
                <button id="share-btn" class="secondary-btn">Share Results</button>
                <button id="retry-btn" class="primary-btn">Try Again</button>
            </div>
        `;
        
        resultsPanel.style.display = 'block';
        
        // Add event listeners to result buttons
        document.getElementById('share-btn').addEventListener('click', shareResults);
        document.getElementById('retry-btn').addEventListener('click', startTest);
    }
    
    // Save stats
    function saveStats(wpm, time, errors, words) {
        // Create a stat entry
        const statEntry = {
            date: new Date().toISOString(),
            wpm: wpm,
            accuracy: typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100,
            errors: errors,
            wordsTyped: words,
            timeSpent: time
        };
        
        // Get existing stats or initialize empty array
        let stats = JSON.parse(localStorage.getItem('typingStats')) || [];
        
        // Add new stats
        stats.push(statEntry);
        
        // Save to local storage
        localStorage.setItem('typingStats', JSON.stringify(stats));
        
        // Also update user profile if available
        if (typeof updateUserProfile === 'function') {
            updateUserProfile({
                highScore: Math.max(wpm, userProfile.highScore || 0),
                typingSpeed: wpm
            });
        }
    }
    
    // Share results
    function shareResults() {
        const wpm = wpmDisplay.textContent;
        const accuracy = accuracyDisplay.textContent;
        const text = `I just scored ${wpm} WPM with ${accuracy} accuracy on Typing Practice! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Typing Test Results',
                text: text,
                url: window.location.href
            })
            .catch(error => console.log('Error sharing: ', error));
        } else {
            // Fallback for browsers that don't support sharing
            prompt('Copy this text to share your results:', text);
        }
    }
    
    // Apply theme
    function applyTheme(themeName) {
        document.body.className = themeName === 'dark' ? 'dark-theme' : '';
        
        if (themeName === 'solarized') {
            document.body.classList.add('solarized-theme');
        }
    }
    
    // Event Listeners
    startButton.addEventListener('click', startTest);
    resetButton.addEventListener('click', resetTest);
    newTextButton.addEventListener('click', () => {
        if (testActive) {
            if (confirm('Are you sure you want to reset the current test?')) {
                resetTest();
                startTest();
            }
        } else {
            startTest();
        }
    });
    
    // Listen for keypresses for typing test
    document.addEventListener('keydown', function(event) {
        // Prevent default action for all keys during test
        if (testActive && document.activeElement === userInput) {
            // Only prevent default for navigation keys, not typing keys
            if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
            }
            
            processInput(event);
        }
    });
    
    // Theme change listener
    themeSelect.addEventListener('change', function() {
        applyTheme(this.value);
    });
    
    // Initialize
    initializeKeyboard();
    resetTest();
    applyTheme(themeSelect.value);
});