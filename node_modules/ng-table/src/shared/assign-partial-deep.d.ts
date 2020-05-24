/**
 * @private
 */
export declare function assignPartialDeep<T extends TPartial, TPartial>(destination: T, partial: TPartial, optionalPropSelector?: (key: string, destination: T) => boolean, customizer?: (destValue: any, srcValue: any, key: string) => any): T;
