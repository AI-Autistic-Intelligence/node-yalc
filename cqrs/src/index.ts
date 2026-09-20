export * from './stub';

export class CqrsSagaEngine {
  async executeSaga(sagaName: string, payload: any): Promise<void> {}
}
