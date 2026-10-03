import { HttpException } from '../http.exception';

describe('HttpException', () => {
  it('should create body with object', () => {
    const body = HttpException.createBody({ foo: 'bar' }, 'desc', 400);
    expect(body).toEqual({ foo: 'bar' });
  });

  it('should create body with empty objectOrError', () => {
    const body = HttpException.createBody('', 'desc', 400);
    expect(body).toEqual({ statusCode: 400, message: 'desc' });
  });
});
