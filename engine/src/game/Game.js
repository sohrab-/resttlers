import pino from "pino";

import Settlement from "./Settlement";

export default class Game {
  constructor(store, { tickInterval, logger = pino() }) {
    this.store = store;
    this.tickInterval = tickInterval;
    this.logger = logger;

    this.store.getSettlements().then(settlements => {
      this.settlements = settlements.reduce((accum, settlement) => {
        // eslint-disable-next-line no-param-reassign
        accum[settlement.id] = new Settlement(settlement);
        return accum;
      }, {});
      this.logger.info(
        `Loaded ${Object.keys(this.settlements).length} settlements from store`
      );
      this.tick();
    });
  }

  tick() {
    try {
      const updatedSettlements = Object.values(this.settlements)
        .filter(settlement => settlement.process())
        .map(settlement => settlement.state);

      if (updatedSettlements.length > 0) {
        // TODO does this cause issue if they tried to disable the building in the meanwhile?
        this.store.saveSettlements(updatedSettlements).catch(e => {
          this.logger.error(e);
        });
      }
    } catch (e) {
      this.logger.error(e);
    }

    setTimeout(() => {
      this.tick();
    }, this.tickInterval);
  }

  async upsertSettlement(id) {
    this.settlements[id] = new Settlement(await this.store.getSettlement(id));
    this.logger.info(`Refreshed settlement [${id}] from store`);
  }

  deleteSettlement(id) {
    delete this.settlements[id];
    this.logger.info(`Deleted settlement [${id}]`);
  }
}
