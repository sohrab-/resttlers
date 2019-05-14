import Hashids from "hashids";

import buildingTypes from "../common/buildingTypes";
import levels from "../common/levels";
import { startingResources } from "../common/resources";
import processBuilding from "./processBuilding";
import {
  missingResources,
  spendResources,
  reclaimResources
} from "./resources";

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
        buildingIdSeed: 0,
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

      if (building.status === "buildQueued") {
        // enough resources to build?
        const missing = missingResources(
          buildingType.cost,
          this.state.resources
        );
        if (missing.length === 0) {
          // building under construction
          spendResources(buildingType.cost, this.state.resources);
          building.status = "underConstruction";
          this.state.buildQueue[0].timestamp = Date.now();
          updated = true;
        }
      }

      if (
        building.status === "underConstruction" &&
        now >= timestamp + buildingType.buildTime * 1000
      ) {
        // building construction completed
        building.status = "ready";
        this.state.buildings[
          building.id
        ] = this.state.buildQueue.shift().building;
        updated = true;
      }
    }

    Object.values(this.state.buildings).forEach(building => {
      // demolish buildings
      if (building.status === "toBeDemolished") {
        reclaimResources(
          buildingTypes[building.type].cost,
          this.state.resources
        );
        delete this.state.buildings[building.id];
        updated = true;
      }

      // resource production
      const goldCoinsBefore = this.state.resources.goldCoin || 0;
      if (processBuilding(building, this.state.resources)) {
        // TODO we need a more versatile scoring system
        this.state.score +=
          (this.state.resources.goldCoin || 0) - goldCoinsBefore;
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
        ...this.state.resources,
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
