import axios from "axios";
import { logHttpError } from "./ClientUtils";

export default class EngineClient {
  constructor({ httpBaseUrl, logger }) {
    this.httpBaseUrl = httpBaseUrl;
    this.logError = logHttpError("the engine", logger);
  }

  async upsertSettlement(id) {
    try {
      return await axios.post(`${this.httpBaseUrl}/settlements/${id}`, "", {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (e) {
      this.logError(e);
    }
  }

  async deleteSettlement(id) {
    try {
      return await axios.delete(`${this.httpBaseUrl}/settlements/${id}`);
    } catch (e) {
      this.logError(e);
    }
  }
}
