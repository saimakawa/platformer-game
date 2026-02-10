// ======================
// GAME CONSTANTS
// ======================
const gravity = 0.5;
const speed = 2;

// ======================
// CANVAS SETUP
// ======================
const gameCanvas = document.querySelector("#gameCanvas");
gameCanvas.width = window.innerWidth * 0.9;
gameCanvas.height = window.innerHeight * 0.8;

const context = gameCanvas.getContext("2d");

// ======================
// KEY CONTROLS
// ======================
const keys = {
  right: false,
  left: false,
};

// ======================
// PLAYER CLASS
// ======================
class Player {
  constructor() {
    this.position = {
      x: 150,
      y: 300,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.width = 25;
    this.height = 25;
  }

  draw() {
    // Player UI enhancement (rounded + shadow)
    context.save();
    context.fillStyle = "#1d3557";
    context.shadowColor = "rgba(0,0,0,0.4)";
    context.shadowBlur = 10;

    context.beginPath();
    context.roundRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      6,
    );
    context.fill();
    context.restore();
  }

  update() {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.y + this.height + this.velocity.y >= gameCanvas.height)
      this.velocity.y = 0;
    else this.velocity.y += gravity;

    this.draw();
  }
}

// ======================
// PLATFORM CLASS
// ======================
class Platform {
  constructor(x, y, width, height) {
    this.position = {
      x: x,
      y: y,
    };
    this.width = width;
    this.height = height;
  }

  draw() {
    // Platform UI enhancement
    context.save();
    context.fillStyle = "#e63946";
    context.shadowColor = "rgba(0,0,0,0.5)";
    context.shadowBlur = 12;
    context.shadowOffsetY = 6;

    context.fillRect(this.position.x, this.position.y, this.width, this.height);

    context.restore();
  }
}

// ======================
// GAME OBJECTS
// ======================
const player = new Player();

const platform = new Platform(350, gameCanvas.height - 120, 120, 20);

// ======================
// ANIMATION LOOP
// ======================
function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  platform.draw();
  player.update();

  if (keys.right && player.position.x <= gameCanvas.width - 100)
    player.velocity.x = speed;
  else if (keys.left && player.position.x >= 0) player.velocity.x = -speed;
  else player.velocity.x = 0;

  // Horizontal collision
  if (
    player.position.x + player.width >= platform.position.x &&
    player.position.x <= platform.position.x + platform.width &&
    player.position.y + player.height >= platform.position.y &&
    player.position.y <= platform.position.y + platform.height
  )
    player.velocity.x = 0;

  // Vertical collision (landing on platform)
  if (
    player.position.y + player.height + player.velocity.y >=
      platform.position.y &&
    player.position.x + player.width >= platform.position.x &&
    player.position.x <= platform.position.x + platform.width
  )
    player.velocity.y = 0;
}

animate();

// ======================
// KEY EVENTS
// ======================
addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowUp") player.velocity.y = -11;
});

addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowLeft") keys.left = false;
});
