<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Cedilla Master Solver</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: sans-serif; background: #0a0a0a; color: white; display: flex; height: 100vh; margin: 0; }
        .side { width: 280px; background: #111; border-right: 2px solid #333; padding: 20px; font-size: 0.9rem; }
        .main { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .card { background: #1a1a1a; padding: 40px; border-radius: 20px; border: 1px solid #444; text-align: center; width: 450px; }
        #status { color: #00ffcc; margin: 15px; font-weight: bold; height: 20px; }
        .ans-box { font-size: 35px; color: #ff4757; background: rgba(255, 71, 87, 0.1); padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid #ff4757; min-height: 50px; }
        button { width: 100%; padding: 15px; margin: 10px 0; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; font-size: 1rem; }
        .btn-b { background: #007bff; color: white; }
        .btn-g { background: #28a745; color: white; }
        .stat { color: #ffbc00; font-size: 1.2rem; margin-bottom: 20px; }
        video, canvas { display: none; }
    </style>
</head>
<body>

<div class="side">
    <h2>📚 Lesson Help</h2>
    <div id="solved">Solved: 0</div>
    <hr>
    <p><b>Rule:</b> </p>
    <p>Ç is only for <b>A, O, U</b>.</p>
    <p>❌ Never use Ç before <b>E</b> or <b>I</b>.</p>
</div>

<div class="main">
    <div class="card">
        <h1>Cedilla Brain</h1>
        <button class="btn-b" onclick="start()">1. Connect Game Window</button>
        <button class="btn-g" onclick="solve()">2. Get Final Answer</button>
        <div id="status">Ready...</div>
        <div id="result" class="ans-box">---</div>
    </div>
</div>

<video id="video" autoplay></video>
<canvas id="canvas"></canvas>

<script>
    let count = 0;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    async function start() {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        video.srcObject = stream;
        document.getElementById('status').innerText = "Linked! Focus on the question.";
    }

    async function solve() {
        if (!video.srcObject) return alert("Connect screen first!");
        document.getElementById('status').innerText = "Reading... 🔍";
        
        // High-Def Capture
        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;
        ctx.scale(2, 2);
        ctx.filter = "grayscale(1) contrast(1.5)";
        ctx.drawImage(video, 0, 0);

        const { data: { text } } = await Tesseract.recognize(canvas, 'fra');
        const words = text.toLowerCase().split(/[\s—\-]+/);
        let answer = "";

        // Common OCR Fixes (e.g., seeing 'g' instead of 'ç')
        const processedWords = words.map(w => w.replace(/g(?=[aou])/g, "ç").replace(/c(?=[aou])/g, "c"));

        for (let i = 0; i < words.length; i++) {
            let word = words[i].replace(/[^a-zç]/g, "");
            if (["incorrect", "clique", "mot", "cédille"].includes(word) || word.length < 3) continue;

            // Rule Check
            const hasWrongHook = word.includes('çi') || word.includes('çe');
            const missingHook = (word.includes('ca') || word.includes('co') || word.includes('cu')) && !word.includes('ç') && word !== "commercial";

            if (hasWrongHook || missingHook) {
                answer = words[i];
                break;
            }
        }

        if (answer) {
            count++;
            document.getElementById('solved').innerText = "Solved: " + count;
            document.getElementById('status').innerText = "Found it!";
            document.getElementById('result').innerText = answer.toUpperCase();
        } else {
            document.getElementById('status').innerText = "Try clicking 'Get Answer' again.";
        }
    }
</script>
</body>
</html>
