const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const status = document.getElementById('status');
    const rawTextOutput = document.getElementById('rawText');
    const finalAnswerDiv = document.getElementById('finalAnswer');

    async function startCapture() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            video.srcObject = stream;
            status.innerText = "Screen Connected!";
        } catch (err) {
            status.innerText = "Error: Access Denied";
        }
    }

    async function readAndSolve() {
        if (!video.srcObject) return alert("Connect screen first!");

        status.innerText = "Searching for the error...";
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const result = await Tesseract.recognize(canvas, 'fra');
        const fullText = result.data.text;
        rawTextOutput.innerText = fullText;

        // NEW LOGIC: Look for the line that has dashes (—), which contains the choices
        const lines = fullText.split('\n');
        let choiceLine = lines.find(l => l.includes('—') || l.includes('-'));
        
        if (!choiceLine) {
            finalAnswerDiv.innerHTML = "<em>Could not find the choices. Make sure the list is visible!</em>";
            return;
        }

        const words = choiceLine.split(/[\s—\-]+/);
        let found = "";

        for (let word of words) {
            let clean = word.toLowerCase().trim();
            if (clean.length <= 2) continue;

            // Rule 1: Cedilla ONLY before a, o, u. If it's before 'i' or 'e', it's WRONG.
            if (clean.includes('çi') || clean.includes('çe')) {
                found = word;
                break;
            }

            // Rule 2: Needs a cedilla for 's' sound before a, o, u.
            // In your game, words like 'berca' or 'lancais' (no hook) are the errors.
            if ((clean.includes('ca') || clean.includes('co') || clean.includes('cu')) && !clean.includes('ç')) {
                // Ignore the word 'commercial' if it's spelled correctly without a hook
                if (clean !== "commercial") { 
                    found = word;
                    break;
                }
            }
        }

        if (found) {
            status.innerText = "Answer Found!";
            finalAnswerDiv.innerHTML = `<div class="answer-highlight"><strong>THE ANSWER:</strong> ${found}</div>`;
        } else {
            status.innerText = "Scanning complete.";
            finalAnswerDiv.innerHTML = "<em>No error detected in this row.</em>";
        }
    }
