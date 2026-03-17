// --- UNIVERSAL AUTO-SOLVER ---
const quizDatabase = {
    "What is the capital of France?": "Paris",
    "What is 2 + 2?": "4"
};

function autoSolve() {
    // 1. Find the Question
    const questionElement = document.querySelector('h1, h2, [class*="question"]');
    if (!questionElement) return;

    const currentQuestion = questionElement.innerText.trim();
    const correctAnswer = quizDatabase[currentQuestion];

    if (correctAnswer) {
        // 2. Search EVERY element for the correct answer text
        // This covers divs, spans, p, li, and buttons
        const allElements = document.querySelectorAll('div, span, p, li, button, a');
        
        for (let el of allElements) {
            // We check for an exact match so we don't click the wrong thing
            if (el.innerText.trim() === correctAnswer && el.children.length === 0) {
                console.log("🎯 Found it in a " + el.tagName + "! Clicking...");
                
                // Perform the click
                el.click();
                el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                break; 
            }
        }
    }
}

// Run every 1 second
setInterval(autoSolve, 1000);
