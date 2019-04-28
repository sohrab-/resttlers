import Hashids from "hashids";

import Settlement from "./Settlement";

const partialMatch = (text, substring) =>
  text.toLowerCase().includes(substring.toLowerCase());

export default class Game {
  constructor({ gameLoopDelay }) {
    this.gameLoopDelay = gameLoopDelay;

    this.settlements = [];
    this.hashids = new Hashids("resttlers", 5);

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

  getSettlements({ name, leader } = {}) {
    return name || leader
      ? this.settlements.filter(settlement =>
          name && leader
            ? partialMatch(settlement.name, name) &&
              partialMatch(settlement.leader, leader)
            : name
            ? partialMatch(settlement.name, name)
            : partialMatch(settlement.leader, leader)
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

  toState() {
    return {
      settlements: this.settlements.map(settlement => settlement.toState())
    };
  }

  fromState(state) {
    this.settlements = state.settlements.map(settlementState => {
      const settlement = this.createSettlement(
        settlementState.name,
        settlementState.leader
      );
      settlement.fromState(settlementState);
      return settlement;
    });
  }
}
