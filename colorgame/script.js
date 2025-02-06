
const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
let targetColor,
  score = 0;

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function startGame() {
  targetColor = getRandomColor();
  document.getElementById("colorBox").style.backgroundColor = targetColor;

  const colorOptions = document.getElementById("colorOptions");
  colorOptions.innerHTML = "";

  colors.forEach((color) => {
    const button = document.createElement("button");
    button.className = "colorOption";
    button.style.backgroundColor = color;
    button.setAttribute("data-testid", "colorOption");
    button.addEventListener("click", () => checkGuess(color));
    colorOptions.appendChild(button);
  });

  document.getElementById("gameStatus").textContent = "";
}

function checkGuess(guess) {
  const status = document.getElementById("gameStatus");
  if (guess === targetColor) {
    status.textContent = "Correct! 🎉";
    score++;
    document.getElementById("score").textContent = score;
  } else {
    status.textContent = "Wrong! Try Again.";
  }
}

document
  .getElementById("newGameButton")
  .addEventListener("click", startGame);

startGame();
