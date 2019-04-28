import { Storage } from "@google-cloud/storage";
import pino from "pino";

export default class GoogleCloudStorageStore {
  constructor(game, { bucketName, filename, saveInterval }) {
    this.game = game;
    this.file = new Storage().bucket(bucketName).file(filename);
    this.saveInterval = saveInterval;

    this.logger = pino();

    setTimeout(() => this.save(), this.saveInterval);
  }

  async save() {
    this.file.save(JSON.stringify(this.game.toState()));
    setTimeout(() => this.save(), this.saveInterval);
  }

  async restore() {
    if (!(await this.file.exists())) {
      this.logger.warn("Unable to find saved state on Google Cloud Storage");
      return;
    }
    const saveFile = await this.file.download();
    this.game.fromState(JSON.parse(saveFile));
    this.logger.info("Successfully loaded state from Google Cloud Storage");
  }
}
