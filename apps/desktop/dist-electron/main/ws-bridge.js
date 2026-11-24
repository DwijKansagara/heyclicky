"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebSocketBridge = startWebSocketBridge;
exports.broadcastToExtension = broadcastToExtension;
exports.stopWebSocketBridge = stopWebSocketBridge;
const ws_1 = require("ws");
const WS_PORT = 49152;
let wss = null;
const connectedClients = new Set();
function startWebSocketBridge(onClientMessage) {
    try {
        wss = new ws_1.WebSocketServer({ port: WS_PORT });
        wss.on('connection', (ws) => {
            console.log('[WS Bridge] Browser extension connected');
            connectedClients.add(ws);
            ws.on('message', (message) => {
                try {
                    const parsed = JSON.parse(message.toString());
                    onClientMessage(parsed);
                }
                catch (err) {
                    console.error('[WS Bridge] Failed to parse message', err);
                }
            });
            ws.on('close', () => {
                connectedClients.delete(ws);
            });
        });
        console.log(`[WS Bridge] Listening on ws://127.0.0.1:${WS_PORT}`);
    }
    catch (err) {
        console.error('[WS Bridge] Failed to bind port:', err);
    }
}
function broadcastToExtension(data) {
    const payload = JSON.stringify(data);
    for (const client of connectedClients) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    }
}
function stopWebSocketBridge() {
    wss?.close();
    connectedClients.clear();
}
