/**
 * Defines a standardized structure for incoming WebSocket messages.
 */
export interface WebSocketMessage {
    event: string;
    payload: any;
}
/**
 * Agnostic adapter for bidirectional WebSocket communication.
 * Allows decoupling the socket.io or raw ws implementation from the controller logic.
 */
export declare class WebSocketTransportAdapter {
    private handlers;
    on(event: string, handler: (payload: any, socket: any) => void): void;
    emit(socket: any, event: string, payload: any): void;
    handleIncomingMessage(rawMessage: string, socket: any): void;
}
/**
 * Standardized adapter for interacting with Apache Kafka or similar distributed event buses.
 * Decouples the application from specific producer/consumer SDKs.
 */
export declare class KafkaEventBusAdapter {
    private topicHandlers;
    subscribe(topic: string, handler: (event: any) => Promise<void>): void;
    publish(topic: string, event: any): Promise<void>;
}
