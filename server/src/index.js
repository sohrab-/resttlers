import httpServer from "./http/httpServer";
import WsServer from "./ws/WsServer";
import Game from "./game/Game";
import FileStore from "./persistence/FileStore";

// app config
const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const HTTP_PORT = process.env.HTTP_PORT || process.env.PORT || "8085";
const HTTP_BASE_PATH = process.env.HTTP_BASE_PATH || "";

const GAME_LOOP_DELAY = process.env.GAME_LOOP_DELAY || "1000";
const BROADCAST_INTERVAL = process.env.BROADCAST_INTERVAL || "2000";
const SAVE_INTERVAL = process.env.SAVE_INTERVAL || "30000";
const SAVE_STORE = process.env.SAVE_STORE || "memory";

const SAVE_STORE_FILE_PATH =
  process.env.SAVE_STORE_FILE_PATH || "/tmp/resttlers.json";

// start game
const game = new Game({ gameLoopDelay: parseInt(GAME_LOOP_DELAY, 10) });

if (SAVE_STORE === "file") {
  new FileStore(game, {
    path: SAVE_STORE_FILE_PATH,
    saveInterval: parseInt(SAVE_INTERVAL, 10)
  });
}

// start http server
const server = httpServer(game, {
  httpPort: HTTP_PORT,
  httpBasePath: HTTP_BASE_PATH,
  logLevel: LOG_LEVEL
});

// start websocket server
new WsServer(game, server.server, {
  broadcastInterval: parseInt(BROADCAST_INTERVAL, 10)
});
