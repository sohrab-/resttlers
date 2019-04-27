import { buildingTypes } from "../game/buildingTypes";

const filterObject = (object, keys) =>
  Object.keys(object).reduce((accum, current) => {
    if (keys.indexOf(current) >= 0) {
      accum[current] = object[current];
    }
    return accum;
  }, {});

export default class WsService {
  constructor(game) {
    this.game = game;
  }

  getBuildingTypes() {
    return Object.values(buildingTypes).reduce((accum, current) => {
      accum[current.id] = {
        consumes: Object.keys(current.consumes),
        produces: Object.keys(current.produces)
      };
      return accum;
    }, {});
  }

  getSettlements() {
    return this.game.settlements.map(settlement => ({
      ...filterObject(settlement, [
        "id",
        "name",
        "leader",
        "creationTime",
        "score"
      ]),
      objective: settlement.level.objective,
      level: settlement.level.id,
      resources: settlement.getResources(),
      buildings: settlement.getBuildings().map(building => ({
        ...filterObject(building, ["id", "status", "missingResources"]),
        type: building.type.id
      }))
    }));
  }
}
