import { zombies__collection, minionTypes, plants } from "./data.js";
import levels from "./levels.js";
const canvas = document.querySelector("canvas");
canvas.height = 500;
canvas.width = innerWidth - 100;
const ctx = canvas.getContext("2d");
const zombieImages = {};
const zombieRef = new Image();
const laneRef = new Image();
const plantsRef = new Image();
const peashooterRef = new Image();
const lockRef = new Image();
const zomheadRef = new Image();
let zombiePool = [];
let plantsPool = [];
let totalZombies = 0;
laneRef.src = "./assets/images/zombies/tiles.jpg";
zombieRef.src = "./assets/images/zombies/browncoat/spritesheet.png";
plantsRef.src = "./assets/images/zombies/plants-spritesheet.png";
peashooterRef.src = "./assets/images/plants/peashooter.png";
lockRef.src = "./assets/images/others/lock.png";
zomheadRef.src = "./assets/images/zombies/zomhead.png";

const setImage = (url) => {
  const image = new Image();
  image.src = url;
  return image;
};

const peashooter = {
  spritesheet: setImage("./assets/images/plants/peashooter.png"),
  idle: {
    x: 0,
    y: 0,
    width: 217,
    height: 31,
    count: 8,
  },
  attack: {
    x: 0,
    y: 31,
    width: 79,
    height: 31,
    count: 3,
  },
};

plantsRef.addEventListener("load", function () {});
laneRef.addEventListener("load", function () {
  console.log("lanes loaded...");
});

let progress = 0;

const getLevel = (num = 1) => {
  const level = levels[1];
  // remainingTime = level.time;
  totalZombies = level.amount;
  zombiePool = level.zombies.reduce((pool, current) => {
    return [
      ...pool,
      ...Array.from({ length: (current.count * level.amount) | 0 }, (_) =>
        zombies__collection.find((z) => z.name === current.name)
      ),
    ];
  }, []);
  // remainingTime = level.amount;
  // zombiePool = zombies__collection.filter((zombie) =>
  //   level.zombies.some((z) => z === zombie.name)
  // );
  console.log(zombiePool);
  plantsPool = minionTypes.map((min) => ({
    ...min,
    locked: !level.plants.some((p) => p === min.name),
  }));
};

getLevel(1);

zombieRef.addEventListener("load", function () {
  // zombieImages.set("brown-coat", this);
  zombieImages["brown-coat"] = zombieRef;
  animate();
});

const offset = 100;
const fieldHeight = 80;
const fieldWidth = fieldHeight * 0.8;
let frame = 0;

let data = "";
let hold = false;
let difficulty = 1;
let gameover = false;
let sun = 300;

const mouse = {
  x: null,
  y: null,
  size: 10,
};

const cells = [];
const minions = [];
const zombies = [];
const suns = [];
const projectiles = [];
const healthbars = [];

class Sun {
  constructor(x, endY, startY = 0) {
    this.x = x;
    this.y = startY;
    this.endY = endY;
    this.dy = Math.random() + 0.5;
    this.size = 10;
  }
  update(i) {
    if (
      this.x <= mouse.x &&
      this.x + this.size >= mouse.x &&
      this.y <= mouse.y &&
      this.y + this.size >= mouse.y
    ) {
      suns.splice(i, 1);
      sun += 50;
      return;
    }
    if (this.y < this.endY) {
      this.y += this.dy;
    }
    this.draw();
  }
  draw() {
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }
}

const generateSun = () => {
  const x = Math.floor(Math.random() * canvas.width - 20) + 20;
  const y = Math.floor(Math.random() * canvas.height - offset) + offset;
  suns.push(new Sun(x, y));
};

const genId = (length = 10) => {
  return Array(length)
    .fill(0)
    .map((_) => ((Math.random() * 36) | 0).toString(36))
    .join("");
};

const hasCollided = (m1, m2) => {
  return m1.x < m2.x && m1.x + m1.width > m2.x + 0.5 * m2.width;
};

const imageStorage = {};

const loadImages = () => {
  plantsPool.forEach((min) => {
    const spritesheet = new Image();
    const staticImg = new Image();
    spritesheet.src = min.sprite?.url;
    staticImg.src = min.img;
    imageStorage[min.name] = {};
    spritesheet.addEventListener("load", (e) => {
      console.log("image loaded...");
      imageStorage[min.name].spritesheet = spritesheet;
    });
    staticImg.addEventListener("load", (e) => {
      console.log("pic loaded!!");
      imageStorage[min.name].staticImg = staticImg;
    });
  });
};

loadImages();

class Projectile {
  constructor(x, y, damage, dx, dy = 0) {
    this.x = x;
    this.y = y;
    this.idx = projectiles.length;
    this.width = fieldWidth;
    this.height = fieldHeight;
    this.size = fieldHeight * 0.1;
    this.dx = dx;
    this.dy = dy;
    this.damage = damage;
    // this.lane = null;
  }
  update(i) {
    const closestZombie =
      zombies
        .filter(
          (zombie) =>
            this.y === zombie.y && this.x + 10 <= zombie.x && !zombie.defeated
        )
        .sort((z1, z2) => z1.x - z2.x)
        .shift() || null;

    if (this.x - this.size >= canvas.width) {
      projectiles.splice(i, 1);
    } else if (closestZombie && closestZombie.health > 0) {
      if (hasCollided(this, closestZombie)) {
        clearTimeout(closestZombie.timeoutId);
        closestZombie.health = Math.floor(closestZombie.health - this.damage);
        closestZombie.showHealthBar = true;
        closestZombie.timeoutId = setTimeout(() => {
          closestZombie.showHealthBar = false;
        }, 5000);
        projectiles.splice(i, 1);
        closestZombie.options.color = "rgba(255,0,0,0.5)";
        setTimeout(() => {
          // closestZombie.options.color = "red";
          closestZombie.options.color = "transparent";
        }, 500);
      }
    }
    this.draw();
    this.x += this.dx;
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x + this.width, this.y + 20, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    // ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = fieldWidth;
    this.height = fieldHeight;
    this.size = fieldHeight;
  }
  update() {
    if (
      this.x < mouse.x &&
      this.x + this.width > mouse.x &&
      this.y < mouse.y &&
      this.y + this.height > mouse.y
    ) {
      ctx.strokeStyle = "rgba(255,255,255,1)";
    } else {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
    }
    this.draw();
  }
  draw() {
    ctx.drawImage(
      laneRef,
      58,
      13,
      95,
      145,
      this.x + 1,
      this.y + 1,
      this.width - 1,
      this.height - 1
    );
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

class Minion {
  constructor(x, y, options) {
    this.x = x;
    this.y = y;
    this.width = fieldWidth;
    this.height = fieldHeight;
    this.size = fieldHeight;
    this.currentTarget = null;
    this.options = options;
    this.maxHealth = options.health;
    this.showHealthBar = false;
    this.timeoutId = null;
    this.id = this.name + "-" + genId();
  }
  update() {
    this.draw();
  }
  draw() {
    ctx.fillStyle = this.options.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    if (this.showHealthBar) {
      const healthbarwidth = fieldWidth;
      const ratio = this.health / this.maxHealth;
      if (ratio <= 0.3) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "green";
      }
      const health = ratio * healthbarwidth;
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y - 50, healthbarwidth, 10);
      ctx.fillRect(this.x + 1, this.y - 50 + 1, health - 2, 10 - 2);
    }
  }
}

const distance = (m1, m2) => {
  return Math.floor((m1.x - m2.x) / fieldWidth);
};

class Card {
  constructor(x, y, width, height, data) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = data.name;
    this.cost = data.cost;
    this.locked = data.locked;
    this.image = this.loadImage(data.img);
    this.refresh = data.refresh;
    this.timer = 0;
    this.onTimeout = false;
    this.startTime = 0;
    this.endTime = 0;
    this.currentTime = 0;
    this.size = 70;
    this.angle = 0;
    // this.angle = Math.PI / 180;
    this.buffer = document.createElement("canvas").getContext("2d");
    this.buffer.canvas.height = this.height;
    this.buffer.canvas.width = this.width;
    this.buffer.imageSmoothingEnabled = "true";
  }
  loadImage(url) {
    try {
      const imageRef = new Image();
      imageRef.src = url;
      return imageRef;
    } catch (err) {
      return "";
    }
  }
  drawInBuffer() {
    this.buffer.clearRect(0, 0, this.width, this.height);
    this.buffer.fillStyle = "yellowgreen";
    this.buffer.fillRect(
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height
    );
    // console.log(imageStorage[this.name].staticImg?.constructor);
    if (imageStorage[this.name].staticImg) {
      this.buffer.drawImage(
        // this.image,
        imageStorage[this.name].staticImg,
        0,
        0,
        this.width,
        this.height,
        0.3 * this.width,
        0.3 * this.height,
        this.width,
        this.height
      );
    }
    this.buffer.strokeStyle = "brown";
    this.buffer.lineWidth = "5";
    this.buffer.strokeRect(
      0,
      0,
      this.buffer.canvas.width,
      this.buffer.canvas.height
    );
    this.buffer.fillStyle = "green";
    this.buffer.font = "10px Arial";
    this.buffer.textAlign = "center";
    this.buffer.fillText(this.cost, 0.2 * this.width, 0.2 * this.height);
    this.buffer.fillText(this.name, 0.5 * this.width, 0.9 * this.height);

    this.buffer.beginPath();
    this.buffer.fillStyle = "rgba(0,0,0,0.5)";
    this.buffer.moveTo(0.5 * this.width, 0.5 * this.height);
    this.buffer.lineTo(this.width, 0.5 * this.height);
    this.buffer.arc(
      0.5 * this.width,
      0.5 * this.height,
      this.height * 1.3,
      0,
      this.angle,
      true
    );
    this.buffer.lineTo(0.5 * this.width, 0.5 * this.height);
    this.buffer.fill();
    this.buffer.closePath();
    if (this.locked) {
      this.buffer.drawImage(
        lockRef,
        0,
        0,
        lockRef.width,
        lockRef.height,
        0.5 * this.width - 20,
        0.5 * this.height - 20,
        40,
        40
      );
    }
  }
  play() {
    if (this.onTimeout) return;
    if (!this.onTimeout) this.onTimeout = true;
    this.angle = 0;
    this.timer = 0;
    this.startTime = s;
    this.endTime = this.startTime + this.refresh;
  }
  update() {
    if (
      !this.locked &&
      sun >= this.cost &&
      this.onTimeout &&
      this.endTime > s
    ) {
      const ratio = 1 - (this.endTime - s) / (this.endTime - this.startTime);
      this.angle = ratio * 2 * Math.PI;
    } else {
      this.onTimeout = false;
      this.angle = sun >= this.cost && !this.locked ? 0 : 2 * Math.PI;
      this.timer = 0;
    }
    this.draw();
  }
  draw() {
    this.drawInBuffer();
    ctx.drawImage(this.buffer.canvas, this.x, this.y, this.width, this.height);
  }
}

class Plant extends Minion {
  constructor(x, y, options) {
    super(x, y, options);
    this.name = options?.name;
    this.health = options?.health;
    this.attack = options?.attack;
    this.spritesheet = options?.sprite;
    this.state = "idle";
    this.timer = 0;
    this.FrameX = 0;
    this.FrameY = 0;
    this.imageRef = null;
    // this.Frames = Math.floor(620 / 18);
    // this.Frames = Math.floor(217 / 8);
    this.Frames = 26;
    this.loadImage(this.spritesheet.url);
  }
  loadImage(image) {
    this.imageRef = imageStorage[this.name].spritesheet;
  }
  shouldActivate(zombie) {
    return distance(zombie, this) <= this.options.activeDistance;
  }
  update() {
    const closestZombie =
      zombies
        .filter(
          (zombie) =>
            this.y === zombie.y && this.x - 10 <= zombie.x && !zombie.defeated
        )
        .sort((z1, z2) => z1.x - z2.x)
        .shift() || null;
    if (closestZombie && this.timer % this.options.interval === 0) {
      if (this.name === plants.PEASHOOTER) {
        projectiles.push(
          new Projectile(this.x + this.width, this.y, this.attack, 2)
        );
      } else if (this.name === plants.SUNFLOWER) {
        suns.push(
          new Sun(this.x + 0.5 * this.width, this.y + 0.5 * this.height, this.y)
        );
      }
    }
    if (closestZombie && this.shouldActivate(closestZombie)) {
      this.state = "attack";
    } else {
      this.state = "idle";
    }

    this.draw();
    ctx.save();
    ctx.translate(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
    ctx.scale(1.2, 1.2);
    const {
      values: { x, y, height, width, count },
    } = this.spritesheet.modes.find((m) => m.name === this.state);
    if (this.imageRef) {
      ctx.drawImage(
        this.imageRef,
        x + this.FrameX * (width / count),
        y,
        width / count,
        height,
        -0.5 * this.width,
        -0.5 * this.height,
        this.width - 10,
        this.width
      );
    }
    if (frame % 20 === 0) {
      this.FrameX = this.FrameX % (count - 1);
      this.FrameX++;
    }
    this.timer++;
    ctx.restore();
  }
}

class Zombie extends Minion {
  constructor(x, y, options) {
    super(x, y, options);
    this.speed = options?.speed || 1;
    this.name = options?.name;
    this.health = options?.health;
    this.attack = options?.attack;
    this.defeated = false;
    this.sprite = this.loadImage(options?.sprite.url);
    this.originalspeed = this.speed;
    this.timer = 0;
    this.FrameX = 0;
    this.FrameY = 0;
    this.Frames = Math.floor(this.sprite.width / 6);
    console.log(this.Frames);
  }
  loadImage(url) {
    const img = new Image();
    img.src = url;
    return img;
  }
  update(i) {
    if (this.defeated || this.health <= 0) {
      this.speed = 0;
      this.options.color = "rgba(255,0,0,0.3)";
      zombies.splice(i, 1);
      return;
    }
    const targetPlantIndex = minions.findIndex((minion) => {
      // 0.5*minion.size because we want zombie to stop halfway at the plant's tile
      return (
        this.x < minion.x + 0.5 * minion.width &&
        this.x + this.width > minion.x + 0.5 * minion.width &&
        minion.y === this.y
      );
    });
    if (targetPlantIndex !== -1) {
      this.currentTarget = minions[targetPlantIndex];
      this.speed = 0;
    } else {
      this.currentTarget = null;
      this.speed = this.originalspeed;
    }
    if (this.currentTarget && this.timer % this.options.interval === 0) {
      clearTimeout(this.currentTarget.timeoutId);
      this.currentTarget.health = Math.floor(
        this.currentTarget.health - this.attack
      );
      this.currentTarget.showHealthBar = true;
      this.currentTarget.timeoutId = setTimeout(() => {
        this.currentTarget.showHealthBar = false;
      }, 5000);
    }
    if (this.currentTarget && this.currentTarget.health <= 0) {
      this.currentTarget = null;
      minions.splice(targetPlantIndex, 1);
    }
    if (this.x >= 0) {
      this.x -= this.speed;
    } else {
      gameover = true;
    }
    this.draw();
    ctx.save();
    ctx.translate(this.x, this.y - 0.5 * this.width);
    ctx.drawImage(
      this.sprite,
      this.FrameX * (this.Frames - 0.7),
      0,
      this.Frames,
      54,
      this.FrameX,
      this.FrameY,
      this.width,
      this.height * 1.5
    );
    if (frame % 10 === 0) {
      this.FrameX = this.FrameX % 5;
      this.FrameX++;
    }
    ctx.restore();
    this.timer++;
  }
}

//init
for (let i = offset; i < canvas.height; i += fieldHeight) {
  for (let j = 0; j < canvas.width; j += fieldWidth) {
    cells.push(new Cell(j, i));
  }
}
const cards = new Map();
for (let i = 0; i < plantsPool.length; i++) {
  const card = new Card(
    (i + 1) * 70,
    10,
    fieldWidth,
    fieldHeight,
    plantsPool[i]
  );
  cards.set(plantsPool[i].name, card);
}

let timeStamp = 0;
let timeBucket = 0;
let ms = 0;
let s = 0;
let min = 0;
let spawnCycle = 500;
let spawnRate = 1;

const animate = (currentTime = 0) => {
  const deltaTime = currentTime - timeStamp;
  timeBucket += deltaTime;
  timeStamp = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, canvas.width, offset);
  for (let i = 0; i < cells.length; i++) {
    cells[i].update();
  }
  for (let i = 0; i < minions.length; i++) {
    minions[i].update();
  }

  if (timeBucket >= 100) {
    ms = ms + 100;
    s = +(ms / 1000).toFixed(2);
    // remainingTime -= +(ms / 1000).toFixed(2);
    timeBucket = 0;
  }

  for (let i = 0; i < cards.size; i++) {
    cards.get(plantsPool[i].name).update();
  }

  ctx.font = "20px Arial";
  ctx.fillText(s + "s ", canvas.width - 200, 50, 200);
  ctx.fillText(sun, 10, 60, 70);

  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  ctx.strokeRect(canvas.width - 300, 80, 200, 10);
  ctx.fillStyle = "green";
  const progress = ((totalZombies - zombiePool.length) / totalZombies) * 200;
  ctx.fillRect(canvas.width - 300 + 1, 80 + 1, progress - 2, 10 - 2);

  ctx.drawImage(
    zomheadRef,
    0,
    0,
    zomheadRef.width,
    zomheadRef.height,
    canvas.width - 300 + progress - 10,
    80 - 4,
    20,
    20
  );

  for (let i = 0; i < zombies.length; i++) {
    zombies[i].update(i);
  }

  if (hold && mouse.y > offset) {
    const card = cards.get(data.name);
    if (!card.locked && !card.onTimeout) {
      ctx.drawImage(
        card.image,
        mouse.x - 0.5 * fieldWidth,
        mouse.y - 0.5 * fieldHeight,
        fieldWidth,
        fieldHeight
      );
    }
  }
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update(i);
  }
  if (zombiePool.length && frame % spawnCycle === 0) {
    for (let i = 0; i < spawnRate && zombiePool.length; i++) {
      const rng = Math.floor(Math.random() * 5);
      const delay = Math.random() * 4 + 1;
      setTimeout(() => {
        const zombie = zombiePool.shift();
        zombies.push(
          new Zombie(canvas.width, rng * fieldHeight + offset, {
            color: "transparent",
            ...zombie,
          })
        );
      }, delay * 100);
      // const zombie = zombiePool.shift();
      // zombies.push(
      //   new Zombie(canvas.width, rng * fieldHeight + offset, {
      //     color: "transparent",
      //     ...zombie,
      //   })
      // );
    }
    if (zombiePool.length < 0.9 * totalZombies) spawnCycle = 400;
    if (zombiePool.length < 0.8 * totalZombies) spawnCycle = 300;
    if (zombiePool.length < 0.7 * totalZombies) spawnCycle = 200;
    if (zombiePool.length < 0.5 * totalZombies) spawnCycle = 100;
    spawnRate = (((Math.random() * (800 - spawnCycle)) / 100) | 0) + 1;
  }
  if (frame % 1000 === 0) generateSun();
  for (let i = 0; i < suns.length; i++) suns[i].update(i);
  if (gameover) {
    ctx.fillStyle = "green";
    ctx.font = "100px zombie";
    ctx.textAlign = "center";

    ctx.fillText(
      "The Zombies ate",
      0.45 * window.innerWidth,
      0.3 * innerHeight
    );
    ctx.strokeText(
      "The Zombies ate",
      0.45 * window.innerWidth,
      0.3 * innerHeight
    );
    ctx.fillText("your brainz!", 0.45 * window.innerWidth, 0.5 * innerHeight);
    ctx.strokeText("your brainz!", 0.45 * window.innerWidth, 0.5 * innerHeight);
  } else if (!gameover && !zombies.length && !zombiePool.length) {
    ctx.font = "100px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(
      "level completed!",
      0.45 * window.innerWidth,
      0.3 * innerHeight
    );
    ctx.strokeText(
      "level completed!",
      0.45 * window.innerWidth,
      0.3 * innerHeight
    );
  }
  if (frame < 99) {
    ctx.save();
    ctx.translate(0.5 * window.innerWidth, 0.5 * window.innerHeight);
    ctx.scale(frame / 100, frame / 100);
    ctx.font = "100px zombie";
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("The Zombies", 0, 0);
    ctx.strokeText("The Zombies", 0, 0);
    ctx.fillText("are coming!", 0, 200);
    ctx.strokeText("are coming!", 0, 200);
    ctx.restore();
  }
  frame++;
  requestAnimationFrame(animate);
};

const placeMinion = (e) => {
  if (e.offsetY < offset) return;
  const cellX = e.offsetX - (e.offsetX % fieldWidth);
  const cellY = e.offsetY - ((e.offsetY - offset) % fieldHeight);
  const canPlace = !minions.some((min) => min.x === cellX && min.y === cellY);
  const card = cards.get(data.name);
  if (canPlace && sun >= data.cost && card && !card.onTimeout) {
    card.play();
    minions.push(new Plant(cellX, cellY, { ...data, color: "transparent" }));
    sun -= data.cost;
    data = null;
  }
};

// animate();

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});

canvas.addEventListener("mouseleave", (e) => {
  mouse.x = null;
  mouse.y = null;
});

canvas.addEventListener("mousedown", (e) => {
  hold = true;
  if (
    e.offsetY >= 0 &&
    e.offsetY <= offset &&
    e.offsetX >= 70 &&
    e.offsetX <= 70 * (plantsPool.length + 1)
  ) {
    const f = e.offsetX - 70 - ((e.offsetX - 70) % 70);
    const g = f / 70;
    console.log(g);
    if (plantsPool[g]) {
      data = plantsPool[g];
    }
  }
});

canvas.addEventListener("mouseup", (e) => {
  hold = false;
  if (data) {
    placeMinion(e);
  }
});
