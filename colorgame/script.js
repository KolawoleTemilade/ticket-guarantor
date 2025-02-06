function generateRandomColor() {
  const randomColor = () =>
    Math.floor(Math.random() * 256); 
  return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`;
}

function generateColorSet() {
  const colorSet = new Set();
  while (colorSet.size < 6) {
    colorSet.add(generateRandomColor());
  }
  return Array.from(colorSet);
}

let colors = [],
  targetColor,
  score = 0;

function startGame() {
  colors = generateColorSet(); // Generate a new set of random colors
  targetColor = colors[Math.floor(Math.random() * colors.length)];
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

  document.getElementById("gameStatus").textContent = "Guess the correct color!";
}

function checkGuess(guess) {
  const status = document.getElementById("gameStatus");

  if (guess === targetColor) {
    status.textContent = "Correct! 🎉 New round starting...";
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    
    // Automatically start a new round after a short delay
    setTimeout(startGame, 1000); 
  } else {
    status.textContent = "Wrong! ❌ Try again.";
  }
}

document.getElementById("newGameButton").addEventListener("click", startGame);

startGame();
