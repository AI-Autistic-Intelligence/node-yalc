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