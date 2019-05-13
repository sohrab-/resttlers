import axios from "axios";
import { logHttpError } from "./ClientUtils";

const encodeForm = data => {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export default class EngineClient {
  constructor({ secretKey, logger }) {
    this.secretKey = secretKey;
    this.logError = logHttpError("reCaptcha", logger);
  }

  async verify(token) {
    try {
      const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        encodeForm({
          secret: this.secretKey,
          response: token
        })
      );
      return response.data.success;
    } catch (e) {
      this.logError(e);
    }
  }
}
