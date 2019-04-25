export class BuildingType {
  constructor({ id, cost, consumes, produces, buildTime, productionTime }) {
    this.id = id;
    this.cost = cost;
    this.consumes = consumes;
    this.produces = produces;
    this.buildTime = buildTime;
    this.productionTime = productionTime;
  }
}

export const buildingTypes = {
  quarry: new BuildingType({
    id: "quarry",
    cost: { plank: 2 },
    consumes: { stoneDeposit: 1 },
    produces: { stone: 1 },
    buildTime: 20,
    productionTime: 20
  }),
  forester: new BuildingType({
    id: "forester",
    cost: { plank: 2 },
    consumes: {},
    produces: { tree: 1 },
    buildTime: 20,
    productionTime: 20
  }),
  woodcutter: new BuildingType({
    id: "woodcutter",
    cost: { plank: 2 },
    consumes: { tree: 1 },
    produces: { lumber: 1 },
    buildTime: 20,
    productionTime: 20
  }),
  sawmill: new BuildingType({
    id: "sawmill",
    cost: { stone: 2, plank: 2 },
    consumes: { lumber: 1 },
    produces: { plank: 1 },
    buildTime: 20,
    productionTime: 20
  }),
  waterworks: new BuildingType({
    id: "waterworks",
    cost: { plank: 2 },
    consumes: {},
    produces: { water: 1 },
    buildTime: 20,
    productionTime: 20
  }),
  farm: new BuildingType({
    id: "farm",
    cost: { stone: 3, plank: 3 },
    consumes: { water: 2 },
    produces: { grain: 1 },
    buildTime: 30,
    productionTime: 30
  }),
  mill: new BuildingType({
    id: "mill",
    cost: { stone: 2, plank: 2 },
    consumes: { grain: 1 },
    produces: { flour: 1 },
    buildTime: 20,
    productionTime: 30
  }),
  bakery: new BuildingType({
    id: "bakery",
    cost: { stone: 2, plank: 2 },
    consumes: { flour: 1, water: 2 },
    produces: { bread: 1 },
    buildTime: 20,
    productionTime: 30
  }),
  fishery: new BuildingType({
    id: "fishery",
    cost: { plank: 2 },
    consumes: {},
    produces: { fish: 1 },
    buildTime: 20,
    productionTime: 120
  }),
  hunter: new BuildingType({
    id: "hunter",
    cost: { plank: 2 },
    consumes: {},
    produces: { meat: 1 },
    buildTime: 20,
    productionTime: 120
  }),
  coalMine: new BuildingType({
    id: "coalMine",
    cost: { plank: 4 },
    consumes: { "<food>": 1 },
    produces: { coal: 1 },
    buildTime: 20,
    productionTime: 30
  }),
  goldMine: new BuildingType({
    id: "goldMine",
    cost: { plank: 4 },
    consumes: { "<food>": 1 },
    produces: { goldOre: 1 },
    buildTime: 20,
    productionTime: 30
  }),
  goldSmelting: new BuildingType({
    id: "goldSmelting",
    cost: { stone: 2, plank: 2 },
    consumes: { goldOre: 2, coal: 8 },
    produces: { goldBar: 1 },
    buildTime: 20,
    productionTime: 60
  }),
  goldMint: new BuildingType({
    id: "goldMint",
    cost: { stone: 2, plank: 2 },
    consumes: { goldBar: 1 },
    produces: { goldCoin: 1 },
    buildTime: 20,
    productionTime: 60
  })
};
