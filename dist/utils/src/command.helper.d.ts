/**
 * It captures errors from the command line and exits the process
 *
 * @param command
 * @returns
 */
export declare const commandWithErrors: (command: (...args: unknown[]) => Promise<any>) => (...args: unknown[]) => Promise<void>;
