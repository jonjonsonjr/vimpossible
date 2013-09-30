var url = 'http://jonjonsonjr.github.io/vimpossible';
var highScoreSpan = document.getElementById('highScore');
var scoreSpan = document.getElementById('score');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var height = 20;
var width = 10;
var maxHeight = canvas.height / height - 1; // make room for status bar
var maxWidth = canvas.width / width;
var insertMode = false;

var enemies = [];
var score = 0;
var highScore = 0;

var nugget = {
  x: Math.floor(Math.random() * maxWidth),
  y: Math.floor(Math.random() * maxHeight),
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

var player = {
  x: maxWidth / 2,
  y: (maxHeight + 1) / 2,
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
    drawPosition(this.x, this.y);
  },
  blink: function () {
    this.clear();
    this.color = (this.color == 'white') ? 'black' : 'white';
    this.draw();
  },
  moveUp: function () {
    if (this.y - 1 < 0) return false;
    this.clear();
    this.y -= 1;
    this.draw();
  },
  moveDown: function () {
    if (this.y + 1 >= maxHeight) return false;
    this.clear();
    this.y += 1;
    this.draw();
  },
  moveLeft: function () {
    if (this.x - 1 < 0) return false;
    this.clear();
    this.x -= 1;
    this.draw();
  },
  moveRight: function () {
    if (this.x + 1 >= maxWidth) return false;
    this.clear();
    this.x += 1;
    this.draw();
  }
};

reset();

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
}, 300);

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
}, 500);

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
      i--; // since we deleted this one, the next one with now be at this index, repeat 'i'
    }
  }

  checkCollision();

  scoreSpan.innerHTML = score;
  highScoreSpan.innerHTML = highScore;
}, 500);

document.onkeydown = function (e) {
  if (e.which == 8) {
    e.preventDefault(); // swallow backspace
  }
};

window.addEventListener('keydown', function (e) {
  if (insertMode) {
    if (e.keyCode == 27) { // esc
      insertMode = false;
      drawText(url);
    } else if (e.keyCode == 8) { // backspace
      player.moveLeft();
    } else {
      var ch = String.fromCharCode(e.keyCode);
      var cc = ch.charCodeAt(0);
      var stuck = player.moveRight();

      if (cc > 64 && cc < 91) { // A-Z
        ch = ch.toLowerCase();
      }

      if (stuck !== false) {
        context.fillStyle = 'white';
        context.fillText(ch, (player.x - 1) * width, player.y * height + 15);
      }
    }
  } else if (e.keyCode == 73) { // i
    insertMode = true;
    drawText('INSERT');
  } else if (e.keyCode == 72) { // h
    player.moveLeft();
  } else if (e.keyCode == 74) { // j
    player.moveDown();
  } else if (e.keyCode == 75) { // k
    player.moveUp();
  } else if (e.keyCode == 76) { // l
    player.moveRight();
  } else {
    return false;
  }
}, true);

function reset() {
  score = 0;
  enemies = [];
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  nugget.move();
  drawText(url);
  insertMode = false;
}

function checkCollision() {
  if (nugget.x == player.x && nugget.y == player.y) {
    score += 500;
    highScore = Math.max(score, highScore);
    nugget.move();
  }

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];

    if (e.x == player.x && e.y == player.y) {
      reset();
      break;
    }
  }
}

function drawPosition(x, y) {
  var paddedText = String('    ' + ((y + 1) + ',' + (x + 1)));
  paddedText = paddedText.slice(-5);

  context.clearRect(canvas.width - 60, maxHeight * height, 60, height);
  context.font = '18px Monospace';
  context.fillStyle = 'white';
  context.fillText(paddedText, canvas.width - 60, canvas.height - 5);
}

function drawText(text) {
  context.clearRect(0, maxHeight * height, canvas.width - 60, height);
  context.fillStyle = 'white';
  context.font = '18px Monospace';
  context.fillText(text, 5, canvas.height - 5);
}