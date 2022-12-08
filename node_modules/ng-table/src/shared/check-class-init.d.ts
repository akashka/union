export interface InitializedClass {
    new (...args: any[]): any;
    isInitialized: boolean;
}
/**
 * @private
 */
export declare function checkClassInit(clazz: InitializedClass): void;
