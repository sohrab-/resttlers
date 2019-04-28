import fs from "fs";
import util from "util";
import pino from "pino";

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

export default class FileStore {
  constructor(game, { path, saveInterval }) {
    this.game = game;
    this.path = path;
    this.saveInterval = saveInterval;

    this.logger = pino();

    setTimeout(() => this.save(), this.saveInterval);
  }

  async save() {
    writeFileAsync(this.path, JSON.stringify(this.game.toState()));
    setTimeout(() => this.save(), this.saveInterval);
  }

  async restore() {
    try {
      const saveFile = await readFileAsync(this.path, { encoding: "utf8" });
      this.game.fromState(JSON.parse(saveFile));
      this.logger.info(
        `Successfully loaded state from filesystem: ${this.path}`
      );
    } catch (err) {
      this.logger.warn(
        `Unable to restore saved state from filesystem: ${this.path}`
      );
    }
  }
}
