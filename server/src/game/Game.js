import Hashids from "hashids";

import Settlement from "./Settlement";
import Building from "./Building";
import { buildingTypes } from "./buildingTypes";

export default class Game {
  constructor({ gameLoopDelay }) {
    this.gameLoopDelay = gameLoopDelay;

    this.settlements = [];
    this.hashids = new Hashids("resttlers", 5);

    // TODO remove
    this.createSettlement("bozestan", "sohrab");
    this.settlements[0].apiKey = "key";
    this.settlements[0].createBuilding("quarry");
    this.settlements[0].createBuilding("woodcutter");

    this.tick();
  }

  tick() {
    this.settlements.forEach(settlement => {
      settlement.tick();
    });

    setTimeout(() => {
      this.tick();
    }, this.gameLoopDelay);
  }

  createSettlement(name, leader) {
    const settlement = new Settlement(
      this.hashids.encode(this.settlements.length),
      name,
      leader
    );
    this.settlements.push(settlement);
    return settlement;
  }

  getSettlements({ name, leader }) {
    // TODO partial match
    return name || leader
      ? this.settlements.filter(settlement =>
          name && leader
            ? settlement.name === name && settlement.leader === leader
            : name
            ? settlement.name === name
            : settlement.leader === leader
        )
      : this.settlements;
  }

  getSettlement(id) {
    return this.settlements.find(settlement => settlement.id === id);
  }

  deleteSettlement(id) {
    const index = this.settlements.findIndex(
      settlement => settlement.id === id
    );
    if (index === -1) {
      return null;
    }
    return this.settlements.splice(index, 1);
  }
}
