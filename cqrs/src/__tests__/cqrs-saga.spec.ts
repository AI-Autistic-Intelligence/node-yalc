import { CqrsEngine, SagaOrchestrator } from '../cqrs-saga';

describe('CqrsEngine', () => {
  it('should register and execute a command handler', async () => {
    const engine = new CqrsEngine();
    const mockHandler = jest.fn().mockResolvedValue('success');
    engine.registerCommandHandler('CreateUser', mockHandler);
    
    const result = await engine.executeCommand({ type: 'CreateUser', payload: 'test' });
    expect(result).toBe('success');
    expect(mockHandler).toHaveBeenCalledWith({ type: 'CreateUser', payload: 'test' });
  });

  it('should throw an error if no handler is registered for a command type', async () => {
    const engine = new CqrsEngine();
    await expect(engine.executeCommand({ type: 'UnknownCommand', payload: {} })).rejects.toThrow('No CommandHandler registered for command type: UnknownCommand');
  });

  it('should register and execute a query handler', async () => {
    const engine = new CqrsEngine();
    const mockHandler = jest.fn().mockResolvedValue('queryResult');
    engine.registerQueryHandler('GetUser', mockHandler);
    
    const result = await engine.executeQuery({ type: 'GetUser', params: { id: 1 } });
    expect(result).toBe('queryResult');
    expect(mockHandler).toHaveBeenCalledWith({ type: 'GetUser', params: { id: 1 } });
  });

  it('should throw an error if no handler is registered for a query type', async () => {
    const engine = new CqrsEngine();
    await expect(engine.executeQuery({ type: 'UnknownQuery', params: {} })).rejects.toThrow('No QueryHandler registered for query type: UnknownQuery');
  });
});

describe('SagaOrchestrator', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute all steps successfully in order', async () => {
    const saga = new SagaOrchestrator();
    const trace: string[] = [];

    saga.addStep({
      name: 'step1',
      action: async () => { trace.push('step1-exec'); },
      compensation: async () => { trace.push('step1-comp'); }
    });
    saga.addStep({
      name: 'step2',
      action: async () => { trace.push('step2-exec'); },
      compensation: async () => { trace.push('step2-comp'); }
    });

    const result = await saga.execute();

    expect(result.success).toBe(true);
    expect(result.executedSteps).toEqual(['step1', 'step2']);
    expect(trace).toEqual(['step1-exec', 'step2-exec']);
  });

  it('should compensate backward in case of step failure', async () => {
    const saga = new SagaOrchestrator();
    const trace: string[] = [];

    saga.addStep({
      name: 'ChargeCard',
      action: async () => { trace.push('charged'); return { amount: 100 }; },
      compensation: async () => { trace.push('refunded'); }
    });
    saga.addStep({
      name: 'BookInventory',
      action: async () => { trace.push('booked'); },
      compensation: async () => { trace.push('unbooked'); }
    });
    saga.addStep({
      name: 'ShipItem',
      action: async () => { throw new Error('Warehouse offline'); },
      compensation: async () => { trace.push('unshipped'); }
    });

    const result = await saga.execute();

    expect(result.success).toBe(false);
    expect(result.error).toContain('Warehouse offline');
    expect(result.executedSteps).toEqual(['ChargeCard', 'BookInventory']);
    // Expected: It charged, booked, then failed to ship.
    // So it must UNbook first, then REFUND.
    expect(trace).toEqual(['charged', 'booked', 'unbooked', 'refunded']);
  });

  it('should continue compensation even if a compensation step fails', async () => {
    const saga = new SagaOrchestrator();
    const trace: string[] = [];

    saga.addStep({
      name: 'Step1',
      action: async () => { trace.push('s1'); },
      compensation: async () => { trace.push('c1'); }
    });
    saga.addStep({
      name: 'Step2',
      action: async () => { trace.push('s2'); },
      compensation: async () => { throw new Error('Compensation error'); }
    });
    saga.addStep({
      name: 'Step3',
      action: async () => { throw new Error('Execution error'); },
      compensation: async () => { trace.push('c3'); }
    });

    const result = await saga.execute();
    
    expect(result.success).toBe(false);
    
    // Step1 and Step2 executed. Step3 failed.
    // Compensation: Step2 throws error, Step1 continues compensation!
    expect(trace).toEqual(['s1', 's2', 'c1']);
  });
});

