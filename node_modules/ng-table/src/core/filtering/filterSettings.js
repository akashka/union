var FilterSettings = (function () {
    function FilterSettings() {
        /**
         * Use this to determine how items are matched against the filter values.
         * This setting is identical to the `comparator` parameter supported by the angular
         * `$filter` filter service
         *
         * Defaults to `undefined` which will result in a case insensitive susbstring match when
         * `DefaultGetData` service is supplying the implementation for the
         * `Settings.getData` function
         */
        this.filterComparator = undefined; // look for a substring match in case insensitive way
        /**
         * A duration to wait for the user to stop typing before applying the filter.
         * Note: this delay will NOT be applied when *small* managed inmemory arrays are supplied as a
         *       `SettingsPartial.dataset` argument to `NgTableParams.settings`.
         */
        this.filterDelay = 500;
        /**
         * The number of elements up to which a managed inmemory array is considered small
         */
        this.filterDelayThreshold = 10000;
        /**
         * Overrides `DefaultGetDataProvider.filterFilterName`.
         * The value supplied should be the name of the angular `$filter` service that will be selected to perform
         * the actual filter logic.
         */
        this.filterFilterName = undefined;
        /**
         * Tells `DefaultGetData` to use this function supplied to perform the filtering instead of selecting an angular $filter.
         */
        this.filterFn = undefined;
        /**
         * The layout to use when multiple html templates are to rendered in a single table header column.
         */
        this.filterLayout = 'stack';
    }
    return FilterSettings;
}());
export { FilterSettings };
//# sourceMappingURL=filterSettings.js.map