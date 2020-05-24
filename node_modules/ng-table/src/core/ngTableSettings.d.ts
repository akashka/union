import { Defaults } from './ngTableDefaults';
import { DataSettingsPartial, DataSettings, DefaultGetData, GetDataFunc, Interceptor, InterceptableGetDataFunc } from './data';
import { FilterSettingsPartial, FilterSettings } from './filtering';
import { GetGroupFunc, GroupSettingsPartial, GroupSettings } from './grouping';
import { SortDirection } from './sorting';
/**
 * Configuration settings for {@link NgTableParams}
 */
export declare class Settings<T> {
    constructor();
    /**
     * Returns true whenever a call to `getData` is in progress
     */
    $loading: boolean;
    /**
     * The page size buttons that should be displayed. Each value defined in the array
     * determines the possible values that can be supplied to {@link NgTableParams} `page`
     */
    counts: number[];
    /**
     * An array that contains all the data rows that table should manage.
     * The `gateData` function will be used to manage the data rows
     * that ultimately will be displayed.
     */
    dataset?: T[];
    dataOptions: DataSettings;
    debugMode: boolean;
    /**
     * The total number of data rows before paging has been applied.
     * Typically you will not need to supply this yourself
     */
    total: number;
    /**
     * The default sort direction that will be used whenever a sorting is supplied that
     * does not define its own sort direction
     */
    defaultSort: SortDirection;
    filterOptions: FilterSettings<T>;
    /**
     * The function that will be used fetch data rows. Leave undefined to let the {@link IDefaultGetData}
     * service provide a default implementation that will work with the `dataset` array you supply.
     *
     * Typically you will supply a custom function when you need to execute filtering, paging and sorting
     * on the server
     */
    getData: GetDataFunc<T> | InterceptableGetDataFunc<T>;
    /**
     * The function that will be used group data rows according to the groupings returned by {@link NgTableParams} `group`
    */
    getGroups: GetGroupFunc<T>;
    groupOptions: GroupSettings;
    /**
     * The collection of interceptors that should apply to the results of a call to
     * the `getData` function before the data rows are displayed in the table
     */
    interceptors: Interceptor<T>[];
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMaxBlocks: number;
    /**
     * Configuration for the template that will display the page size buttons
     */
    paginationMinBlocks: number;
    /**
     * The html tag that will be used to display the sorting indicator in the table header
     */
    sortingIndicator: string;
    static isInitialized: boolean;
    private static defaultGetData;
    private static defaultGetGroups;
    private static ngTableDefaults;
    private static instance;
    static createWithOverrides<T>(): Settings<T>;
    static merge<T>(existing: Settings<T>, newSettings: SettingsPartial<T>): Settings<T>;
    private static optimizeFilterDelay<T>(settings);
    static init(ngTableDefaultGetData: DefaultGetData<any>, ngTableDefaultGetGroups: GetGroupFunc<any>, ngTableDefaults: Defaults): void;
}
export declare type SettingsPartial<T> = Partial<Pick<Settings<T>, '$loading' | 'counts' | 'dataset' | 'debugMode' | 'total' | 'defaultSort' | 'getData' | 'getGroups' | 'interceptors' | 'paginationMaxBlocks' | 'paginationMinBlocks' | 'sortingIndicator'>> & {
    dataOptions?: DataSettingsPartial;
    filterOptions?: FilterSettingsPartial<T>;
    groupOptions?: GroupSettingsPartial;
};
