import { buildingTypes } from "./buildingTypes";

export class Level {
  constructor({
    id,
    objective,
    objectiveMet,
    points,
    unlockedBuildings,
    unlockedResources
  }) {
    this.id = id;
    this.objective = objective;
    this.objectiveMet = objectiveMet;
    this.points = points;
    this.unlockedBuildings = unlockedBuildings;
    this.unlockedResources = unlockedResources;
  }

  toState() {
    return this.id;
  }
}

const level1 = new Level({
  id: "1",
  objective: "Build a Quarry, a Woodcutter's hut and a Sawmill",
  objectiveMet: settlment =>
    settlment.hasBuildingOfType(buildingTypes.quarry) &&
    settlment.hasBuildingOfType(buildingTypes.woodcutter) &&
    settlment.hasBuildingOfType(buildingTypes.sawmill),
  points: 10,
  unlockedBuildings: [
    buildingTypes.quarry,
    buildingTypes.woodcutter,
    buildingTypes.sawmill,
    buildingTypes.forester
  ],
  unlockedResources: ["stoneDeposit", "tree", "stone", "lumber", "plank"]
});

const level2 = new Level({
  id: "2",
  objective: "Build a Waterworks, a Farm, a Mill and a Bakery",
  objectiveMet: settlment =>
    settlment.hasBuildingOfType(buildingTypes.waterworks) &&
    settlment.hasBuildingOfType(buildingTypes.farm) &&
    settlment.hasBuildingOfType(buildingTypes.mill) &&
    settlment.hasBuildingOfType(buildingTypes.bakery),
  points: 10,
  unlockedBuildings:
    level1.unlockedBuildings +
    [
      buildingTypes.waterworks,
      buildingTypes.farm,
      buildingTypes.mill,
      buildingTypes.bakery
    ],
  unlockedResources:
    level1.unlockedResources + ["water", "grain", "flour", "bread"]
});

const level3 = new Level({
  id: "3",
  objective: "Build a Coal Mine, a Gold Mine, a Gold Smelting and a Gold Mint",
  objectiveMet: settlment =>
    settlment.hasBuildingOfType(buildingTypes.coalMine) &&
    settlment.hasBuildingOfType(buildingTypes.goldMine) &&
    settlment.hasBuildingOfType(buildingTypes.goldSmelting) &&
    settlment.hasBuildingOfType(buildingTypes.goldSmelting),
  points: 10,
  unlockedBuildings:
    level2.unlockedBuildings +
    [
      buildingTypes.coalMine,
      buildingTypes.goldMine,
      buildingTypes.goldSmelting,
      buildingTypes.goldMint
    ],
  unlockedResources:
    level2.unlockedResources + ["coal", "goldOre", "goldBar", "goldCoin"]
});

const level4 = new Level({
  id: "4",
  objective: "Produce 20 Gold Coins",
  objectiveMet: settlement => settlement.resources["goldCoin"] >= 20,
  points: 10,
  unlockedBuildings: level3.unlockedBuildings,
  unlockedResources: level3.unlockedResources
});

const level5 = new Level({
  id: "5",
  objective: "Prosper!",
  objectiveMet: () => false, // last level
  points: 10,
  unlockedBuildings: level4.unlockedBuildings,
  unlockedResources: level4.unlockedResources
});

export const nextLevel = currentLevel =>
  ({ 1: level2, 2: level3, 3: level4, 4: level5 }[currentLevel.id]);

export const levels = {
  level1,
  level2,
  level3,
  level4,
  level5
};

export const fromState = id =>
  Object.entries(levels).find(([, level]) => level.id === id)[1];
