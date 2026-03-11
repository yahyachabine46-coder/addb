<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>AI Screen Brain - French Edition</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; background: #1a1a1a; color: #e0e0e0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: #2d2d2d; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #4dabff; margin-bottom: 5px; }
        .status-bar { color: #00ff88; font-weight: bold; margin: 15px 0; min-height: 24px; }
        .controls { margin: 20px 0; }
        button { padding: 12px 25px; font-size: 16px; cursor: pointer; border: none; border-radius: 5px; margin: 5px; transition: 0.3s; font-weight: bold; }
        .btn-connect { background: #007bff; color: white; }
        .btn-solve { background: #28a745; color: white; }
        button:hover { opacity: 0.8; transform: translateY(-2px); }
        #output-box { margin-top: 20px; padding: 20px; background: #121212; border-radius: 10px; border-left: 5px solid #4dabff; text-align: left; }
        .answer-highlight { color: #ff4757; font-size: 1.5em; display: block; margin-top: 15px; background: rgba(255, 71, 87, 0.1); padding: 10px; border-radius: 5px; border: 1px dashed #ff4757; }
        video, canvas { display: none; }
    </style>
</head>
<body>

<div class="container">
    <h1>AI Screen Brain</h1>
    <p>Target: French Cedilla (ç) Lessons</p>

    <div class="controls">
        <button class="btn-connect" onclick="startCapture()">1. Select Screen</button>
        <button class="btn-solve" onclick="readAndSolve()">2. Find the Answer</button>
    </div>

    <div id="status" class="status-bar">Ready to start...</div>

    <div id="output-box">
        <strong>Detected Text:</strong>
        <p id="rawText">No data yet.</p>
        <div id="finalAnswer"></div>
    </div>
</div>

<video id="video" autoplay></video>
<canvas id="canvas"></canvas>

<script>
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const status = document.getElementById('status');
    const rawTextOutput = document.getElementById('rawText');
    const finalAnswerDiv = document.getElementById('finalAnswer');

    // 1. Connection Logic
    async function startCapture() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            video.srcObject = stream;
            status.innerText = "Connected to screen! Click 'Find the Answer' when the question is visible.";
        } catch (err) {
            status.innerText = "Error: Please allow screen access.";
            console.error(err);
        }
    }

    // 2. OCR and Repair Logic
    async function readAndSolve() {
        if (!video.srcObject) {
            alert("Connect the screen first!");
            return;
        }

        status.innerText = "Analyzing French grammar...";
        finalAnswerDiv.innerHTML = "";

        // Capture current frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        // Run Tesseract with French dictionary
        try {
            const result = await Tesseract.recognize(canvas, 'fra');
            const text = result.data.text;
            rawTextOutput.innerText = text;

            // REPAIR LOGIC: Find the incorrect word
            // We look for words containing "ca", "co", or "cu" that usually need a ç
            const words = text.split(/[\s,;—\-]+/);
            let incorrectWord = "";

            for (let word of words) {
                let lowWord = word.toLowerCase();
                // Common mistake patterns in your screens: berca, hamecgon, remplacant
                if (lowWord.includes("ca") || lowWord.includes("co") || lowWord.includes("cu")) {
                    // If it doesn't have the cedilla, it's likely the "incorrect" one in these exercises
                    if (!lowWord.includes("ç")) {
                        // Filter out common small words like "car" or "avec"
                        if (lowWord.length > 3) {
                            incorrectWord = word;
                            break;
                        }
                    }
                }
            }

            if (incorrectWord) {
                status.innerText = "Answer Found!";
                finalAnswerDiv.innerHTML = `<div class="answer-highlight"><strong>THE ANSWER:</strong> ${incorrectWord}</div>`;
            } else {
                status.innerText = "Analysis complete.";
                finalAnswerDiv.innerHTML = "<em>Could not find a clear spelling error. Try again with a clearer view.</em>";
            }

        } catch (err) {
            status.innerText = "Error reading screen.";
            console.error(err);
        }
    }
</script>

</body>
</html>
