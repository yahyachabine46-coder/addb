<!DOCTYPE html>
<html>
<head>
    <title>Universal Screen Reader</title>
    <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
    <style>
        body { font-family: sans-serif; text-align: center; background: #222; color: white; }
        #status { color: #00ff00; margin: 10px; font-weight: bold; }
        video, canvas { display: none; } /* We hide the messy stuff */
        .box { border: 2px solid #444; padding: 20px; margin: 20px auto; width: 80%; background: #333; }
        button { padding: 15px 30px; font-size: 18px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 8px; }
    </style>
</head>
<body>

    <h1>AI Screen Brain</h1>
    <button onclick="startCapture()">1. Choose Screen to Solve</button>
    <button onclick="readScreen()">2. Read & Answer</button>
    
    <div id="status">Ready...</div>

    <div class="box">
        <h3>What I see:</h3>
        <p id="extractedText">Waiting for capture...</p>
    </div>

    <video id="video" autoplay></video>
    <canvas id="canvas"></canvas>

    <script>
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const status = document.getElementById('status');
        const output = document.getElementById('extractedText');

        // Step 1: Get the screen feed
        async function startCapture() {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                video.srcObject = stream;
                status.innerText = "Screen Connected!";
            } catch (err) {
                status.innerText = "Error: Permission Denied";
            }
        }

        // Step 2: Take a picture and read it
        async function readScreen() {
            if (!video.srcObject) {
                alert("Please click 'Choose Screen' first!");
                return;
            }

            status.innerText = "Scanning... (this takes a few seconds)";
            
            // Draw the current video frame to the canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            // Use Tesseract to read the canvas
            const result = await Tesseract.recognize(canvas, 'eng');
            
            output.innerText = result.data.text;
            status.innerText = "Done!";

            // GENTLE REMINDER: This gives you the text. 
            // To get the "Answer," you'd need to copy this text into a Chatbot 
            // OR connect an AI API Key here.
        }
    </script>
</body>
</html>
