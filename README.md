<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Universal Scanner v1.0</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #050505; color: white; margin: 0; display: flex; height: 100vh; }
        .sidebar { width: 260px; background: #111; border-right: 2px solid #333; padding: 20px; box-sizing: border-box; }
        .main { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .card { background: #1a1a1a; padding: 40px; border-radius: 25px; border: 1px solid #444; width: 480px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        h1 { color: #58a6ff; margin-top: 0; font-size: 1.8rem; }
        #status { color: #58a6ff; margin: 15px; font-weight: bold; text-transform: uppercase; }
        .ans-display { font-size: 32px; color: #7ee787; background: rgba(126, 231, 135, 0.1); padding: 20px; border-radius: 15px; margin-top: 20px; border: 2px solid #7ee787; }
        button { width: 100%; padding: 15px; margin: 10px 0; border-radius: 12px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-blue { background: #007bff; color: white; }
        .btn-green { background: #238636; color: white; }
        video, canvas { display: none; }
    </style>
</head>
<body>

<div class="sidebar">
    <h2 style="color:#58a6ff">Bot Config</h2>
    <p><b>Target:</b> All <code>&lt;span&gt;</code> elements</p>
    <p><b>Mode:</b> Auto-Scan & Match</p>
    <hr style="border:1px solid #333">
    <p style="color:#888"><i>Drag the browser window to the side so it can see the quiz tab!</i></p>
</div>

<div class="main">
    <div class="card">
        <h1>Vision Scanner</h1>
        <button class="btn-blue" onclick="start()">1. Link Quiz Tab</button>
        <button class="btn-green" onclick="solve()">2. Scan & Solve</button>
        <div id="status">System Offline</div>
        <div id="result" class="ans-display">---</div>
    </div>
</div>

<video id="video" autoplay></video>
<canvas id="canvas"></canvas>

<script>
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // --- YOUR ANSWER KEY ---
    const database = {
        "capital of france": "Paris",
        "color of sky": "Blue",
        "5 + 5": "10"
    };

    async function start() {
        // This asks you to pick the tab/window you want to "read"
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        video.srcObject = stream;
        document.getElementById('status').innerText = "Link Established";
    }

    async function solve() {
        if (!video.srcObject) return alert("Link the screen first!");
        document.getElementById('status').innerText = "Reading Screen...";

        // Set canvas to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        try {
            // Scan for words and their positions
            const result = await Tesseract.recognize(canvas, 'eng');
            const fullText = result.data.text.toLowerCase();
            const words = result.data.words;

            let foundAnswer = "Not Found";

            // 1. Check which question from our database is on the screen
            for (let question in database) {
                if (fullText.includes(question.toLowerCase())) {
                    const targetAnswer = database[question];
                    
                    // 2. Find the coordinates of that answer
                    const wordObj = words.find(w => w.text.toLowerCase().includes(targetAnswer.toLowerCase()));
                    
                    if (wordObj) {
                        foundAnswer = targetAnswer;
                        const x = wordObj.bbox.x0 + (wordObj.bbox.x1 - wordObj.bbox.x0) / 2;
                        const y = wordObj.bbox.y0 + (wordObj.bbox.y1 - wordObj.bbox.y0) / 2;
                        
                        document.getElementById('status').innerText = `Match! Target at ${x}, ${y}`;
                        // Note: Browsers won't let a website click another tab for security, 
                        // but it will tell you exactly where the answer is!
                    }
                }
            }

            document.getElementById('result').innerText = foundAnswer.toUpperCase();
            
        } catch (e) {
            document.getElementById('status').innerText = "Scan Error";
            console.error(e);
        }
    }
</script>
</body>
</html>
