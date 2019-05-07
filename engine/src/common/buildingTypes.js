export default {
  quarry: {
    id: "quarry",
    name: "Quarry",
    cost: { plank: 2 },
    consumes: { stoneDeposit: 1 },
    produces: { stone: 1 },
    buildTime: 20,
    productionTime: 20
  },
  forester: {
    id: "forester",
    name: "Forester",
    cost: { plank: 2 },
    consumes: {},
    produces: { tree: 1 },
    buildTime: 20,
    productionTime: 20
  },
  woodcutter: {
    id: "woodcutter",
    name: "Woodcutter",
    cost: { plank: 2 },
    consumes: { tree: 1 },
    produces: { lumber: 1 },
    buildTime: 20,
    productionTime: 20
  },
  sawmill: {
    id: "sawmill",
    name: "Sawmill",
    cost: { stone: 2, plank: 2 },
    consumes: { lumber: 1 },
    produces: { plank: 1 },
    buildTime: 20,
    productionTime: 20
  },
  waterworks: {
    id: "waterworks",
    name: "Waterworks",
    cost: { plank: 2 },
    consumes: {},
    produces: { water: 1 },
    buildTime: 20,
    productionTime: 20
  },
  farm: {
    id: "farm",
    name: "Farm",
    cost: { stone: 3, plank: 3 },
    consumes: { water: 2 },
    produces: { grain: 1 },
    buildTime: 30,
    productionTime: 30
  },
  mill: {
    id: "mill",
    name: "Mill",
    cost: { stone: 2, plank: 2 },
    consumes: { grain: 1 },
    produces: { flour: 1 },
    buildTime: 20,
    productionTime: 30
  },
  bakery: {
    id: "bakery",
    name: "Bakery",
    cost: { stone: 2, plank: 2 },
    consumes: { flour: 1, water: 2 },
    produces: { bread: 1 },
    buildTime: 20,
    productionTime: 30
  },
  fishery: {
    id: "fishery",
    name: "Fishery",
    cost: { plank: 2 },
    consumes: {},
    produces: { fish: 1 },
    buildTime: 20,
    productionTime: 120
  },
  hunter: {
    id: "hunter",
    name: "Hunter",
    cost: { plank: 2 },
    consumes: {},
    produces: { meat: 1 },
    buildTime: 20,
    productionTime: 120
  },
  coalMine: {
    id: "coalMine",
    name: "Coal Mine",
    cost: { plank: 4 },
    consumes: { "<food>": 1 },
    produces: { coal: 1 },
    buildTime: 20,
    productionTime: 30
  },
  goldMine: {
    id: "goldMine",
    name: "Gold Mine",
    cost: { plank: 4 },
    consumes: { "<food>": 1 },
    produces: { goldOre: 1 },
    buildTime: 20,
    productionTime: 30
  },
  goldSmelting: {
    id: "goldSmelting",
    name: "Gold Smelting",
    cost: { stone: 2, plank: 2 },
    consumes: { goldOre: 2, coal: 8 },
    produces: { goldBar: 1 },
    buildTime: 20,
    productionTime: 60
  },
  goldMint: {
    id: "goldMint",
    name: "Gold Mint",
    cost: { stone: 2, plank: 2 },
    consumes: { goldBar: 1 },
    produces: { goldCoin: 1 },
    buildTime: 20,
    productionTime: 60
  }
};
