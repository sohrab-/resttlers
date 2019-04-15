import {
  missingResources,
  spendResources,
  produceResources
} from "./resources";

export default class Building {
  constructor(id, type, { notifier }) {
    this.id = id;
    this.type = type;

    this.status = "ready";
    this.missingResources = [];
    this.productionElapsed = 0;
    this.notifier = notifier;
  }

  produce(resources) {
    const { productionTime, consumes, produces } = this.type;

    if (this.status == "disabled") {
      return;
    }

    // start a new production
    if (
      (this.status === "ready" || this.status === "waiting") &&
      missingResources(consumes, resources).length === 0
    ) {
      spendResources(consumes, resources);

      this.status = "working";
      this.missingResources = [];
      this.productionElapsed = 0;

      this.notifier.notify({ event: "productionStarted", building: this });
      return;
    }

    // finish up a production
    if (this.status === "working" && this.productionElapsed >= productionTime) {
      produceResources(produces, resources);

      this.status = "ready";
      this.missingResources = [];

      this.notifier.notify({ event: "productionCompleted", building: this });
      return;
    }

    // production in progress...
    if (this.status === "working") {
      this.productionElapsed += 1;
      return;
    }

    // waiting
    this.status = "waiting";
    this.missingResources = missingResources(consumes, resources);
    return;
  }
}
