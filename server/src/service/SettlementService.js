function mapSettlement(settlement, apiKey = false) {
  const mapped = {
    id: settlement.id,
    name: settlement.name,
    leader: settlement.leader
  };
  if (apiKey) {
    mapped.apiKey = settlement.apiKey;
  }
  return mapped;
}

function mapBuilding(building) {
  return {
    id: building.id,
    type: building.type.id,
    status: building.status,
    statusReason: building.statusReason
  };
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
      size: items.length,
      items: settlements.map(mapSettlement)
    });
  }

  withSettlement(request, reply, callback) {
    const id = request.params.settlementId;
    const settlement = this.game.getSettlement(id);
    // TODO check API key
    if (settlement) {
      callback(settlement);
    } else {
      reply.notFound(`Settlement [${id}] not found`);
    }
  }

  getSettlement(request, reply) {
    withSettlement(request, reply, settlement => {
      reply.send(mapSettlement(settlement));
    });
  }

  getBuildingTypes(request, reply) {
    withSettlement(request, reply, settlement => {
      reply.send(
        settlement.getBuildingTypes().map(type => ({
          id: type.id,
          cost: type.cost,
          consumes: type.consumes,
          produces: type.produces
        }))
      );
    });
  }

  getResources(request, reply) {
    withSettlement(request, reply, settlement => {
      reply.send(settlement.getResources());
    });
  }

  getObjective(request, reply) {
    withSettlement(request, reply, settlement => {
      reply.send(settlement.getObjective());
    });
  }

  createBuilding(request, reply) {
    withSettlement(request, reply, settlement => {
      try {
        const building = settlement.createBuilding(request.body.type);
        reply.code(202).send(mapBuilding(building));
      } catch (e) {
        reply.badRequest(e.message);
      }
    });
  }

  getBuildings(request, reply) {
    withSettlement(request, reply, settlement => {
      // TODO
    });
  }

  withBuilding(request, reply, callback) {
    withSettlement(request, reply, settlement => {
      const id = request.params.buildingId;
      const building = settlement.getBuilding(id);
      if (building) {
        callback(building, settlement);
      } else {
        reply.notFound(`Building [${id}] not found`);
      }
    });
  }

  getBuilding(request, reply) {
    withBuilding(request, reply, building => {
      reply.send(mapBuilding(building));
    });
  }

  updateBuilding(request, reply) {
    withBuilding(request, reply, building => {
      building.status = request.body.status;
      reply.send(building);
    });
  }

  deleteBuilding(request, reply) {
    withBuilding(request, reply, (building, settlement) => {
      settlement.deleteBuilding(building.id);
      reply.code(204).send();
    });
  }
}