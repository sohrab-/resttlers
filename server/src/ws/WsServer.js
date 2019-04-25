import WebSocket from "ws";
import fastJson from "fast-json-stringify";

import wsSchema from "./wsSchema";
import WsService from "./WsService";

const stringify = fastJson(wsSchema);

export default class WsServer {
  constructor(game, server, { broadcastInterval }) {
    this.broadcastInterval = broadcastInterval;
    this.service = new WsService(game);
    this.wss = new WebSocket.Server({ server });

    // send current state on open connection
    this.wss.on("connection", ws => {
      ws.send(
        stringify({
          buildingTypes: this.service.getBuildingTypes(),
          settlements: this.service.getSettlements()
        })
      );
    });

    this.broadcast();
  }

  broadcast() {
    const openClients = this.getOpenClients();
    if (openClients) {
      const message = stringify({ settlements: this.service.getSettlements() });
      openClients.forEach(client => {
        client.send(message);
      });
    }

    setTimeout(() => {
      this.broadcast();
    }, this.broadcastInterval);
  }

  getOpenClients() {
    const results = [];
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        results.push(client);
      }
    });
    return results;
  }
}
