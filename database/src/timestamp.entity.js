import { __decorate, __metadata } from "tslib";
import returnValue from '@node-yalc/utils/returnValue.js';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
export const YalcEntityWithTimestamps = (base) => {
    class YalcEntityWithTimestamps extends base {
    }
    __decorate([
        CreateDateColumn({
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
        }),
        __metadata("design:type", Date)
    ], YalcEntityWithTimestamps.prototype, "createdAt", void 0);
    __decorate([
        UpdateDateColumn({
            type: 'timestamp',
            default: returnValue('CURRENT_TIMESTAMP(6)'),
            onUpdate: 'CURRENT_TIMESTAMP(6)',
        }),
        __metadata("design:type", Date)
    ], YalcEntityWithTimestamps.prototype, "updatedAt", void 0);
    return YalcEntityWithTimestamps;
};
//# sourceMappingURL=timestamp.entity.js.map