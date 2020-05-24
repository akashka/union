import * as ng1 from 'angular';
/**
 * @private
 */
export function assignPartialDeep(destination, partial, optionalPropSelector, customizer) {
    if (optionalPropSelector === void 0) { optionalPropSelector = function () { return false; }; }
    if (customizer === void 0) { customizer = function () { return undefined; }; }
    var keys = Object.keys(partial);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var srcVal = partial[key];
        if (srcVal === undefined) {
            if (optionalPropSelector(key, destination)) {
                destination[key] = srcVal;
            }
            else {
            }
            continue;
        }
        var destVal = destination[key];
        var customVal = customizer(destVal, srcVal, key);
        if (customVal !== undefined) {
            destination[key] = customVal;
        }
        else if (ng1.isArray(srcVal)) {
            destination[key] = srcVal.slice();
        }
        else if (!ng1.isObject(srcVal)) {
            destination[key] = srcVal;
        }
        else {
            destination[key] = assignPartialDeep(destVal, srcVal);
        }
    }
    return destination;
}
//# sourceMappingURL=assign-partial-deep.js.map