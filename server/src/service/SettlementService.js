function mapSettlement(settlement, apiKey = false) {
  const mapped = {
    id: settlement.id,
    name: settlement.name,
    leader: settlement.leader,
    objective: settlement.getObjective()
    // TODO creationTime
    // TODO score, etc.
  };
  if (apiKey) {
    mapped.apiKey = settlement.apiKey;
  }
  return mapped;
}

function mapBuilding(building) {
  const mapped = {
    id: building.id,
    type: building.type.id,
    status: building.status
  };
  if (building.missingResources.length > 0) {
    mapped.statusReason = `Insufficient resources: ${builing.missingResources.join(
      ", "
    )}`;
  }
  return mapped;
}

export default class SettlementService {
  constructor(game) {
    this.game = game;
  }

  createSettlement(request, reply) {
    const {
      body: { name, leader }
    } = request;
    const created = this.game.createSettlement(name, leader);
    reply.code(201).send(mapSettlement(created));
  }

  getSettlements(request, reply) {
    const settlements = this.game.getSettlements(request.query);
    reply.send({
      size: settlements.length,
      items: settlements.map(mapSettlement)
    });
  }

  withSettlement(request, reply, callback, secured = true) {
    const id = request.params.settlementId;
    const settlement = this.game.getSettlement(id);

    // validate API key
    if (secured) {
      const apiKey = request.headers["api-key"];
      if (settlement.apiKey !== apiKey) {
        reply.forbidden(
          "Cannot find the correct API-Key header for this settlement in the request"
        );
        return;
      }
    }

    if (settlement) {
      callback(settlement);
    } else {
      reply.notFound(`Settlement [${id}] not found`);
    }
  }

  getSettlement(request, reply) {
    this.withSettlement(
      request,
      reply,
      settlement => {
        reply.send(mapSettlement(settlement));
      },
      false
    );
  }

  getSettlementBuildingTypes(request, reply) {
    this.withSettlement(
      request,
      reply,
      settlement => {
        const items = settlement.getBuildingTypes().map(type => ({
          id: type.id,
          cost: type.cost,
          consumes: Object.keys(type.consumes),
          produces: Object.keys(type.produces)
        }));
        console.log(items);
        reply.send({
          items,
          size: items.length
        });
      },
      false
    );
  }

  getSettlementResources(request, reply) {
    this.withSettlement(
      request,
      reply,
      settlement => {
        reply.send(settlement.getResources());
      },
      false
    );
  }

  createBuilding(request, reply) {
    this.withSettlement(request, reply, settlement => {
      try {
        const building = settlement.createBuilding(request.body.type);
        reply.code(202).send(mapBuilding(building));
      } catch (e) {
        reply.badRequest(e.message);
      }
    });
  }

  getBuildings(request, reply) {
    this.withSettlement(
      request,
      reply,
      settlement => {
        const builings = settlement.getBuildings(request.query);
        reply.send({
          size: builings.length,
          items: builings.map(mapBuilding)
        });
      },
      false
    );
  }

  withBuilding(request, reply, callback, secured = true) {
    this.withSettlement(
      request,
      reply,
      settlement => {
        const id = request.params.buildingId;
        const building = settlement.getBuilding(id);
        if (building) {
          callback(building, settlement);
        } else {
          reply.notFound(`Building [${id}] not found`);
        }
      },
      secured
    );
  }

  getBuilding(request, reply) {
    this.withBuilding(
      request,
      reply,
      building => {
        reply.send(mapBuilding(building));
      },
      false
    );
  }

  updateBuilding(request, reply) {
    this.withBuilding(request, reply, building => {
      building.status = request.body.status;
      reply.send(building);
    });
  }

  deleteBuilding(request, reply) {
    this.withBuilding(request, reply, (building, settlement) => {
      settlement.deleteBuilding(building.id);
      reply.code(204).send();
    });
  }
}
