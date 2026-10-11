import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
/**
 * Util function to replace the commonjs __filename
 * @param path
 * @returns
 */
export function __filename(path) {
    return fileURLToPath(path);
}
/**
 * Util function to replace the commonjs __dirname
 * @param path
 * @returns
 */
export function ___dirname(path) {
    return dirname(__filename(path));
}
//# sourceMappingURL=files.helper.js.map