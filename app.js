var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width = 10;
var height = 20;
var maxWidth = canvas.width / 10;
var maxHeight = canvas.height / 20;

var enemies = [];
var score = 0;
var scoreSpan = document.getElementById('score');
var highScore = 0;
var highScoreSpan = document.getElementById('highScore');

var player = {
  x: maxWidth / 2,
  y: maxHeight / 2,
  width: 10,
  height: 20,
  color: 'black',
  clear: function () {
    context.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
  },
  draw: function () {
    checkCollision();
    context.beginPath();
    context.rect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.fillStyle = this.color;
    context.fill();
  },
  blink: function () {
    this.clear();
    this.color = (this.color == 'black') ? 'lightgrey' : 'black';
    this.draw();
  },
  moveUp: function () {
    if (this.y - 1 < 0) return;
    this.clear();
    this.y -= 1;
    this.draw();
  },
  moveDown: function () {
    if (this.y + 1 >= maxHeight) return;
    this.clear();
    this.y += 1;
    this.draw();
  },
  moveLeft: function () {
    if (this.x - 1 < 0) return;
    this.clear();
    this.x -= 1;
    this.draw();
  },
  moveRight: function () {
    if (this.x + 1 >= maxWidth) return;
    this.clear();
    this.x += 1;
    this.draw();
  }
};

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 72) { // h
    player.moveLeft();
  } else if (e.keyCode == 74) { // j
    player.moveDown();
  } else if (e.keyCode == 75) { // k
    player.moveUp();
  } else if (e.keyCode == 76) { // l
    player.moveRight();
  }
}, true);

window.setInterval(function () {
  enemies.push({
    x: Math.floor(Math.random() * maxWidth),
    y: 0,
    width: 10,
    height: 20,
    color: 'red',
    clear: function () {
      context.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
    },
    draw: function () {
      context.beginPath();
      context.rect(this.x * this.width, this.y * this.height, this.width, this.height);
      context.fillStyle = this.color;
      context.fill();
    },
    moveDown: function () {
      console.log(this);
      if (this.y + 1 >= maxHeight) return false;
      this.clear();
      this.y += 1;
      this.draw();
    },
  });
}, 50);

window.setInterval(function () {
  for (var i = 0; i < enemies.length; i++) {
    var remove = enemies[i].moveDown();

    if (remove === false) {
      enemies[i].clear();
      enemies.splice(i, 1);
      score++;
      highScore = Math.max(score, highScore);
    }
  }

  scoreSpan.innerHTML = score;
  highScoreSpan.innerHTML = highScore;
  player.blink();
}, 500);

function checkCollision() {
  enemies.forEach(function (e) {
    if (e.x == player.x && e.y == player.y) {
      score = 0;
      enemies = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
};