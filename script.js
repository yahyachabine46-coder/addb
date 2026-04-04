async function getAIAnswer(questionText) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Solve this quiz question: " + questionText }] }]
        })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
