<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>French Cedilla Solver</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: sans-serif; text-align: center; background: #121212; color: white; padding: 20px; }
        .box { background: #1e1e1e; padding: 20px; border-radius: 10px; border: 2px solid #333; max-width: 600px; margin: auto; }
        #status { color: #00ffcc; font-weight: bold; margin: 10px; }
        .ans { color: #ff4757; font-size: 28px; font-weight: bold; background: rgba(255, 71, 87, 0.1); padding: 10px; border-radius: 5px; margin-top: 15px; }
        button { padding: 15px 25px; font-size: 18px; cursor: pointer; border-radius: 8px; border: none; margin: 5px; font-weight: bold; }
        .btn-blue { background: #007bff; color: white; }
        .btn-green { background: #28a745; color: white; }
        video, canvas { display: none; }
    </style>
</head>
<body>

<div class="box">
    <h1>Cedilla Brain</h1>
    <button class="btn-blue" onclick="startCapture()">1. Connect Screen</button>
    <button class="btn-green" onclick="solve()">2. Get Answer</button>
    <div id="status">Ready...</div>
    <div id="result"></div>
</div>

<video id="video" autoplay></video>
<canvas id="canvas"></canvas>

<script>
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resultDiv = document.getElementById('result');

    async function startCapture() {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        video.srcObject = stream;
        document.getElementById('status').innerText = "Screen Connected!";
    }

    async function solve() {
        document.getElementById('status').innerText = "Analyzing...";
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const { data: { text } } = await Tesseract.recognize(canvas, 'fra');
        const words = text.split(/[\s—\-]+/);
        let found = "";

        for (let word of words) {
            let clean = word.toLowerCase().trim();
            // IGNORE THE WORDS THAT ARE PART OF THE LESSON TEXT
            if (["incorrect", "clique", "cédille", "prononce", "devant"].includes(clean)) continue;
            if (clean.length < 4) continue;

            // RULE 1: ç before i or e is WRONG (commerçial)
            if (clean.includes('çi') || clean.includes('çe')) {
                found = word; break;
            }
            // RULE 2: Missing ç before a, o, u (berca, lancais)
            if ((clean.includes('ca') || clean.includes('co') || clean.includes('cu')) && !clean.includes('ç')) {
                if (clean !== "commercial") { found = word; break; }
            }
        }

        if (found) {
            document.getElementById('status').innerText = "Answer Found!";
            resultDiv.innerHTML = `<div class="ans">CLICK THIS: ${found}</div>`;
        } else {
            document.getElementById('status').innerText = "Try moving the window closer.";
        }
    }
</script>
</body>
</html>
