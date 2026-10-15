import { ClassType, Mixin } from '@node-yalc/types/globals.js';
import returnValue from '@node-yalc/utils/returnValue.js';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * This is a mixin class that can be used to implement the createdAt and updatedAt
 * Database fields in a standardized way
 */
export const YalcEntityWithTimestamps = <T extends ClassType>(base: T) => {
  const isSqlite =
    typeof process !== 'undefined' &&
    (process.env.NODE_ENV === 'test' ||
      process.env.DATABASE_TYPE === 'sqlite' ||
      process.env.DB_TYPE === 'sqlite');

  class YalcEntityWithTimestamps extends base {
    /**
     * DB insert time.
     */
    @CreateDateColumn(
      isSqlite
        ? {}
        : {
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
          },
    )
    public createdAt: Date;

    /**
     * DB last update time.
     */
    @UpdateDateColumn(
      isSqlite
        ? {}
        : {
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
    )
    public updatedAt: Date;
  }

  return YalcEntityWithTimestamps;
};

export type YalcEntityWithTimestamps = Mixin<typeof YalcEntityWithTimestamps>;
