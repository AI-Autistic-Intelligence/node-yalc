import { DefaultError } from '@node-yalc/errors/default.error.js';
import { Err, Ok } from 'neverthrow';

export type Result<T, E extends DefaultError = DefaultError> =
  Ok<T, E> | Err<any, E>;

export type PromiseResult<T, E extends DefaultError = DefaultError> = Promise<
  Result<T, E>
>;
