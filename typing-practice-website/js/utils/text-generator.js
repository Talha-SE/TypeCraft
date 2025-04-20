// Common English words by frequency
const commonWords = [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way'
];

// Programming keywords
const programmingKeywords = [
    'function', 'return', 'if', 'else', 'for', 'while', 'let', 'const',
    'var', 'class', 'import', 'export', 'try', 'catch', 'async', 'await',
    'switch', 'case', 'break', 'continue', 'default', 'null', 'undefined',
    'true', 'false', 'this', 'new', 'typeof', 'instanceof', 'void'
];

// Pangrams (sentences containing all letters of the alphabet)
const pangrams = [
    'The quick brown fox jumps over the lazy dog.',
    'Pack my box with five dozen liquor jugs.',
    'How vexingly quick daft zebras jump!',
    'Sphinx of black quartz, judge my vow.',
    'Jackdaws love my big sphinx of quartz.',
    'The five boxing wizards jump quickly.'
];

// Famous quotes for typing practice
const quotes = [
    'The only way to do great work is to love what you do.',
    'Life is what happens when you are busy making other plans.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    'In the end, we will remember not the words of our enemies, but the silence of our friends.'
];

// Generate a random string of characters
function getRandomText(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,.!? ';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

// Generate random words from a given array
function getRandomWords(wordArray, count = 10) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * wordArray.length);
        result.push(wordArray[randomIndex]);
    }
    return result.join(' ');
}

// Generate paragraphs with given word count
function generateParagraphs(numParagraphs = 1, wordsPerParagraph = 15, difficulty = 'medium') {
    const paragraphs = [];
    let wordArray = commonWords;
    
    // Adjust word array based on difficulty
    if (difficulty === 'hard') {
        // Mix in some programming keywords and longer words
        wordArray = [...commonWords, ...programmingKeywords];
    }
    
    for (let i = 0; i < numParagraphs; i++) {
        const paragraph = [];
        for (let j = 0; j < wordsPerParagraph; j++) {
            const wordIndex = Math.floor(Math.random() * wordArray.length);
            let word = wordArray[wordIndex];
            
            // Add punctuation sometimes
            if (difficulty !== 'easy' && j > 0 && Math.random() > 0.85) {
                const punctuation = [',', '.', '!', '?', ';', ':'];
                const punctIndex = Math.floor(Math.random() * punctuation.length);
                word += punctuation[punctIndex];
            }
            
            paragraph.push(word);
        }
        
        // Capitalize first letter and add ending punctuation
        let text = paragraph.join(' ');
        text = text.charAt(0).toUpperCase() + text.slice(1);
        if (!['.',  '!', '?'].includes(text[text.length - 1])) {
            text += '.';
        }
        
        paragraphs.push(text);
    }
    
    return paragraphs.join('\n\n');
}

// Generate code snippets for practice
function generateCodeSnippet(language = 'javascript', difficulty = 'medium') {
    const jsSnippets = {
        easy: [
            'let x = 10;\nlet y = 20;\nlet sum = x + y;',
            'function greet() {\n  console.log("Hello world!");\n}',
            'const names = ["Alice", "Bob", "Charlie"];\nfor (let name of names) {\n  console.log(name);\n}'
        ],
        medium: [
            'function factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}',
            'const users = data.filter(user => user.active)\n  .map(user => ({\n    name: user.name,\n    email: user.email\n  }));',
            'try {\n  const result = riskyOperation();\n  processResult(result);\n} catch (error) {\n  console.error("Error:", error.message);\n}'
        ],
        hard: [
            'class Node {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}\n\nfunction traverseInOrder(node) {\n  if (node) {\n    traverseInOrder(node.left);\n    console.log(node.value);\n    traverseInOrder(node.right);\n  }\n}',
            'const memoize = (fn) => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache[key]) return cache[key];\n    const result = fn(...args);\n    cache[key] = result;\n    return result;\n  };\n};',
            'async function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Could not fetch data:", error);\n    throw error;\n  }\n}'
        ]
    };
    
    const difficultyLevel = jsSnippets[difficulty] || jsSnippets.medium;
    const randomIndex = Math.floor(Math.random() * difficultyLevel.length);
    return difficultyLevel[randomIndex];
}

// Generate text based on type and difficulty
function generateText(type = 'words', options = {}) {
    const { 
        difficulty = 'medium', 
        length = 50,
        paragraphs = 1
    } = options;
    
    switch (type) {
        case 'words':
            return getRandomWords(commonWords, length);
        case 'pangrams':
            if (difficulty === 'easy') return pangrams[Math.floor(Math.random() * pangrams.length)];
            if (difficulty === 'medium') return pangrams.slice(0, 2).join(' ');
            return pangrams.join(' ');
        case 'quotes':
            if (difficulty === 'easy') return quotes[Math.floor(Math.random() * quotes.length)];
            if (difficulty === 'medium') return quotes.slice(0, 2).join(' ');
            return quotes.join(' ');
        case 'code':
            return generateCodeSnippet('javascript', difficulty);
        case 'paragraphs':
        default:
            return generateParagraphs(paragraphs, length / paragraphs, difficulty);
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined') {
    module.exports = {
        getRandomText,
        getRandomWords,
        generateParagraphs,
        generateCodeSnippet,
        generateText
    };
}