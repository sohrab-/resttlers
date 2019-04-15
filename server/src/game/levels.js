import { buildingTypes } from "./buildingTypes";

export class Level {
  constructor({ id, objective, points, unlockedBuildings, unlockedResources }) {
    this.id = id;
    this.objective = objective;
    this.points = points;
    this.unlockedBuildings = unlockedBuildings;
    this.unlockedResources = unlockedResources;
  }
}

const level1 = new Level({
  id: "1",
  objective: "Build a Quarry, a Woodcutter's hut and a Sawmill",
  point: 10,
  unlockedBuildings: [
    buildingTypes.quarry,
    buildingTypes.woodcutter,
    // TODO sawmill
    buildingTypes.forrester
  ],
  unlockedResources: ["stoneDeposit", "tree", "stone", "plank"]
});

const level2 = new Level({
  id: "2",
  objective: "Build a Well, a Farm, a Mill and a Bakery",
  point: 10,
  unlockedBuildings:
    level1.unlockedBuildings +
    [
      // TODO Well, Farm, Mill, Bakery
    ],
  unlockedResources:
    level1.unlockedResources + ["water", "grain", "flour", "bread"]
});

export const levels = {
  level1,
  level2
};
