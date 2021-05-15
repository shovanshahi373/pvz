import { zombieTypes, plants } from "./data.js";

const levels = {
  1: {
    name: "level-1",
    // zombies: [zombieTypes.BROWNCOAT],
    zombies: [
      {
        name: zombieTypes.BROWNCOAT,
        count: 1,
      },
    ],
    plants: [plants.SUNFLOWER, plants.PEASHOOTER, plants.WALLNUT],
    time: 180,
    amount: 100,
  },
  2: {
    name: "level-2",
    // zombies: [zombieTypes.BROWNCOAT, zombieTypes.CONEHEAD],
    zombies: [
      {
        name: zombieTypes.BROWNCOAT,
        count: 0.7,
      },
      {
        name: zombieTypes.CONEHEAD,
        count: 0.3,
      },
    ],
    plants: [plants.SUNFLOWER, plants.PEASHOOTER, plants.WALLNUT],
    time: 240,
    amount: 200,
  },
  3: {
    name: "level-3",
    zombies: [
      {
        name: zombieTypes.BROWNCOAT,
        count: 0.6,
      },
      {
        name: zombieTypes.CONEHEAD,
        count: 0.2,
      },
      {
        name: zombieTypes.BUCKETHEAD,
        count: 0.2,
      },
    ],
    plants: [plants.SUNFLOWER, plants.PEASHOOTER, plants.WALLNUT],
    time: 300,
    amount: 300,
  },
};

export default levels;
