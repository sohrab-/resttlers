import Hashids from "hashids";

import buildingTypes from "../common/buildingTypes";
import levels from "../common/levels";
import { startingResources } from "../common/resources";
import processBuilding from "./processBuilding";

export default class Settlement {
  constructor(state) {
    this.state = state;
    this.hashids = new Hashids(this.id, 5);
  }

  process() {
    const now = Date.now();
    let updated = false;

    if (!this.state.resources) {
      // initialise settlement
      this.state = {
        ...this.state,
        visible: true,
        level: 0,
        score: 0,
        resources: startingResources,
        buildingTypes: [],
        buildings: {},
        buildQueue: []
      };
      updated = true;
    }

    // building construction
    if (this.state.buildQueue.length > 0) {
      const [{ building, timestamp }] = this.state.buildQueue;
      const buildingType = buildingTypes[building.type];

      if (building.status !== "underConstruction") {
        building.status = "underConstruction";
        updated = true;
      }

      // construction completed
      if (now >= timestamp + buildingType.buildTime * 1000) {
        building.status = "ready";
        this.state.buildings[
          building.id
        ] = this.state.buildQueue.shift().building;
        updated = true;
      }
    }

    // resource production
    Object.values(this.state.buildings).forEach(building => {
      if (processBuilding(building, this.state.resources)) {
        updated = true;
      }
    });

    // level up
    const level = levels[this.state.level];
    if (level.objectiveMet(this.state)) {
      this.state.score += level.points;
      this.state.level += 1;
      this.state.buildingTypes.push(
        ...level.buildingRewards.map(building => building.id)
      );
      this.state.resources = {
        ...this.state.resource,
        ...level.resourceRewards.reduce((accum, resource) => {
          accum[resource] = 0;
          return accum;
        }, {})
      };

      updated = true;
    }

    return updated;
  }
}
