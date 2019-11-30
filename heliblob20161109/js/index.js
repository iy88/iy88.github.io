'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var c,
    cx,
    width,
    height,
    points,
    count,
    player,
    speed = 4,
    numPoints,
    smoke,
    gravity = 0.09,
    thrust = 0.2,
    animationFrameId,
    tau = Math.PI * 2,
    sectionWidth = 20,
    caveHeight,
    groundHeight,
    distance,
    resetSwitch = document.getElementsByClassName('reset'),
    startMessage = document.getElementById('start'),
    startButton = document.getElementById('startBtn'),
    gameOverMessage = document.getElementById('gameover');

resetSwitch.onclick = function (e) {
    e.preventDefault();
    init();
    loop();
};

startButton.onclick = function (e) {
    e.preventDefault();
    startMessage.innerHTML = '';
    loop();
};

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

var SmokeParticle = function () {
    function SmokeParticle(x, y) {
        _classCallCheck(this, SmokeParticle);

        this.x = x;
        this.y = y;
        this.radius = rand(2, 6);
        this.dx = rand(-0.5, 0.5);
        this.dy = rand(1, 4);
        this.age = 0;
        this.lifeSpan = rand(20, 60);
        this.colours = newColours();
    }

    SmokeParticle.prototype.draw = function draw() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, tau);
        cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
        cx.fill();
    };

    SmokeParticle.prototype.step = function step() {
        this.dy += gravity * 2;
        var groundY = groundYatX(this.x);
        if (this.y >= groundY) {
            this.dy *= -1;
            if (rand(0, 1) > 0.5) {
                this.dx += 3;
            } else {
                this.dx -= 3;
            }
        }
        this.x += this.dx;
        this.y += this.dy;
        this.age++;
    };

    return SmokeParticle;
}();

var Player = function () {
    function Player(x, y) {
        _classCallCheck(this, Player);

        this.x = x;
        this.y = y;
        this.dy = 0;
        this.radius = 15;
        this.colours = newColours();
    }

    Player.prototype.draw = function draw() {
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, tau);
        cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
        cx.fill();
    };

    Player.prototype.step = function step() {
        this.y += this.dy;
        this.dy += gravity;
    };

    Player.prototype.boost = function boost() {
        this.dy -= thrust;
        addSmokeParticle(6);
    };

    return Player;
}();

var Point = function () {
    function Point(x, y) {
        _classCallCheck(this, Point);

        this.radius = 2;
        this.colours = newColours();
        this.x = x;
        this.y = y;
    }

    Point.prototype.draw = function draw() {
        // Ground:
        cx.beginPath();
        cx.arc(this.x, this.y, this.radius, 0, tau);
        cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
        cx.fill();
        // Roof:
        cx.beginPath();
        cx.arc(this.x, this.y - caveHeight, this.radius, 0, tau);
        cx.fillStyle = 'rgba(' + this.colours.r + ',' + this.colours.g + ',' + this.colours.b + ', 1)';
        cx.fill();
    };

    return Point;
}();

function addSmokeParticle() {
    var num = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    for (var n = 0; n < num; n++) {
        var xDiff = rand(0, 1);
        var yDiff = 0;
        smoke.push(new SmokeParticle(player.x + xDiff, player.y + player.radius + yDiff));
    }
}

function newColours() {
    var r = Math.floor(rand(64, 128));
    var g = Math.floor(rand(0, 64));
    var b = Math.floor(rand(128, 255));
    return { r: r, g: g, b: b };
}

function drawLines() {

    for (var p = 0; p < points.length; p++) {
        if (p < points.length - 1) {
            var point = points[p];
            var nextPoint = points[p + 1];
            var colours = newColours();
            // Ground:
            cx.beginPath();
            cx.moveTo(point.x, point.y);
            cx.lineTo(nextPoint.x, nextPoint.y);
            cx.lineWidth = 1;
            cx.strokeStyle = 'rgba(' + colours.r + ',' + colours.g + ',' + colours.b + ', 1)';
            cx.stroke();
            // Roof:
            cx.beginPath();
            cx.moveTo(point.x, point.y - caveHeight);
            cx.lineTo(nextPoint.x, nextPoint.y - caveHeight);
            cx.lineWidth = 1;
            cx.strokeStyle = 'rgba(' + colours.r + ',' + colours.g + ',' + colours.b + ', 1)';
            cx.stroke();
        }
    }
}

function groundYatX(x) {

    for (var p = 0; p < points.length; p++) {
        var point = points[p];
        if (x < point.x + sectionWidth && x > point.x - sectionWidth) {
            return point.y;
        }
    }
}

function gameOver() {

    window.cancelAnimationFrame(animationFrameId);
    gameOverMessage.innerHTML = '<h1>Game Over</h1><h2>Distance: ' + Math.floor(distance / 10) + '</h2>';
}

function checkCollision() {

    var groundY = groundYatX(player.x);
    if (player.y + player.radius >= groundY || player.y - player.radius <= groundY - caveHeight) {
        gameOver();
    }
}

function loop() {

    distance++;

    var details = document.getElementById('details');
    var groundY = groundYatX(player.x);
    details.innerHTML = 'Distance: ' + Math.floor(distance / 10);

    animationFrameId = window.requestAnimationFrame(loop);
    cx.clearRect(0, 0, width, height);

    kd.tick();

    kd.SPACE.down(function () {
        player.boost();
    });

    if (points.length === 0 || points[points.length - 1].x <= width - sectionWidth) {

        var x = width;

        var yTemp = noise.simplex2(count, count);
        count += 0.03;
        var y = yTemp * 50 + groundHeight;
        points.push(new Point(x, y));

        if (points.length > numPoints) {
            points.shift();
        }
    }

    for (var p = 0; p < points.length; p++) {
        var point = points[p];
        point.x -= speed;
        point.draw();
    }

    drawLines();

    player.step();
    player.draw();

    for (var s = 0; s < smoke.length; s++) {
        var smokeParticle = smoke[s];
        smokeParticle.step();
        smokeParticle.draw();
        if (smokeParticle.age >= smokeParticle.lifeSpan) {
            smoke.shift();
        }
    }

    checkCollision();
}

function init() {

    c = document.querySelector('canvas');
    width = c.width = window.innerWidth;
    height = c.height = window.innerHeight;
    cx = c.getContext('2d');

    window.addEventListener('resize', function () {
        width = c.width = window.innerWidth;
        height = c.height = window.innerHeight;
    }, false);

    cx.globalCompositeOperation = 'lighter';
    cx.shadowColor = 'rgba(212, 67, 49, 0.6)';
    cx.shadowBlur = 18;

    count = 0;
    distance = 0;
    groundHeight = height / 1.2;
    caveHeight = height / 1.5;
    points = [];
    smoke = [];

    gameOverMessage.innerHTML = '';
    numPoints = Math.ceil(width / sectionWidth);
    noise.seed(rand(0, 200));

    player = new Player(width / 2, height / 4);
}

init();