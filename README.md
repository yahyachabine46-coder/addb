const robot = require("robotjs");
const Tesseract = require("tesseract.js");

// 1. Define the area of the screen where the quiz is
const quizArea = { x: 100, y: 100, width: 500, height: 500 };

async function scanAndClick() {
  console.log("Scanning screen...");

  // 2. Recognize text from the screen area
  // (In a real app, you'd capture a screenshot first)
  const { data: { text } } = await Tesseract.recognize('screenshot.png');

  if (text.includes("Paris")) {
    // 3. If the answer is found, move the mouse and click
    // These coordinates would be calculated based on the word's location
    robot.moveMouse(300, 450); 
    robot.mouseClick();
    console.log("Clicked the answer!");
  }
}

scanAndClick();
