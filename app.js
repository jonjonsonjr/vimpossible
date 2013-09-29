var highScoreSpan = document.getElementById('highScore');
var scoreSpan = document.getElementById('score');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var height = 20;
var width = 10;
var maxHeight = canvas.height / height;
var maxWidth = canvas.width / width;

var enemies = [];
var score = 0;
var highScore = 0;

var nugget = {
  x: 0,
  y: 0,
  width: width,
  height: height,
  color: 'yellow',
  clear: function () {
    context.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
  },
  draw: function () {
    context.beginPath();
    context.rect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.fillStyle = this.color;
    context.fill();
  },
  move: function () {
    this.clear();
    this.x = Math.floor(Math.random() * maxWidth);
    this.y = Math.floor(Math.random() * maxHeight);
    this.draw();
  }
};
nugget.move();

var player = {
  x: maxWidth / 2,
  y: maxHeight / 2,
  width: width,
  height: height,
  color: 'white',
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
    this.color = (this.color == 'white') ? 'black' : 'white';
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
player.draw();

window.setInterval(function () {
  var enemy = {
    x: Math.floor(Math.random() * maxWidth),
    y: 0,
    width: width,
    height: height,
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
    move: function () {
      if (this.y + 1 >= maxHeight) return false;
      this.y += 1;
      this.draw();
    },
  };
  enemies.push(enemy);
  enemy.draw();
}, 100);

window.setInterval(function () {
  var enemy = {
    x: 0,
    y: Math.floor(Math.random() * maxHeight),
    width: width,
    height: height,
    color: 'purple',
    clear: function () {
      context.clearRect(this.x * this.width, this.y * this.height, this.width, this.height);
    },
    draw: function () {
      context.beginPath();
      context.rect(this.x * this.width, this.y * this.height, this.width, this.height);
      context.fillStyle = this.color;
      context.fill();
    },
    move: function () {
      if (this.x + 1 >= maxWidth) return false;
      this.x += 1;
      this.draw();
    },
  };
  enemies.push(enemy);
  enemy.draw();
}, 200);

window.setInterval(function () {
  enemies.forEach(function (enemy) {
    enemy.clear();
  });

  nugget.draw();

  for (var i = 0; i < enemies.length; i++) {
    var keep = enemies[i].move();

    if (keep === false) {
      enemies[i].clear();
      enemies[i] = null;
      enemies.splice(i, 1);
      score++;
      highScore = Math.max(score, highScore);
    }
  }

  checkCollision();

  scoreSpan.innerHTML = score;
  highScoreSpan.innerHTML = highScore;
}, 500);

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

function checkCollision() {
  if (nugget.x == player.x && nugget.y == player.y) {
    score += 500;
    highScore = Math.max(score, highScore);
    nugget.move();
  }

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];

    if (e.x == player.x && e.y == player.y) {
      score = 0;
      enemies = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
      player.draw();
      break;
    }
  }
}
