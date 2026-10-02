import { LogLevelEnum } from '@node-yalc/logger';
import { HttpException } from '@node-yalc/errors';
import { HttpStatus } from '@node-yalc/errors';
import { getLogLevelByStatus, getLogLevelByError, isErrorEvent } from '../event.helper';
import * as errorHelper from '../../../errors/src/error.helper.js';

jest.mock('../../../errors/src/error.helper.js', () => ({
  getStatusCodeFromError: jest.fn(),
}));

describe('event.helper', () => {
  describe('getLogLevelByStatus', () => {
    it('should return ERROR for 500+', () => {
      expect(getLogLevelByStatus(HttpStatus.INTERNAL_SERVER_ERROR)).toBe(LogLevelEnum.ERROR);
      expect(getLogLevelByStatus(HttpStatus.BAD_GATEWAY)).toBe(LogLevelEnum.ERROR);
    });

    it('should return WARN for 429 TOO_MANY_REQUESTS', () => {
      expect(getLogLevelByStatus(HttpStatus.TOO_MANY_REQUESTS)).toBe(LogLevelEnum.WARN);
    });

    it('should return LOG for other 4xx and below', () => {
      expect(getLogLevelByStatus(HttpStatus.BAD_REQUEST)).toBe(LogLevelEnum.LOG);
      expect(getLogLevelByStatus(HttpStatus.OK)).toBe(LogLevelEnum.LOG);
      expect(getLogLevelByStatus(HttpStatus.NOT_FOUND)).toBe(LogLevelEnum.LOG);
    });
  });

  describe('getLogLevelByError', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should use getStatusCodeFromError if it returns a status', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(getLogLevelByError(new Error())).toBe(LogLevelEnum.ERROR);
      expect(errorHelper.getStatusCodeFromError).toHaveBeenCalled();
    });

    it('should fallback to class instantiation if error is a class', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(undefined);
      class CustomError extends Error {
        getStatus() { return HttpStatus.TOO_MANY_REQUESTS; }
      }
      expect(getLogLevelByError(CustomError)).toBe(LogLevelEnum.WARN);
    });

    it('should fallback to using the object if error is an instance', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(undefined);
      const err = new HttpException('Test', HttpStatus.BAD_REQUEST);
      expect(getLogLevelByError(err)).toBe(LogLevelEnum.LOG);
    });

    it('should fallback to ERROR if stack is present but no status is found', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(undefined);
      const err = new Error();
      err.stack = 'stack trace';
      expect(getLogLevelByError(err)).toBe(LogLevelEnum.ERROR);
    });

    it('should fallback to LOG if no stack and no status is found', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(undefined);
      const err = new Error();
      delete err.stack;
      expect(getLogLevelByError(err)).toBe(LogLevelEnum.LOG);
    });
  });

  describe('isErrorEvent', () => {
    it('should return true if options.logger.level is ERROR', () => {
      expect(isErrorEvent({ logger: { level: LogLevelEnum.ERROR } })).toBe(true);
    });

    it('should return false if options.logger.level is not ERROR and no errorClass', () => {
      expect(isErrorEvent({ logger: { level: LogLevelEnum.LOG } })).toBe(false);
      expect(isErrorEvent({})).toBe(false);
    });

    it('should return true if errorClass is strictly true', () => {
      expect(isErrorEvent({ errorClass: true })).toBe(true);
    });

    it('should return true if errorClass evaluates to ERROR log level', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(isErrorEvent({ errorClass: new Error() })).toBe(true);
    });

    it('should return false if errorClass evaluates to LOG log level', () => {
      (errorHelper.getStatusCodeFromError as jest.Mock).mockReturnValue(HttpStatus.BAD_REQUEST);
      expect(isErrorEvent({ errorClass: new Error() })).toBe(false);
    });
  });
});
