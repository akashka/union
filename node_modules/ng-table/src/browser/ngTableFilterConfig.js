/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import * as ng1 from 'angular';
import { assignPartialDeep } from '../shared';
/**
 * Configuration values that determine the behaviour of the `ngTableFilterConfig` service
 */
var FilterConfigValues = (function () {
    function FilterConfigValues() {
        /**
         * The default base url to use when deriving the url for a filter template given just an alias name
         */
        this.defaultBaseUrl = 'ng-table/filters/';
        /**
         * The extension to use when deriving the url of a filter template when given just an alias name
         */
        this.defaultExt = '.html';
        /**
         * A map of alias names and their corrosponding urls. A lookup against this map will be used
         * to find the url matching an alias name.
         * If no match is found then a url will be derived using the following pattern `${defaultBaseUrl}${aliasName}.${defaultExt}`
         */
        this.aliasUrls = {};
    }
    return FilterConfigValues;
}());
export { FilterConfigValues };
/**
 * The angular provider used to configure the behaviour of the `NgTableFilterConfig` service.
 */
var NgTableFilterConfigProvider = (function () {
    function NgTableFilterConfigProvider($injector) {
        var _this = this;
        this.$get = function () {
            return $injector.instantiate(NgTableFilterConfig, { config: ng1.copy(_this.config) });
        };
        this.$get.$inject = [];
        this.resetConfigs();
    }
    /**
     * Reset back to factory defaults the config values that `NgTableFilterConfig` service will use
     */
    NgTableFilterConfigProvider.prototype.resetConfigs = function () {
        this.config = new FilterConfigValues();
    };
    /**
     * Set the config values used by `NgTableFilterConfig` service
     */
    NgTableFilterConfigProvider.prototype.setConfig = function (customConfig) {
        this.config = assignPartialDeep(ng1.copy(this.config), customConfig);
    };
    return NgTableFilterConfigProvider;
}());
export { NgTableFilterConfigProvider };
NgTableFilterConfigProvider.$inject = ['$injector'];
/**
 * Exposes configuration values and methods used to return the location of the html
 * templates used to render the filter row of an ng-table directive
 */
var NgTableFilterConfig = (function () {
    function NgTableFilterConfig(
        /**
         * Readonly copy of the final values used to configure the service.
         */
        config) {
        this.config = config;
    }
    /**
     * Return the url of the html filter template registered with the alias supplied
     */
    NgTableFilterConfig.prototype.getUrlForAlias = function (aliasName, filterKey) {
        return this.config.aliasUrls[aliasName] || this.config.defaultBaseUrl + aliasName + this.config.defaultExt;
    };
    /**
     * Return the url of the html filter template for the supplied definition and key.
     * For more information see the documentation for {@link FilterTemplateMap}
     */
    NgTableFilterConfig.prototype.getTemplateUrl = function (filterDef, filterKey) {
        var filterName;
        if (typeof filterDef !== 'string') {
            filterName = filterDef.id;
        }
        else {
            filterName = filterDef;
        }
        if (filterName.indexOf('/') !== -1) {
            return filterName;
        }
        return this.getUrlForAlias(filterName, filterKey);
    };
    return NgTableFilterConfig;
}());
export { NgTableFilterConfig };
NgTableFilterConfig.$inject = ['config'];
//# sourceMappingURL=ngTableFilterConfig.js.map