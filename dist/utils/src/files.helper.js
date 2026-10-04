import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
export function __filename(path) {
    return fileURLToPath(path);
}
export function ___dirname(path) {
    return dirname(__filename(path));
}
//# sourceMappingURL=files.helper.js.map