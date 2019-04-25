import Hashids from "hashids";
import uuid from "uuid/v4";

import {
  missingResources,
  spendResources,
  reclaimResources
} from "./resources";
import { buildingTypes } from "./buildingTypes";
import Building from "./Building";
import { levels } from "./levels";

const STARTING_RESOURCES = {
  tree: 200,
  stoneDeposit: 500,
  lumber: 0,
  plank: 10,
  stone: 10,
  water: 0,
  grain: 0,
  flour: 0,
  bread: 0,
  fish: 0,
  meat: 0,
  coal: 0,
  goldOre: 0,
  goldBar: 0,
  goldCoin: 0
};

class Notifier {
  constructor(settlement) {
    this.settlement = settlement;
  }

  notify({ event, building }) {
    console.log(
      `${event}: ${this.settlement.name} ${building.id} (${building.type.id})`
    );
  }
}

export default class Settlement {
  constructor(id, name, leader) {
    this.creationTime = Date.now();

    this.id = id;
    this.name = name;
    this.leader = leader;

    this.apiKey = uuid();
    this.hashids = new Hashids(this.id, 5);

    this.reset();

    this.notifier = new Notifier(this);
  }

  tick() {
    // building construction
    if (this.buildQueue.length > 0) {
      const { building, buildTime } = this.buildQueue[0];
      building.status = "underConstruction";
      // construction completed
      if (buildTime >= building.type.buildTime) {
        building.status = "ready";
        this.buildings.push(this.buildQueue.shift().building);
        this.notifier.notify({ event: "buildCompleted", building });
      } else {
        this.buildQueue[0].buildTime += 1;
      }
    }

    // resource production
    this.buildings.forEach(building => {
      building.produce(this.resources);
    });

    // TODO level up
  }

  createBuilding(typeId) {
    const type = buildingTypes[typeId];
    if (!type) {
      throw new Error(`Building type [${typeId}] not found`);
    }

    // enough resources to build?
    const missing = missingResources(type.cost, this.resources);
    if (missing.length > 0) {
      throw new Error(`Insufficent resources: ${missing.join(", ")}`);
    }

    spendResources(type.cost, this.resources);

    const building = new Building(
      this.hashids.encode(this.buildings.length + this.buildQueue.length),
      type,
      { notifier: this.notifier }
    );
    this.buildQueue.push({
      building,
      buildTime: 0
    });

    this.notifier.notify({
      event: "buildQueued",
      building
    });
    return building;
  }

  getBuildings({ type, status } = {}) {
    // add the build queue
    const buildings = this.buildings.concat(
      this.buildQueue.map(item => item.building)
    );
    return type || status
      ? buildings.filter(building =>
          type && status
            ? building.type === type && building.status === status
            : type
            ? building.type === type
            : building.status === status
        )
      : buildings;
  }

  getBuilding(id) {
    return this.buildings.find(building => building.id === id);
  }

  deleteBuilding(id) {
    const index = this.buildings.findIndex(building => building.id === id);
    if (index === -1) {
      return null;
    }

    reclaimResources(this.buildings[index].type.cost, this.resources);
    this.notifier.notify({
      event: "buildingDestroyed",
      building
    });
    return this.buildings.splice(index, 1);
  }

  getObjective() {
    return this.level.objective;
  }

  getScore() {
    return this.score;
  }

  getResources() {
    return Object.entries(this.resources)
      .filter(([resource]) => this.level.unlockedResources.includes(resource))
      .reduce((accum, [k, v]) => {
        accum[k] = v;
        return accum;
      }, {});
  }

  getBuildingTypes() {
    return Object.entries(buildingTypes)
      .filter(([name]) =>
        this.level.unlockedBuildings.some(unlocked => unlocked.id === name)
      )
      .map(([, v]) => v);
  }

  reset() {
    this.score = 0;
    this.level = levels.level1;
    this.resources = STARTING_RESOURCES;
    this.buildings = [];
    this.buildQueue = [];
  }
}
