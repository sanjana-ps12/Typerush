const quoteBox = document.getElementById("quote-box");
const inputField = document.getElementById("input");
const timeDisplay = document.getElementById("time");
const wordsDisplay = document.getElementById("words");
const wpmDisplay = document.getElementById("wpm");
const errorDisplay = document.getElementById("errors");
const restartBtn = document.getElementById("restart-btn");
const medalDisplay = document.getElementById("medal");
const themeToggle = document.getElementById("theme-toggle");

const quotes = [
  "Typing is a skill that improves with practice.",
  "Consistency is the key to mastering any skill.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Practice makes perfect, especially in typing.",
  "Speed and accuracy are both important in typing."
];

let currentQuote = "";
let startTime;
let interval;

function loadNewQuote() {
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.innerHTML = "";

  currentQuote.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    quoteBox.appendChild(span);
  });

  inputField.value = "";
  timeDisplay.textContent = "0";
  wordsDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  errorDisplay.textContent = "0";
  medalDisplay.textContent = "";
  clearInterval(interval);
  startTime = null;
  clearConfetti();
}

function calculateErrors() {
  const input = inputField.value;
  let errors = 0;

  const spans = quoteBox.querySelectorAll("span");

  spans.forEach((span, index) => {
    const char = input[index];

    if (char == null) {
      span.classList.remove("correct", "incorrect");
      span.classList.add("pending"); // missing
    } else if (char === span.textContent) {
      span.classList.add("correct");
      span.classList.remove("incorrect", "pending");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct", "pending");
      errors++;
    }
  });

  if (input.length > spans.length) {
    errors += input.length - spans.length;
  }

  errorDisplay.textContent = errors;
  return errors;
}

function updateStats() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timeDisplay.textContent = elapsed;
  const words = inputField.value.trim().split(/\s+/).length;
  wordsDisplay.textContent = inputField.value.trim() ? words : 0;
  const wpm = Math.round((words / elapsed) * 60);
  wpmDisplay.textContent = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;

  const errors = calculateErrors();
  if (inputField.value === currentQuote) {
    clearInterval(interval);
    showMedal(wpm, errors);
    triggerConfetti();
  }
}

function showMedal(wpm, errors) {
  if (errors > 5) {
    medalDisplay.textContent = "❌ Too many errors!";
  } else if (wpm >= 50) {
    medalDisplay.textContent = "🥇 Gold Medal!";
  } else if (wpm >= 30) {
    medalDisplay.textContent = "🥈 Silver Medal!";
  } else if (wpm >= 20) {
    medalDisplay.textContent = "🥉 Bronze Medal!";
  } else {
    medalDisplay.textContent = "🎯 Keep practicing!";
  }
}

inputField.addEventListener("input", () => {
  if (!startTime) {
    startTime = Date.now();
    interval = setInterval(updateStats, 800);
  }
  updateStats();
});

restartBtn.addEventListener("click", loadNewQuote);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function triggerConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const confettiCount = 800;
  const confetti = [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
      ctx.stroke();
    });

    updateConfetti();
  }

  function updateConfetti() {
    confetti.forEach(c => {
      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle - c.d / 3) * 15;
    });
  }

  let animation = setInterval(drawConfetti, 20);
  setTimeout(() => clearInterval(animation), 13000);
}

function clearConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

loadNewQuote();
