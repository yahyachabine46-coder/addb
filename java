const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const status = document.getElementById('status');
    const rawTextOutput = document.getElementById('rawText');
    const finalAnswerDiv = document.getElementById('finalAnswer');

    async function startCapture() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            video.srcObject = stream;
            status.innerText = "Connected!";
        } catch (err) {
            status.innerText = "Error: Access Denied";
        }
    }

    async function readAndSolve() {
        if (!video.srcObject) return alert("Connect screen first!");

        status.innerText = "Searching for the mistake...";
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        // Using 'fra' for French recognition
        const result = await Tesseract.recognize(canvas, 'fra');
        const fullText = result.data.text;
        rawTextOutput.innerText = fullText;

        const lines = fullText.split('\n');
        let foundWord = "";

        // 1. Identify the specific line with the multiple-choice options (separated by dashes)
        const choiceLine = lines.find(l => l.includes('—') || (l.split(' ').length > 2 && l.includes('-')));

        if (choiceLine) {
            // Split by the dashes or spaces
            const words = choiceLine.split(/[\s—\-]+/);
            
            for (let word of words) {
                let clean = word.toLowerCase().trim();
                
                // IGNORE THE WORD "INCORRECT" OR "CLIQUE"
                if (clean.includes("incorrect") || clean.includes("clique") || clean.length < 3) continue;

                // RULE A: Cedilla before 'i' or 'e' is WRONG (e.g., commerçial)
                if (clean.includes('çi') || clean.includes('çe')) {
                    foundWord = word;
                    break;
                }

                // RULE B: Missing cedilla before a, o, u for an 'S' sound (e.g., lancais)
                // We check if it has ca/co/cu and it's NOT a common correctly spelled word like 'commercial'
                if ((clean.includes('ca') || clean.includes('co') || clean.includes('cu')) && !clean.includes('ç')) {
                    if (clean !== "commercial") {
                        foundWord = word;
                        break;
                    }
                }
            }
        }

        if (foundWord) {
            status.innerText = "Answer Found!";
            finalAnswerDiv.innerHTML = `<div class="answer-highlight"><strong>CLICK THIS WORD:</strong> ${foundWord}</div>`;
        } else {
            status.innerText = "Ready.";
            finalAnswerDiv.innerHTML = "<em>I read the text but couldn't find a grammar error in the choices.</em>";
        }
    }
