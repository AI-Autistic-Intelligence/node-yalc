import { ErrorsEnum } from '../../errors/src/error.enum.js';

export function stringIsInEnumOrThrow<
  T extends Record<string, string | number>,
>(toCheck: string, enumName: T, message?: string): boolean {
  if (stringIsInEnum(toCheck, enumName)) {
    return true;
  }
  const err = message ? message : `${ErrorsEnum.INVALID_VALUE} ${toCheck}`;
  throw new Error(err);
}

export function stringIsInEnum<T extends Record<string, string | number>>(
  toCheck: string,
  enumName: T,
): boolean {
  for (const enumProperty of Object.values(enumName)) {
    if (
      typeof enumProperty === 'string' &&
      enumProperty.toLowerCase() === toCheck.toLowerCase()
    ) {
      return true;
    }
  }
  return false;
}

export class ValidationError extends Error {
  constructor(public readonly param: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates integer parameters within strict allow-listed bounds.
 */
export function parseBoundedInt(
  raw: string | null | undefined,
  name: string,
  min: number,
  max: number
): number {
  if (raw === null || raw === undefined || raw.trim() === '') {
    throw new ValidationError(name, `Parameter '${name}' is required.`);
  }
  if (!/^-?\d+$/.test(raw)) {
    throw new ValidationError(name, `Parameter '${name}' must be an integer.`);
  }
  const val = Number.parseInt(raw, 10);
  if (val < min || val > max) {
    throw new ValidationError(name, `Parameter '${name}' must be between ${min} and ${max}.`);
  }
  return val;
}

export function parseOptionalInt(
  raw: string | null | undefined,
  name: string,
  min: number,
  max: number
): number | undefined {
  if (raw === null || raw === undefined || raw.trim() === '') return undefined;
  return parseBoundedInt(raw, name, min, max);
}

