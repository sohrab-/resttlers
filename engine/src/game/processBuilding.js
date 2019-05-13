import buildingTypes from "../common/buildingTypes";
import {
  missingResources,
  spendResources,
  produceResources
} from "./resources";

export default function processBuilding(state, resources) {
  const now = Date.now();
  const { productionTime, consumes, produces } = buildingTypes[state.type];
  const { status } = state;

  switch (status) {
    case "buildQueued":
    case "underConstruction":
    case "disabled":
      return false;

    case "working":
      if (now >= state.productionTimestamp + productionTime * 1000) {
        // production completed
        produceResources(produces, resources);

        state.status = "ready";
        state.missingResources = [];
        state.productionTimestamp = null;

        return true;
      }

      // keep working
      return false;

    case "ready":
    case "waiting": {
      const missing = missingResources(consumes, resources);

      if (missing.length === 0) {
        // start a new production
        spendResources(consumes, resources);

        state.status = "working";
        state.missingResources = [];
        state.productionTimestamp = now + productionTime * 1000;

        return true;
      }

      // if can't start a new production, go to waiting
      if (status === "ready") {
        state.status = "waiting";
        state.missingResources = missing;
        state.productionTimestamp = null;

        return true;
      }
    }

    default:
      return false; // ???
  }
}
