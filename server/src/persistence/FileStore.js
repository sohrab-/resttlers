import fs from "fs";
import pino from "pino";

export default class FileStore {
  constructor(game, { path, saveInterval }) {
    this.game = game;
    this.path = path;
    this.saveInterval = saveInterval;

    this.logger = pino();

    this.restore();
    setTimeout(() => this.save(), this.saveInterval);
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.game.toState()));
    setTimeout(() => this.save(), this.saveInterval);
  }

  restore() {
    if (!fs.existsSync(this.path)) {
      pino.warn(`Unable to find saved state: ${this.path}`);
      return;
    }
    this.game.fromState(
      JSON.parse(fs.readFileSync(this.path, { encoding: "utf8" }))
    );
  }
}
