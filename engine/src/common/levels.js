import buildingTypes from "./buildingTypes";

const hasBuildingOfType = (settlement, type) =>
  Object.values(settlement.buildings).some(
    building => building.type === type.id
  );

export default [
  {
    id: 0,
    objective: "Verify settlement",
    objectiveMet: settlement => settlement.active,
    points: 10,
    buildingRewards: [
      buildingTypes.quarry,
      buildingTypes.woodcutter,
      buildingTypes.sawmill,
      buildingTypes.forester
    ],
    // set by the starting resources
    resourceRewards: [] //["stoneDeposit", "tree", "stone", "lumber", "plank"]
  },
  {
    id: 1,
    objective: "Build a Quarry, a Woodcutter's hut and a Sawmill",
    objectiveMet: settlement =>
      hasBuildingOfType(settlement, buildingTypes.quarry) &&
      hasBuildingOfType(settlement, buildingTypes.woodcutter) &&
      hasBuildingOfType(settlement, buildingTypes.sawmill),
    points: 10,
    buildingRewards: [
      buildingTypes.waterworks,
      buildingTypes.farm,
      buildingTypes.mill,
      buildingTypes.bakery
    ],
    resourceRewards: ["water", "grain", "flour", "bread"]
  },
  {
    id: 2,
    objective: "Build a Waterworks, a Farm, a Mill and a Bakery",
    objectiveMet: settlement =>
      hasBuildingOfType(settlement, buildingTypes.waterworks) &&
      hasBuildingOfType(settlement, buildingTypes.farm) &&
      hasBuildingOfType(settlement, buildingTypes.mill) &&
      hasBuildingOfType(settlement, buildingTypes.bakery),
    points: 10,
    buildingRewards: [
      buildingTypes.hunter,
      buildingTypes.fishery,
      buildingTypes.coalMine,
      buildingTypes.goldMine,
      buildingTypes.goldSmelting,
      buildingTypes.goldMint
    ],
    resourceRewards: ["meat", "fish", "coal", "goldOre", "goldBar", "goldCoin"]
  },
  {
    id: 3,
    objective:
      "Build a Coal Mine, a Gold Mine, a Gold Smelting and a Gold Mint",
    objectiveMet: settlement =>
      hasBuildingOfType(settlement, buildingTypes.coalMine) &&
      hasBuildingOfType(settlement, buildingTypes.goldMine) &&
      hasBuildingOfType(settlement, buildingTypes.goldSmelting) &&
      hasBuildingOfType(settlement, buildingTypes.goldSmelting),
    points: 10,
    buildingRewards: [],
    resourceRewards: ["coal", "goldOre", "goldBar", "goldCoin"]
  },
  {
    id: 4,
    objective: "Produce 20 Gold Coins",
    objectiveMet: settlement => settlement.resources["goldCoin"] >= 20,
    points: 10,
    buildingRewards: [],
    resourceRewards: []
  },
  {
    id: 5,
    objective: "Prosper!",
    objectiveMet: () => false, // last level
    points: 10,
    buildingRewards: [],
    resourceRewards: []
  }
];
