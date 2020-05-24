/**
 * @private
 */
export function checkClassInit(clazz) {
    if (!clazz.isInitialized) {
        throw new Error('Class used before initialized. Hint: it is only safe to use this class after all run blocks (ng 1) / app initializers (ng 2) have executed.');
    }
}
//# sourceMappingURL=check-class-init.js.map