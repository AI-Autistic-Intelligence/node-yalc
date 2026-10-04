import { beforeLogging } from '../logger-abstract.service';

describe('beforeLogging', () => {
  it('should cover the default options argument', () => {
    beforeLogging('test');
  });
});
