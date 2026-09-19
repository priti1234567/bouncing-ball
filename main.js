// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape{
    constructor(x, y, velX, velY){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }

}
class Ball extends Shape{

    constructor(x, y, velX, velY, color, size, exits){
        super(x, y, velX, velY);
        this.color = color;
        this.size = size;
        this.exists = true;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2* Math.PI);
        ctx.fill();
    }
    update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape{
    constructor(x, y){
        super(x, y, 20, 20);
        this.color = "white";
        this.size = 10;
    }
    draw(){
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2* Math.PI);
        ctx.stroke();
    }
    checkBounds(){
      if (this.x - this.size < 0) {
        this.x = this.size;
      }

      if (this.x + this.size > width) {
        this.x = width - this.size;
      }

      if (this.y - this.size < 0) {
        this.y = this.size;
      }

      if (this.y + this.size > height) {
        this.y = height - this.size;
      }
    }
    collisionDetect(){
      for (const ball of balls) {
        if (ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.exists = false;
          }
        }
      }
    }

}
const evilCircle = new EvilCircle(50, 50);
const testBall = new Ball(50, 100, 4, 4, "blue", 10);
testBall.x;
testBall.size;
testBall.color;
testBall.draw();

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
  );

  balls.push(ball);
}
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
  }

  requestAnimationFrame(loop);
}
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
      
    }
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();
  updateBallCount();

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
    case "a":
    case "A":
      evilCircle.x -= evilCircle.velX;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      evilCircle.x += evilCircle.velX;
      break;
    case "ArrowUp":
    case "w":
    case "W":
      evilCircle.y -= evilCircle.velY;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      evilCircle.y += evilCircle.velY;
      break;
    default:
      return;
  }

  // Prevent page scrolling when arrow keys are used for game control.
  e.preventDefault();
});

const para = document.querySelector("p");

function updateBallCount() {
  const count = balls.filter(ball => ball.exists).length;
  if (para) {
    para.textContent = `Ball count: ${count}`;
  }
}

loop();


