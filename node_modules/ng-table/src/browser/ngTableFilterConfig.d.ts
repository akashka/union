/// <reference types="angular" />
import { IServiceProvider, auto } from 'angular';
import { FilterTemplateDef } from './public-interfaces';
/**
 * Configuration values that determine the behaviour of the `ngTableFilterConfig` service
 */
export declare class FilterConfigValues {
    /**
     * The default base url to use when deriving the url for a filter template given just an alias name
     */
    defaultBaseUrl: string;
    /**
     * The extension to use when deriving the url of a filter template when given just an alias name
     */
    defaultExt: string;
    /**
     * A map of alias names and their corrosponding urls. A lookup against this map will be used
     * to find the url matching an alias name.
     * If no match is found then a url will be derived using the following pattern `${defaultBaseUrl}${aliasName}.${defaultExt}`
     */
    aliasUrls: {
        [name: string]: string;
    };
}
export declare type FilterConfigValuesPartial = Partial<FilterConfigValues>;
/**
 * The angular provider used to configure the behaviour of the `NgTableFilterConfig` service.
 */
export declare class NgTableFilterConfigProvider implements IServiceProvider {
    static $inject: string[];
    $get: () => NgTableFilterConfig;
    private config;
    constructor($injector: auto.IInjectorService);
    /**
     * Reset back to factory defaults the config values that `NgTableFilterConfig` service will use
     */
    resetConfigs(): void;
    /**
     * Set the config values used by `NgTableFilterConfig` service
     */
    setConfig(customConfig: FilterConfigValuesPartial): void;
}
/**
 * Exposes configuration values and methods used to return the location of the html
 * templates used to render the filter row of an ng-table directive
 */
export declare class NgTableFilterConfig {
    /**
     * Readonly copy of the final values used to configure the service.
     */
    readonly config: FilterConfigValues;
    static $inject: string[];
    constructor(
        /**
         * Readonly copy of the final values used to configure the service.
         */
        config: FilterConfigValues);
    /**
     * Return the url of the html filter template registered with the alias supplied
     */
    getUrlForAlias(aliasName: string, filterKey?: string): string;
    /**
     * Return the url of the html filter template for the supplied definition and key.
     * For more information see the documentation for {@link FilterTemplateMap}
     */
    getTemplateUrl(filterDef: string | FilterTemplateDef, filterKey?: string): string;
}
