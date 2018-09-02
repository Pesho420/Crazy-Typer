const FRAMES_PER_SECOND = 32;
const WORDS_ON_SCREEN = 10;
const SPEED_RANGE = 5;
const INITIAL_TIME = 60;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var userInput = document.getElementById("userInput");
var scoreLabel = document.getElementById("score");
var currentScore = 0;
var resetButton = document.getElementById("resetButton");
var timer = document.getElementById("timer");
var timeLeft = INITIAL_TIME;
var inGame = false;
var timerInterval;

resetButton.onclick = function() {
  setUpNewGame();
}

function addWord(word) {
  ctx.font = FONT;
  
  var width = ctx.measureText(word).width + 10, height = 60;
  var x = rng.next(0, canvas.width-width), y = rng.next(0, canvas.height-height);
  var vx = rng.next(1, SPEED_RANGE), vy = rng.next(1, SPEED_RANGE);

  if(rng.next(0, 1) == 0) vx = -vx;
  if(rng.next(0, 1) == 0) vy = -vy;

  var color = "#";
  
  for(var i=0;i<6;i++) {
    var curr = rng.next(3, 12);

    if(curr<10) color += curr;
    else color += String.fromCharCode("a".charCodeAt() + curr - 10);
  }

  activeWords.push(new word_t(word, color, x, y, width, height, vx, vy));
}

function drawRectangle(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawStrokedRectangle(x, y, width, height, color, strokeColor) {
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.fillRect(x, y, width, height);
  ctx.strokeRect(x, y, width, height);
}

function drawWord(word) {
  drawStrokedRectangle(word.x, word.y, word.width, word.height, word.color, "white");
  
  ctx.fillStyle = "black";//TEXT_COLOR;
  ctx.font = FONT;
  ctx.fillText(word.word, word.x + 5, word.y + 45);
}

function isXOnScreen(x) {
  if(x>=0 && x<=canvas.width) return true;
  return false;
}

function isYOnScreen(y) {
  if(y>=0 && y<=canvas.height) return true;
  return false;
}

function updatePositions() {
  for(var i=0;i<activeWords.length;i++) {
    activeWords[i].x += activeWords[i].vx;
    activeWords[i].y += activeWords[i].vy;
  }

  for(var i=0;i<activeWords.length;i++) {
    if(isXOnScreen(activeWords[i].x)==false || isXOnScreen(activeWords[i].x + activeWords[i].width)==false
        || isYOnScreen(activeWords[i].y)==false || isYOnScreen(activeWords[i].y + activeWords[i].height)==false) {
      
      activeWords.splice(i, 1);

      --i;
    }
  }

  while(activeWords.length<WORDS_ON_SCREEN) {
    addWord(words[rng.next(0, words.length-1)]);
  }
}

function render() {
  drawRectangle(0, 0, canvas.width, canvas.height, "black");

  for(var i=0;i<activeWords.length;i++) {
    drawWord(activeWords[i]);
  }

  scoreLabel.innerHTML = "Score: " + currentScore;
  timer.innerHTML = timeLeft;
}

function drawScore() {
  drawRectangle(0, 0, canvas.width, canvas.height, "black");

  ctx.fillStyle = "#029300";
  ctx.font = "100px arial";
  
  var text = "Score: " + currentScore;
  
  ctx.fillText(text, canvas.width/2 - ctx.measureText(text).width/2, canvas.height/2);
  
  scoreLabel.innerHTML = "Score: " + currentScore;
  timer.innerHTML = timeLeft;
}

function gameLoop() {
  if(timeLeft==0) {
    inGame = false;
    clearInterval(timerInterval);
    
    timer.style.backgroundColor="#c40000";
    scoreLabel.style.backgroundColor="#029300";
  
    drawScore();
  }
  
  else {
    render();
    updatePositions();
  }
}

userInput.onkeydown = function(event) {
  if(inGame==false && timeLeft==INITIAL_TIME) {
    inGame = true;
    timerInterval = setInterval(updateTimer, 1000);
  }

  if(event.keyCode==13 || event.keyCode==32 || event.which==13 || event.which==32) {
    event.preventDefault();
    
    var curr = userInput.value.trim();

    for(var i=0;i<activeWords.length;i++) {
      if(curr==activeWords[i].word) {
        activeWords.splice(i, 1);
        --i;
        if(inGame==true) currentScore += curr.length;
      }
    }

    while(activeWords.length<WORDS_ON_SCREEN) {
      addWord(words[rng.next(0, words.length-1)]);
    }

    userInput.value = "";
  }
}

function updateTimer() {
  --timeLeft;
}

function setUpNewGame() {
  userInput.value = "";
  userInput.focus();
  clearInterval(timerInterval);

  timer.style.backgroundColor="#333";
  scoreLabel.style.backgroundColor="#333";

  activeWords = [];

  for(var i=0;i<WORDS_ON_SCREEN;i++) {
    addWord(words[rng.next(0, words.length-1)]);
  }

  currentScore = 0;
  timeLeft = INITIAL_TIME;
  inGame = false;
}

setUpNewGame();

setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
