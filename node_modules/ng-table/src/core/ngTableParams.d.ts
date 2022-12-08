/// <reference types="angular" />
/// <reference types="angular-mocks" />
import { ILogService, IPromise, IQService } from 'angular';
import { Defaults } from './ngTableDefaults';
import { NgTableEventsChannel } from './ngTableEventsChannel';
import { SettingsPartial, Settings } from './ngTableSettings';
import { DataResult } from './data';
import { FilterValues } from './filtering';
import { Grouping, GroupingPartial, GroupValuesPartial, GroupingFunc, GroupSort } from './grouping';
import { SortingValues } from './sorting';
import { PageButton } from './paging';
/**
 * @private
 */
export interface InternalTableParams<T> extends NgTableParams<T> {
    isNullInstance: boolean;
}
export declare type ParamValuesPartial<T> = Partial<Pick<ParamValues<T>, 'page' | 'count' | 'filter' | 'sorting'>> & {
    group?: string | GroupingPartial<T>;
};
/**
 * The runtime values for {@link NgTableParams} that determine the set of data rows and
 * how they are to be displayed in a table
 */
export declare class ParamValues<T> {
    /**
     * The index of the "slice" of data rows, starting at 1, to be displayed by the table.
     */
    page: number;
    /**
     * The number of data rows per page
     */
    count: number;
    /**
     * The filter that should be applied to restrict the set of data rows
     */
    filter: FilterValues;
    /**
     * The sort order that should be applied to the data rows.
     */
    sorting: SortingValues;
    /**
     * The grouping that should be applied to the data rows
     */
    group: string | Grouping<T>;
}
/**
 * Parameters manager for an ngTable directive
 */
export declare class NgTableParams<T> {
    /**
     * The page of data rows currently being displayed in the table
     */
    data: T[];
    reloadPages: () => void;
    private defaultSettings;
    private errParamsMemento;
    private isCommittedDataset;
    isNullInstance: boolean;
    private initialEvents;
    private ngTableDefaults;
    private ngTableEventsChannel;
    private prevParamsMemento;
    private _params;
    private _settings;
    private $q;
    private $log;
    constructor(baseParameters?: ParamValuesPartial<T> | boolean, baseSettings?: SettingsPartial<T>);
    /**
     * Returns the number of data rows per page
     */
    count(): number;
    /**
     * Sets the number of data rows per page.
     * Changes to count will cause `isDataReloadRequired` to return true
     */
    count(count: number): this;
    /**
     * Returns the current filter values used to restrict the set of data rows.
     * @param trim supply true to return the current filter minus any insignificant values
     * (null,  undefined and empty string)
     */
    filter(trim?: boolean): FilterValues;
    /**
     * Sets filter values to the `filter` supplied; any existing filter will be removed
     * Changes to filter will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    filter(filter: FilterValues): this;
    /**
     * Generate array of pages.
     * When no arguments supplied, the current parameter state of this `NgTableParams` instance will be used
     * @param currentPage Which page must be active
     * @param totalItems  Total quantity of items
     * @param pageSize    Quantity of items on page
     * @param maxBlocks   Quantity of blocks for pagination
     * @returns Array of pages
     */
    generatePagesArray(currentPage?: number, totalItems?: number, pageSize?: number, maxBlocks?: number): PageButton[];
    /**
     * Returns the current grouping used to group the data rows
     */
    group(): Grouping<T>;
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: GroupValuesPartial): this;
    /**
     * Sets grouping to the `field` and `sortDirection` supplied; any existing grouping will be removed
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(field: string, sortDirection?: GroupSort): this;
    /**
     * Sets grouping to the `group` supplied; any existing grouping will be removed.
     * If `sortDirection` is supplied, this will be assigned to the sortDirection property of `group`
     * Changes to group will cause `isDataReloadRequired` to return true and the current `page` to be set to 1
     */
    group(group: GroupingFunc<T> | string, sortDirection?: GroupSort): this;
    /**
     * Returns true when an attempt to `reload` the current `parameter` values have resulted in a failure.
     * This method will continue to return true until the `reload` is successfully called or when the
     * `parameter` values have changed
     */
    hasErrorState(): boolean;
    /**
     * Returns true if `filter` has significant filter value(s) (any value except null, undefined, or empty string),
     * otherwise false
     */
    hasFilter(): boolean;
    /**
     * Return true when a change to `filters` require the `reload` method
     * to be run so as to ensure the data presented to the user reflects these filters
     */
    hasFilterChanges(): boolean;
    /**
     * Returns true when at least one group has been set
     */
    hasGroup(): boolean;
    /**
     * Returns true when the `group` and when supplied, the `sortDirection` matches an existing group
     */
    hasGroup(group: string | GroupingFunc<T>, sortDirection?: string): boolean;
    /**
     * Return true when a change to this instance should require the `reload` method
     * to be run so as to ensure the data rows presented to the user reflects the current state.
     *
     * Note that this method will return false when the `reload` method has run but fails. In this case
     * `hasErrorState` will return true.
     *
     * The built-in `ngTable` directives will watch for when this function returns true and will then call
     * the `reload` method to load its data rows
     */
    isDataReloadRequired(): boolean;
    /**
     * Returns true if sorting by the field supplied. Where direction supplied
     * the field must also be sorted by that direction to return true
     */
    isSortBy(field: string, direction?: string): boolean;
    /**
     * Returns sorting values in a format that can be consumed by the angular `$orderBy` filter service
     */
    orderBy(): string[];
    /**
     * Returns the index of the current "slice" of data rows
     */
    page(): number;
    /**
     * Sets the index of the current "slice" of data rows. The index starts at 1.
     * Changing the page number will cause `isDataReloadRequired` to return true
     */
    page(page: number): this;
    parameters(): ParamValues<T>;
    /**
     * Set new parameters
     */
    parameters(newParameters?: ParamValuesPartial<T> | {
        [name: string]: string;
    }, parseParamsFromUrl?: boolean): this;
    /**
     * Trigger a reload of the data rows
     */
    reload<TResult extends DataResult<T>>(): IPromise<TResult[]>;
    /**
     * Returns the settings for the table.
     */
    settings(): Settings<T>;
    /**
     * Sets the settings for the table; new setting values will be merged with the existing settings.
     * Supplying a new `dataset` will cause `isDataReloadRequired` to return true and the `ngTableEventsChannel`
     * to fire its `datasetChanged` event
     */
    settings(newSettings: SettingsPartial<T>): this;
    /**
     * Returns the current sorting used to order the data rows.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(): SortingValues;
    /**
     * Sets sorting values to the `sorting` supplied; any existing sorting will be removed.
     * Changes to sorting will cause `isDataReloadRequired` to return true
     */
    sorting(sorting: SortingValues): this;
    /**
     * Sets sorting to the `field` and `direction` supplied; any existing sorting will be removed
     */
    sorting(field: string, direction?: string): this;
    /**
     * Returns the count of the data rows that match the current `filter`
     */
    total(): number;
    /**
     * Sets `settings().total` to the value supplied.
     * Typically you will need to set a `total` in the body of any custom `getData` function
     * you supply as a setting value to this instance.
     * @example
     * ```js
     * const tp = new NgTableParams({}, { getData: customGetData })
     * function customGetData(params) {
     *      const queryResult = // code to fetch current data rows and total //
     *      params.total(queryResult.total);
     *      return queryResult.dataRowsPage;
     * }
     * ```
     */
    total(total: number): this;
    /**
     * Returns the current parameter values uri-encoded. Set `asString` to
     * true for the parameters to be returned as an array of strings of the form 'paramName=value'
     * otherwise parameters returned as a key-value object
     */
    url(asString?: boolean): {
        [name: string]: string;
    };
    private createComparableParams();
    private hasGlobalSearchFieldChanges();
    private log(...args);
    private parseGroup(group);
    private runInterceptorPipeline(fetchedData);
    static init($q: IQService, $log: ILogService, ngTableDefaults: Defaults, ngTableEventsChannel: NgTableEventsChannel): void;
}
