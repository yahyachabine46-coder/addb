<!DOCTYPE html>
<html>
<head>
    <title>Yahya's Counter</title>
    <style>
        body { font-family: sans-serif; background: #f0f2f5; display: flex; justify-content: center; padding: 20px; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); width: 500px; }
        textarea { width: 100%; height: 200px; border: 2px solid #ddd; border-radius: 10px; padding: 10px; font-size: 18px; box-sizing: border-box; }
        .result { background: #3498db; color: white; padding: 10px; border-radius: 50px; display: inline-block; margin-top: 10px; font-weight: bold; }
    </style>
</head>
<body>

<div class="card">
    <h2>Essay Word Counter</h2>
    <textarea id="BOX" placeholder="Type here, Yahya..."></textarea>
    <div class="result">Words: <span id="COUNT">0</span></div>
</div>

<script>
    // These link the HTML to the logic
    const myBox = document.getElementById('BOX');
    const myCount = document.getElementById('COUNT');

    myBox.addEventListener('input', function() {
        const text = myBox.value.trim();
        // This counts words even if you use 'Enter' or multiple spaces
        const words = text ? text.split(/\s+/) : [];
        myCount.innerText = words.length;
    });
</script>

</body>
</html>
