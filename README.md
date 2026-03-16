const robot = require("robotjs");
const Tesseract = require("tesseract.js");
const screenshot = require("screenshot-desktop");
const fs = require("fs");

async function solveOnScreen() {
    console.log("📸 Taking screenshot...");
    
    // 1. Capture the screen and save it temporarily
    const imgPath = 'current_screen.png';
    await screenshot({ filename: imgPath });

    console.log("🔍 Scanning for the answer...");

    // 2. Use Tesseract to find the word and its LOCATION (coordinates)
    // We use 'recognize' but ask for 'words' to get the X and Y positions
    const result = await Tesseract.recognize(imgPath, 'eng');
    const words = result.data.words;

    // 3. Look for your target answer (e.g., "Paris")
    const target = words.find(w => w.text.toLowerCase().includes("paris"));

    if (target) {
        // 'bbox' is the Boundary Box (the box around the word)
        const x = target.bbox.x0 + (target.bbox.x1 - target.bbox.x0) / 2;
        const y = target.bbox.y0 + (target.bbox.y1 - target.bbox.y0) / 2;

        console.log(`✅ Found "Paris" at ${x}, ${y}. Clicking now!`);
        
        // 4. Move and Click
        robot.moveMouse(x, y);
        robot.mouseClick();
    } else {
        console.log("❌ Answer not found on screen.");
    }

    // Optional: Clean up the screenshot file
    fs.unlinkSync(imgPath);
}

solveOnScreen();
