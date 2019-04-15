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
    buildTime: 5, // TODO
    productionTime: 5 // TODO
  }),
  forrester: new BuildingType({
    id: "forrester",
    cost: { plank: 2 },
    consumes: {},
    produces: { tree: 1 },
    buildTime: 5, // TODO
    productionTime: 5 // TODO
  }),
  woodcutter: new BuildingType({
    id: "woodcutter",
    cost: { plank: 2 },
    consumes: { tree: 1 },
    produces: { plank: 1 },
    buildTime: 5, // TODO
    productionTime: 5 // TODO
  })
};
