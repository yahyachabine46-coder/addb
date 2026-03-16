// --- AUTO-SOLVER FOR SPAN ELEMENTS ---
const quizDatabase = {
    "What is the capital of France?": "Paris",
    "What is 5 + 5?": "10"
    // Add more questions and answers here
};

function autoSolve() {
    // 1. Find the question text
    const questionElement = document.querySelector('h1, h2, .question-text, .q-text');
    if (!questionElement) return;

    const currentQuestion = questionElement.innerText.trim();
    const correctAnswer = quizDatabase[currentQuestion];

    if (correctAnswer) {
        // 2. Look for all <span> elements
        const spans = document.querySelectorAll('span');
        
        for (let span of spans) {
            // 3. Check if the span's text matches our answer
            if (span.innerText.trim() === correctAnswer) {
                console.log("✅ Match found! Clicking: " + correctAnswer);
                
                // Trigger the click
                span.click(); 
                
                // Some websites need a "MouseEvent" if a simple .click() doesn't work:
                span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                break; 
            }
        }
    }
}

// Run every 1.5 seconds
setInterval(autoSolve, 1500);
