import Hashids from "hashids";
import uuid from "uuid/v4";
import moment from "moment";
import BadWords from "bad-words";
import { buildingTypes, levels } from "@resttlers/engine";

import { throwError } from "../http/error";

const mapSettlement = ({ id, name, leader, level, score, createdAt }) => ({
  id,
  name,
  leader,
  level,
  objective: levels[level].objective,
  score,
  createdAt: moment(createdAt).format()
});

const mapBuilding = ({ id, type, status, missingResources }) => {
  const mapped = { id, type, status };
  if (missingResources && missingResources.length > 0) {
    mapped.statusReason = `Insufficient resources: ${missingResources.join(
      ", "
    )}`;
  }
  return mapped;
};

const authorise = (request, settlement) => {
  const apiKey = request.headers["api-key"];
  if (settlement.apiKey !== apiKey) {
    throwError(
      403,
      "Cannot find the correct API-Key header for this settlement in the request"
    );
  }
};

const getBuilding = (request, { id, buildings }) => {
  const { buildingId } = request.params;
  const building = buildings[buildingId];
  if (!building) {
    throwError(404, `Building [${buildingId}] not found in Settlement [${id}]`);
  }
  return building;
};

export default class SettlementService {
  constructor(store, engineClient, recaptchaClient, { recaptchaEnabled }) {
    this.store = store;
    this.engineClient = engineClient;
    this.recaptchaClient = recaptchaClient;
    this.recaptchaEnabled = recaptchaEnabled;
    this.hashids = new Hashids("resttlers", 5);
    this.badWords = new BadWords();
  }

  async createSettlement(request, reply) {
    const {
      body: { name, leader }
    } = request;

    // validate
    if (!name || name.length <= 0) {
      throwError(400, "Settlement name must be provided");
    }
    if (!leader || leader.length <= 0) {
      throwError(400, "Settlement leader must be provided");
    }

    // verify recaptcha
    if (this.recaptchaEnabled) {
      const { incantation } = request.body;
      if (!incantation) {
        throwError(400, "An incantation must be provided");
      }
      if (!(await this.recaptchaClient.verify(incantation))) {
        throwError(400, "The provided incantation is not valid");
      }
    }

    // create
    const settlement = {
      name: this.badWords.clean(name),
      leader: this.badWords.clean(leader),
      active: true,
      apiKey: uuid(),
      createdAt: Date.now()
    };
    const id = await this.store.createSettlement(settlement, num =>
      this.hashids.encode(num)
    );
    await this.engineClient.upsertSettlement(id);
    reply.code(201).send({
      ...mapSettlement({ ...settlement, id }),
      apiKey: settlement.apiKey
    });
  }

  async getSettlements(request) {
    // TODO return error if the combination is not an index we have
    const settlements = await this.store.getSettlements(request.query);
    return {
      items: settlements.map(mapSettlement)
    };
  }

  async getSettlement(request) {
    const settlement = await this._getSettlement(request);
    return mapSettlement(settlement);
  }

  async getSettlementBuildingTypes(request) {
    const settlement = await this._getSettlement(request);

    const items = settlement.buildingTypes.map(typeId => {
      const type = buildingTypes[typeId];
      return {
        id: type.id,
        cost: type.cost,
        consumes: Object.keys(type.consumes),
        produces: Object.keys(type.produces)
      };
    });

    return {
      items,
      size: items.length
    };
  }

  async getSettlementResources(request) {
    const settlement = await this._getSettlement(request);
    return settlement.resources;
  }

  async createBuilding(request, reply) {
    // validate
    const { type: typeId } = request.body;
    const type = buildingTypes[typeId];
    if (!type) {
      throwError(400, `Building type [${typeId}] not found`);
    }

    const {
      id: settlementId,
      buildingTypes: unlockedTypes,
      buildings,
      buildQueue
    } = await this._getSettlementAuthorised(request);

    if (!unlockedTypes.includes(typeId)) {
      throwError(400, `Building type [${typeId}] not found`);
    }

    // create building
    const building = { type: typeId, status: "buildQueued" };

    const id = await this.store.addToBuildQueue(settlementId, building, num =>
      new Hashids(settlementId, 5).encode(num)
    );
    await this.engineClient.upsertSettlement(settlementId);

    reply.code(202).send(mapBuilding({ ...building, id }));
  }

  async getBuildings(request) {
    const { type, status } = request.query;
    const settlement = await this._getSettlement(request);

    const items = Object.values(settlement.buildings)
      .concat(settlement.buildQueue.map(item => item.building))
      .filter(building =>
        type && status
          ? building.type === type && building.status === status
          : type
          ? building.type === type
          : status
          ? building.status === status
          : true
      )
      .map(mapBuilding);
    return { size: items.length, items };
  }

  async getBuilding(request) {
    return this._getBuilding(request);
  }

  async updateBuilding(request) {
    const status = request.body.status.toLowerCase();

    if (status !== "disabled" && status !== "ready") {
      throwError(400, `Invalid status. Acceptable statuses: ready, disabled`);
    }

    return this._updateBuildingStatus(request, status);
  }

  async deleteBuilding(request, reply) {
    await this._updateBuildingStatus(request, "toBeDemolished");
    reply.code(204).send();
  }

  async _getSettlement(request) {
    const id = request.params.settlementId;
    const settlement = await this.store.getSettlement(id);
    if (!settlement || !settlement.active) {
      throwError(404, `Settlement [${id}] not found`);
    }
    return settlement;
  }

  async _getSettlementAuthorised(request) {
    const settlement = await this._getSettlement(request);
    authorise(request, settlement);
    return settlement;
  }

  async _getBuilding(request) {
    return getBuilding(request, await this._getSettlement(request));
  }
  async _getBuildingAuthorised(request) {
    return getBuilding(request, await this._getSettlementAuthorised(request));
  }

  async _updateBuildingStatus(request, status) {
    const building = await this._getBuildingAuthorised(request);
    const { settlementId } = request.params;

    await this.store.updateBuildingStatus(settlementId, building.id, status);
    await this.engineClient.upsertSettlement(settlementId);

    return { ...building, status };
  }
}
