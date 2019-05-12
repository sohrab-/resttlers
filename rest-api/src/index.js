import pino from "pino";

import FirestoreStore from "./persistence/FirestoreStore";
import httpServer from "./http/httpServer";
import SettlementService from "./service/SettlementService";
import EngineClient from "./client/EngineClient";
import RecaptchaClient from "./client/RecaptchaClient";

// app config
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const HTTP_PORT = process.env.HTTP_PORT || process.env.PORT || "8085";
const HTTP_BASE_PATH = process.env.HTTP_BASE_PATH || "";

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "resttlers";
const FIRESTORE_SETTLEMENTS_COLLECTION =
  process.env.FIRESTORE_SETTLEMENTS_COLLECTION || "settlements";

const ENGINE_HTTP_BASE_URL =
  process.env.ENGINE_HTTP_BASE_URL || "http://localhost:8086";

const RECAPTCHA_ENABLED = process.env.RECAPTCHA_ENABLED || "true";
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const logger = pino({ level: LOG_LEVEL });

const store = new FirestoreStore({
  projectId: GOOGLE_CLOUD_PROJECT,
  settlementsCollectionName: FIRESTORE_SETTLEMENTS_COLLECTION
});

const engineClient = new EngineClient({
  httpBaseUrl: ENGINE_HTTP_BASE_URL,
  logger
});

const recaptchaClient = new RecaptchaClient({
  secretKey: RECAPTCHA_SECRET,
  logger
});

const service = new SettlementService(store, engineClient, recaptchaClient, {
  recaptchaEnabled: RECAPTCHA_ENABLED === "true"
});

// start http server
httpServer(service, {
  httpPort: HTTP_PORT,
  httpBasePath: HTTP_BASE_PATH,
  logLevel: LOG_LEVEL
});
