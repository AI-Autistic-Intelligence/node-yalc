/**
 * Agnostic adapter for bidirectional WebSocket communication.
 * Allows decoupling the socket.io or raw ws implementation from the controller logic.
 */
export class WebSocketTransportAdapter {
    constructor() {
        this.handlers = new Map();
    }
    on(event, handler) {
        this.handlers.set(event, handler);
    }
    emit(socket, event, payload) {
        const frame = JSON.stringify({ event, payload });
        if (socket && typeof socket.send === 'function') {
            socket.send(frame);
        }
    }
    handleIncomingMessage(rawMessage, socket) {
        try {
            const msg = JSON.parse(rawMessage);
            const handler = this.handlers.get(msg.event);
            if (handler) {
                handler(msg.payload, socket);
            }
        }
        catch (err) {
            console.error('WebSocket parse error:', err.message);
        }
    }
}
/**
 * Standardized adapter for interacting with Apache Kafka or similar distributed event buses.
 * Decouples the application from specific producer/consumer SDKs.
 */
export class KafkaEventBusAdapter {
    constructor() {
        this.topicHandlers = new Map();
    }
    subscribe(topic, handler) {
        this.topicHandlers.set(topic, handler);
    }
    async publish(topic, event) {
        const handler = this.topicHandlers.get(topic);
        if (handler) {
            await handler(event);
        }
    }
}
//# sourceMappingURL=websocket-kafka.js.map