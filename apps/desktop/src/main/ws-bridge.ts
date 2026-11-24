import { WebSocketServer, WebSocket } from 'ws';

const WS_PORT = 49152;
let wss: WebSocketServer | null = null;
const connectedClients = new Set<WebSocket>();

export function startWebSocketBridge(onClientMessage: (data: any) => void) {
  try {
    wss = new WebSocketServer({ port: WS_PORT });

    wss.on('connection', (ws) => {
      console.log('[WS Bridge] Browser extension connected');
      connectedClients.add(ws);

      ws.on('message', (message) => {
        try {
          const parsed = JSON.parse(message.toString());
          onClientMessage(parsed);
        } catch (err) {
          console.error('[WS Bridge] Failed to parse message', err);
        }
      });

      ws.on('close', () => {
        connectedClients.delete(ws);
      });
    });

    console.log(`[WS Bridge] Listening on ws://127.0.0.1:${WS_PORT}`);
  } catch (err) {
    console.error('[WS Bridge] Failed to bind port:', err);
  }
}

export function broadcastToExtension(data: any) {
  const payload = JSON.stringify(data);
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

export function stopWebSocketBridge() {
  wss?.close();
  connectedClients.clear();
}
