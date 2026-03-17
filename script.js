// Replace the logic inside your solve() function with this:

const fullText = result.data.text.toLowerCase();
const words = result.data.words;
let foundAnswer = "Scanning...";

// Use 'some' or 'includes' to find the closest question
for (let question in database) {
    // If at least 50% of the question matches or specific keywords exist
    if (fullText.includes(question.toLowerCase().split(' ')[0])) { 
        const targetAnswer = database[question];
        
        // Find the word that looks most like our answer
        const wordObj = words.find(w => 
            w.text.toLowerCase().replace(/[^a-z0-9]/g, "") === 
            targetAnswer.toLowerCase().replace(/[^a-z0-9]/g, "")
        );

        if (wordObj) {
            foundAnswer = targetAnswer;
            document.getElementById('status').innerText = "FOUND MATCH!";
            break; 
        }
    }
}
