import { buildingTypes } from "../game/buildingTypes";
import filterObject from "../utils/filterObject";

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
