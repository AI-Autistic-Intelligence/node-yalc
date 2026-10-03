import { WebSocketTransportAdapter, KafkaEventBusAdapter } from '../websocket-kafka';

describe('websocket-kafka transports', () => {
  describe('WebSocketTransportAdapter', () => {
    it('should emit messages via socket', () => {
      const ws = new WebSocketTransportAdapter();
      const mockSocket = {
        send: jest.fn(),
      };
      ws.emit(mockSocket, 'test_event', { foo: 'bar' });
      expect(mockSocket.send).toHaveBeenCalledWith(JSON.stringify({ event: 'test_event', payload: { foo: 'bar' } }));
    });

    it('should silently ignore emit if socket lacks send method', () => {
      const ws = new WebSocketTransportAdapter();
      ws.emit({}, 'test_event', { foo: 'bar' }); // should not throw
    });

    it('should handle incoming messages and invoke correct handler', () => {
      const ws = new WebSocketTransportAdapter();
      const mockHandler = jest.fn();
      const mockSocket = {};
      
      ws.on('test_event', mockHandler);
      ws.handleIncomingMessage(JSON.stringify({ event: 'test_event', payload: 'data' }), mockSocket);
      
      expect(mockHandler).toHaveBeenCalledWith('data', mockSocket);
    });

    it('should ignore incoming message if no handler is registered', () => {
      const ws = new WebSocketTransportAdapter();
      ws.handleIncomingMessage(JSON.stringify({ event: 'missing_event', payload: 'data' }), {});
      // should not throw
    });

    it('should log error on invalid JSON payload', () => {
      const ws = new WebSocketTransportAdapter();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      ws.handleIncomingMessage('{invalid_json', {});
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('KafkaEventBusAdapter', () => {
    it('should publish to subscribed topics', async () => {
      const kafka = new KafkaEventBusAdapter();
      const mockHandler = jest.fn().mockResolvedValue(undefined);
      
      kafka.subscribe('test_topic', mockHandler);
      await kafka.publish('test_topic', { data: 'test' });
      
      expect(mockHandler).toHaveBeenCalledWith({ data: 'test' });
    });

    it('should silently ignore publish if no handler is subscribed', async () => {
      const kafka = new KafkaEventBusAdapter();
      await kafka.publish('missing_topic', { data: 'test' });
      // should not throw
    });
  });
});
