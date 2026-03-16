// --- AUTO-SOLVER SCRIPT ---
// 1. Your Database of Answers
const quizDatabase = {
    "What is the capital of France?": "Paris",
    "What is 2 + 2?": "4",
    "Which planet is known as the Red Planet?": "Mars"
};

function autoSolve() {
    // 2. Identify the Question on the screen
    // (We look for common tags like <h1> or <h2> where questions live)
    const questionElement = document.querySelector('h1, h2, .question-text, #question');
    if (!questionElement) return console.log("No question found...");

    const currentQuestion = questionElement.innerText.trim();
    const correctAnswer = quizDatabase[currentQuestion];

    if (correctAnswer) {
        console.log("Match found! Looking for button: " + correctAnswer);

        // 3. Find all buttons/options and click the right one
        const options = document.querySelectorAll('button, .option, .answer-btn');
        options.forEach(option => {
            if (option.innerText.includes(correctAnswer)) {
                option.click();
                console.log("✅ Clicked: " + correctAnswer);
            }
        });
    } else {
        console.log("❌ Question not in database: " + currentQuestion);
    }
}

// 4. Run the solver every 2 seconds automatically
setInterval(autoSolve, 2000);
