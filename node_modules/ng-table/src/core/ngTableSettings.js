import * as ng1 from 'angular';
import { assignPartialDeep, checkClassInit } from '../shared';
import { DataSettings } from './data';
import { FilterSettings } from './filtering';
import { GroupSettings } from './grouping';
/**
 * Configuration settings for {@link NgTableParams}
 */
var Settings = (function () {
    function Settings() {
        /**
         * Returns true whenever a call to `getData` is in progress
         */
        this.$loading = false;
        /**
         * The page size buttons that should be displayed. Each value defined in the array
         * determines the possible values that can be supplied to {@link NgTableParams} `page`
         */
        this.counts = [10, 25, 50, 100];
        /**
         * An array that contains all the data rows that table should manage.
         * The `gateData` function will be used to manage the data rows
         * that ultimately will be displayed.
         */
        this.dataset = undefined;
        this.dataOptions = new DataSettings();
        this.debugMode = false;
        /**
         * The total number of data rows before paging has been applied.
         * Typically you will not need to supply this yourself
         */
        this.total = 0;
        /**
         * The default sort direction that will be used whenever a sorting is supplied that
         * does not define its own sort direction
         */
        this.defaultSort = 'desc';
        this.filterOptions = new FilterSettings();
        /**
         * The function that will be used fetch data rows. Leave undefined to let the {@link IDefaultGetData}
         * service provide a default implementation that will work with the `dataset` array you supply.
         *
         * Typically you will supply a custom function when you need to execute filtering, paging and sorting
         * on the server
         */
        this.getData = Settings.defaultGetData;
        /**
         * The function that will be used group data rows according to the groupings returned by {@link NgTableParams} `group`
        */
        this.getGroups = Settings.defaultGetGroups;
        this.groupOptions = new GroupSettings();
        /**
         * The collection of interceptors that should apply to the results of a call to
         * the `getData` function before the data rows are displayed in the table
         */
        this.interceptors = new Array();
        /**
         * Configuration for the template that will display the page size buttons
         */
        this.paginationMaxBlocks = 11;
        /**
         * Configuration for the template that will display the page size buttons
         */
        this.paginationMinBlocks = 5;
        /**
         * The html tag that will be used to display the sorting indicator in the table header
         */
        this.sortingIndicator = 'span';
        checkClassInit(Settings);
    }
    Settings.createWithOverrides = function () {
        checkClassInit(Settings);
        return Settings.merge(Settings.instance, Settings.ngTableDefaults.settings || {});
    };
    Settings.merge = function (existing, newSettings) {
        checkClassInit(Settings);
        var optionalPropNames = ['dataset'];
        var results = assignPartialDeep(ng1.copy(existing), newSettings, function (key) { return optionalPropNames.indexOf(key) !== -1; }, function (destValue, srcValue, key) {
            // copy *reference* to dataset
            if (key === 'dataset') {
                return srcValue;
            }
            return undefined;
        });
        if (newSettings.dataset) {
            results.total = newSettings.dataset.length;
            Settings.optimizeFilterDelay(results);
        }
        return results;
    };
    Settings.optimizeFilterDelay = function (settings) {
        // don't debounce by default filter input when working with small synchronous datasets
        if (settings.filterOptions.filterDelay === Settings.instance.filterOptions.filterDelay &&
            settings.total <= settings.filterOptions.filterDelayThreshold &&
            settings.getData === Settings.instance.getData) {
            settings.filterOptions.filterDelay = 0;
        }
    };
    Settings.init = function (ngTableDefaultGetData, ngTableDefaultGetGroups, ngTableDefaults) {
        Settings.defaultGetData = function (params) {
            return ngTableDefaultGetData(params.settings().dataset, params);
        };
        Settings.defaultGetGroups = ngTableDefaultGetGroups;
        Settings.ngTableDefaults = ngTableDefaults;
        Settings.isInitialized = true;
        Settings.instance = new Settings();
    };
    return Settings;
}());
export { Settings };
Settings.isInitialized = false;
Settings.init.$inject = ['ngTableDefaultGetData', 'ngTableDefaultGetGroups', 'ngTableDefaults'];
//# sourceMappingURL=ngTableSettings.js.map