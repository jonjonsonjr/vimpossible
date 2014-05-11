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
var shift = false;
var numKey = 1;
var gmod = false;

var enemies = [];
var monsterTimeout;
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
    context.beginPath();
    context.rect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.fillStyle = "#111111";
    context.fill();
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
  moveUp: function (n) {
    if (this.y - n < 0) return false;
    this.clear();
    this.y -= n;
    this.draw();
    numKey = 1;
    redraw();
  },
  moveDown: function (n) {
    if (this.y + n >= maxHeight) return false;
    this.clear();
    this.y += n;
    this.draw();
    numKey = 1;
    redraw();
  },
  moveLeft: function (n) {
    if (this.x - n < 0) return false;
    this.clear();
    this.x -= n;
    this.draw();
    numKey = 1;
  },
  moveRight: function (n) {
    if (this.x + n >= maxWidth) return false;
    this.clear();
    this.x += n;
    this.draw();
    numKey = 1;
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
  redraw();

  scoreSpan.innerHTML = score;
  highScoreSpan.innerHTML = highScore;
}, 500);

document.onkeydown = function (e) {
  if (e.which == 8) {
    e.preventDefault(); // swallow backspace
  }
};

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 16) { // shift
    shift = true;
    return;
  }
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
  } else if (shift) {
    if (e.keyCode == 52) { // $
      player.clear();
      player.x = maxWidth - 1;
      player.draw();
    } else if (e.keyCode == 71) { // G
      player.clear();
      player.y = maxHeight - 1;
      player.draw();
    } else if (e.keyCode == 72) { // H
      player.clear();
      player.y = 0;
      player.draw();
    } else if (e.keyCode == 77) { // M
      player.clear();
      player.y = Math.floor(maxHeight / 2);
      player.draw();
    } else if (e.keyCode == 76) { // L
      player.clear();
      player.y = maxHeight - 1;
      player.draw();
    }
  } else if (e.keyCode == 48) { // 0
    player.clear();
    player.x = 0;
    player.draw();
  } else if (e.keyCode == 73) { // i
    insertMode = true;
    drawText('INSERT');
  } else if (e.keyCode == 72) { // h
    player.moveLeft(numKey);
  } else if (e.keyCode == 74) { // j
    player.moveDown(numKey);
  } else if (e.keyCode == 75) { // k
    player.moveUp(numKey);
  } else if (e.keyCode == 76) { // l
    player.moveRight(numKey);
  } else if (e.keyCode > 48 && e.keyCode <= 57) { // 1-9
    numKey = e.keyCode - 48;
  } else if (e.keyCode == 87) { // w
    var original = player.x;
    player.clear();
    while (!checkCollision() && player.x < maxWidth) {
      player.x += 1;
    }
    player.x = (player.x == maxWidth) ? original : player.x;
    player.draw();
  } else if (e.keyCode == 66) { // b
    var original = player.x;
    player.clear();
    while (!checkCollision() && player.x >= 0) {
      player.x -= 1;
    }
    player.x = (player.x == -1) ? original : player.x;
    player.draw();
  } else if (e.keyCode == 71) { // g
    if (gmod) {
      player.clear();
      player.y = 0;
      player.draw();
      gmod = false;
    } else {
      gmod = true;
    }
  } else {
    gmod = false;
    return false;
  }
}, true);

window.addEventListener('keyup', function (e) {
  if (e.keyCode == 16) {
    shift = false;
  }
});

function reset() {
  score = 0;
  enemies = [];
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  nugget.move();
  redraw();
  drawText(url);
  insertMode = false;
  clearTimeout(monsterTimeout);
  monsterTimeout = setTimeout(spawnMonster, 10000);
}

function checkCollision() {
  var gotNugget = false;

  if (nugget.x == player.x && nugget.y == player.y) {
    score += 500;
    highScore = Math.max(score, highScore);
    nugget.move();
    gotNugget = true;
  }

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];

    if (e.x == player.x && e.y == player.y) {
      reset();
      return true;
    }
  }

  return gotNugget;
}

function redraw() {
  context.beginPath();
  context.rect(0, 0, width * maxWidth, height * maxHeight);
  context.fillStyle = "black";
  context.fill();
  context.beginPath();
  context.rect(0, player.y * height, width * maxWidth, height);
  context.fillStyle = "#111111";
  context.fill();

  player.clear();
  player.draw();

  nugget.clear();
  nugget.draw();

  enemies.forEach(function (enemy) {
    enemy.clear();
    enemy.draw();
  });
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

function spawnMonster() {
  enemies.push({
    x: Math.floor(Math.random() * maxWidth),
    y: Math.floor(Math.random() * maxHeight),
    width: width,
    height: height,
    color: 'orange',
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
      var dx = signum(player.x - this.x);
      var dy = signum(player.y - this.y);
      this.x += dx;
      this.y += dy;
      this.draw();
    }
  });
}

function signum(n) {
  return (n > 0) - (n < 0);
}
