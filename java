// This is the "Brain" part you'd add to your script
async function askAI(screenText) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Solve this question from my screen: " + screenText }] }]
        })
    });
    const data = await response.json();
    alert("The Answer is: " + data.candidates[0].content.parts[0].text);
}
