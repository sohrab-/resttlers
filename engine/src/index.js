import pino from "pino";

import FirestoreStore from "./persistence/FirestoreStore";
import Game from "./game/Game";
import httpServer from "./http/httpServer";

// app config
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const HTTP_PORT = process.env.HTTP_PORT || process.env.PORT || "8085";
const HTTP_BASE_PATH = process.env.HTTP_BASE_PATH || "";

const TICK_INTERVAL = process.env.TICK_INTERVAL || "2000";

const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || "resttlers";
const FIRESTORE_BUILDING_TYPES_COLLECTION =
  process.env.FIRESTORE_BUILDING_TYPES_COLLECTION || "buildingTypes";
const FIRESTORE_SETTLEMENTS_COLLECTION =
  process.env.FIRESTORE_SETTLEMENTS_COLLECTION || "settlements";

const logger = pino({ level: LOG_LEVEL });

// TODO support other persistence layers
const store = new FirestoreStore({
  projectId: GOOGLE_CLOUD_PROJECT,
  buildingTypesCollectionName: FIRESTORE_BUILDING_TYPES_COLLECTION,
  settlementsCollectionName: FIRESTORE_SETTLEMENTS_COLLECTION
});

const game = new Game(store, { tickInterval: TICK_INTERVAL, logger });

httpServer(game, {
  httpPort: HTTP_PORT,
  httpBasePath: HTTP_BASE_PATH,
  logLevel: LOG_LEVEL
});
