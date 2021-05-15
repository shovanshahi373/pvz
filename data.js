export const plants = {
  SUNFLOWER: "sunflower",
  PEASHOOTER: "peashooter",
  WALLNUT: "wall-nut",
  CHOMPER: "chomper",
  POTATOMINE: "potato mine",
};

export const zombieTypes = {
  BROWNCOAT: "brown-coat",
  CONEHEAD: "cone-head",
  BUCKETHEAD: "bucket-head",
};

export const zombies__collection = [
  {
    name: zombieTypes.BROWNCOAT,
    speed: 0.2,
    health: 50,
    attack: 10,
    interval: 100,
    sprite: {
      url: "./assets/images/zombies/browncoat/spritesheet.png",
    },
  },
  {
    name: zombieTypes.CONEHEAD,
    speed: 0.2,
    health: 100,
    attack: 11,
    interval: 100,
    sprite: {
      url: "./assets/images/zombies/conehead/conehead-spritesheet.png",
    },
  },
  {
    name: zombieTypes.BUCKETHEAD,
    speed: 0.2,
    health: 200,
    attack: 13,
    interval: 100,
    sprite: {
      url: "./assets/images/zombies/browncoat/spritesheet.png",
      // ".75-1": {
      //   walking: "./assets/images/zombies/browncoat/spritesheet.png",
      //   attacking: "",
      // },
      // ".50-75": {
      //   walking: "./assets/images/zombies/browncoat/spritesheet.png",
      //   attacking: "",
      // },
      // ".25-75": {
      //   walking: "./assets/images/zombies/browncoat/spritesheet.png",
      //   attacking: "",
      // },
      // ".1-25": {
      //   walking: "./assets/images/zombies/browncoat/spritesheet.png",
      //   attacking: "",
      // },
    },
  },
];

export const minionTypes = [
  {
    name: plants.SUNFLOWER,
    cost: 50,
    refresh: 8,
    health: 100,
    attack: 0,
    color: "gold",
    interval: 2000,
    activeDistance: 0,
    timer: 0,
    img: "./assets/images/plants/sunflower-static.png",
    sprite: {
      url: "./assets/images/plants/sunflower.png",
      modes: [
        {
          name: "idle",
          values: {
            x: 0,
            y: 0,
            width: 235,
            height: 35,
            count: 8,
          },
        },
        {
          name: "sunning",
          values: {
            x: 0,
            y: 33,
            width: 237,
            height: 33,
            count: 1,
          },
        },
      ],
    },
  },
  {
    name: plants.PEASHOOTER,
    cost: 100,
    refresh: 8,
    health: 150,
    attack: 10,
    color: "green",
    interval: 150,
    activeDistance: Number.POSITIVE_INFINITY,
    timer: 0,
    img: "./assets/images/plants/peashooter-static.png",
    sprite: {
      url: "./assets/images/plants/peashooter.png",
      modes: [
        {
          name: "idle",
          values: {
            x: 0,
            y: 0,
            width: 217,
            height: 31,
            count: 8,
          },
        },
        {
          name: "attack",
          values: {
            x: 0,
            y: 31,
            width: 79,
            height: 31,
            count: 3,
          },
        },
      ],
    },
  },
  {
    name: plants.WALLNUT,
    cost: 50,
    refresh: 15,
    health: 1000,
    attack: 0,
    color: "brown",
    interval: 1,
    activeDistance: 0,
    timer: 0,
    img: "./assets/images/plants/wallnut-static.png",
    sprite: {
      url: "./assets/images/plants/wall-nut.png",
      modes: [
        {
          name: "idle",
          values: {
            x: 0,
            y: 0,
            width: 135,
            height: 32,
            count: 5,
          },
        },
        {
          name: "attack",
          values: {
            x: 0,
            y: 32,
            width: 135,
            height: 32,
            count: 5,
          },
        },
        {
          name: "attack",
          values: {
            x: 0,
            y: 64,
            width: 145,
            height: 32,
            count: 5,
          },
        },
      ],
    },
  },
  {
    name: plants.CHOMPER,
    cost: 150,
    refresh: 20,
    health: 200,
    attack: 1000,
    color: "purple",
    interval: 5000,
    activeDistance: 1,
    timer: 0,
    img: "./assets/images/plants/chomper-static.png",
  },
  {
    name: plants.POTATOMINE,
    cost: 50,
    refresh: 25,
    health: 1,
    attack: 1000,
    color: "brown",
    interval: 500,
    activeDistance: 1,
    timer: 0,
    img: "./assets/images/plants/potatomine-static.png",
  },
];
