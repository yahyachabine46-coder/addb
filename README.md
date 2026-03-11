<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Cedilla Brain v4.0 - Ultra Sharp</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: white; display: flex; height: 100vh; margin: 0; }
        .sidebar { width: 300px; background: #181818; border-right: 2px solid #333; padding: 20px; box-sizing: border-box; }
        .main { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
        .box { background: #1e1e1e; padding: 30px; border-radius: 15px; border: 2px solid #444; width: 100%; max-width: 500px; text-align: center; }
        h2 { color: #00ffcc; margin-top: 0; }
        .rule { background: #2a2a2a; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-size: 0.85rem; border-left: 3px solid #00ffcc; }
        #status { color: #00ffcc; font-weight: bold; margin: 15px; height: 20px; }
        #counter { font-size: 1.2rem; color: #ffbc00; margin-bottom: 10px; }
        .ans { color: #ff4757; font-size: 32px; font-weight: bold; background: rgba(255, 71, 87, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px; border: 2px solid #ff4757; }
        button { padding: 15px 25px; font-size: 16px; cursor: pointer; border-radius: 8px; border: none; margin: 5px; font-weight: bold; transition: 0.2s; width: 200px; }
        .btn-blue { background: #007bff; color: white; }
        .btn-green { background: #28a745; color: white; }
        video, canvas { display: none; }
    </style>
</head>
<body>

<div class="sidebar">
    <h2>📚 Help Center</h2>
    <div id="counter">Solved: 0</div>
    <div class="rule"><b>The Rule:</b> <b>ç</b> only before <b>a, o, u</b>.</div>
    <div class="rule"><b>No Hook:</b> Never use <b>ç</b> before <b>e</b> or <b>i</b>.</div>
    <div class="rule"><b>Target:</b> Look for words like <i>berca</i> or <i>commerçial</i>.</div>
</div>

<div class="main">
    <div class="box">
        <h1>Cedilla Brain</h1>
        <button class="btn-blue" onclick="startCapture()">1. Connect Screen</button>
        <button class="btn-green" onclick="solve()">2. Get Answer</button>
        <div id="status">Waiting for connection...</div>
        <div id="result"></div>
    </div>
</div>

<video id="video" autoplay></video>
<canvas id="canvas"></canvas>

<script>
    let solvedCount = 0;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    async function startCapture() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "window" } });
            video.srcObject = stream;
            document.getElementById('status').innerText = "Connected! Open your game.";
        } catch (err) {
            document.getElementById('status').innerText = "Error: Connection failed.";
        }
    }

    async function solve() {
        if (!video.srcObject) return alert("Please connect screen first!");
        
        document.getElementById('status').innerText = "Reading screen (High Precision)...";
        
        // ZOOM FIX: We upscale the capture to make it easier to read
        canvas.width = video.videoWidth * 2;
        canvas.height = video.videoHeight * 2;
        ctx.scale(2, 2);
        ctx.filter = "contrast(1.2) grayscale(1)"; // Sharpen the text
        ctx.drawImage(video, 0, 0);

        try {
            const { data: { text } } = await Tesseract.recognize(canvas, 'fra');
            const words = text.split(/[\s—\-]+/);
            let found = "";

            for (let word of words) {
                let clean = word.toLowerCase().trim().replace(/[^a-zç]/g, "");
                if (["incorrect", "clique", "cédille", "exemples"].includes(clean)) continue;
                if (clean.length < 3) continue;

                // Check for ç before i/e
                if (clean.includes('çi') || clean.includes('çe')) { found = word; break; }
                // Check for missing ç before a/o/u
                if ((clean.includes('ca') || clean.includes('co') || clean.includes('cu')) && !clean.includes('ç')) {
                    if (clean !== "commercial") { found = word; break; }
                }
            }

            if (found) {
                solvedCount++;
                document.getElementById('counter').innerText = "Solved: " + solvedCount;
                document.getElementById('status').innerText = "Match found!";
                document.getElementById('result').innerHTML = `<div class="ans">${found}</div>`;
            } else {
                document.getElementById('status').innerText = "Couldn't read. Try zooming into the game!";
            }
        } catch (e) {
            document.getElementById('status').innerText = "Scan error. Refresh page.";
        }
    }
</script>
</body>
</html>
