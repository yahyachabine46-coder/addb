document.getElementById("correct").click();

// Find all buttons, then click the one that says "Paris"
const buttons = document.querySelectorAll("button");
buttons.forEach(btn => {
  if (btn.textContent === "Paris") {
    btn.click();
  }
});
