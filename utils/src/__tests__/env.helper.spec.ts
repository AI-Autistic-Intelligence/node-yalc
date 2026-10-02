import {
  describe,
  expect,
  it,
  jest,
  beforeAll,
  beforeEach,
  test,
} from '@jest/globals';

import { envIsTrue, envToArray, isProduction } from '../env.helper.js';


describe('environment helper test', () => {
  it('should convert a comma separated list to an array', () => {
    process.env.Test = 'apple,pear,pineapple,cherry';
    const res = envToArray('Test');
    expect(res).toEqual(['apple', 'pear', 'pineapple', 'cherry']);
  });

  it('should return an empty array when the var is an empty string', () => {
    process.env.Test = '';
    const res = envToArray('Test');
    expect(res).toEqual([]);
  });

  it('should return an empty array when the var is missing', () => {
    delete process.env.Test;
    const res = envToArray('Test');
    expect(res).toEqual([]);
  });

  it('should return false for "undefined"', () => {
    expect(envIsTrue(undefined)).toEqual(false);
  });

  it('should return true for "true"', () => {
    expect(envIsTrue('true')).toEqual(true);
  });

  it('should return true for "1"', () => {
    expect(envIsTrue('1')).toEqual(true);
  });

  it('should return true for "on"', () => {
    expect(envIsTrue('on')).toEqual(true);
  });

  it('should return true if is production"', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    expect(isProduction(false)).toBeTruthy();

    process.env.NODE_ENV = 'somethingelse';
    expect(isProduction(true)).toBeTruthy();
    process.env.NODE_ENV = originalEnv;
  });

  it('should return false if is not production"', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'pipeline';
    expect(isProduction()).toBeFalsy();

    process.env.NODE_ENV = 'somethingelse';
    expect(isProduction(false)).toBeFalsy();
    process.env.NODE_ENV = originalEnv;
  });
});
