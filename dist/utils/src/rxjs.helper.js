import { combineLatest, of, EMPTY, from, isObservable, } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import util from 'node:util';
export function wrapIntoObservable(input) {
    if (input === null || input === undefined) {
        return EMPTY;
    }
    if (util.types.isAsyncFunction(input)) {
        return from(input());
    }
    if (isObservable(input)) {
        return input;
    }
    return of(input);
}
export function wrapIntoAnOperator(input) {
    if (util.types.isAsyncFunction(input)) {
        return mergeMap(input);
    }
    return input;
}
export function switchTap(project) {
    return (input) => input.pipe(switchMap((value, index) => combineLatest([of(value), project(value, index)])), map(([intialValue, projectedValue]) => projectedValue !== undefined ? projectedValue : intialValue));
}
//# sourceMappingURL=rxjs.helper.js.map