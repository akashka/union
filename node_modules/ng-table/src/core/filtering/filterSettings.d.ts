import { FilterComparator } from './filterComparator';
import { FilterFunc } from './filterFunc';
export declare type FilterLayout = 'stack' | 'horizontal';
export declare type FilterSettingsPartial<T> = Partial<FilterSettings<T>>;
export declare class FilterSettings<T> {
    /**
     * Use this to determine how items are matched against the filter values.
     * This setting is identical to the `comparator` parameter supported by the angular
     * `$filter` filter service
     *
     * Defaults to `undefined` which will result in a case insensitive susbstring match when
     * `DefaultGetData` service is supplying the implementation for the
     * `Settings.getData` function
     */
    filterComparator?: FilterComparator<T>;
    /**
     * A duration to wait for the user to stop typing before applying the filter.
     * Note: this delay will NOT be applied when *small* managed inmemory arrays are supplied as a
     *       `SettingsPartial.dataset` argument to `NgTableParams.settings`.
     */
    filterDelay: number;
    /**
     * The number of elements up to which a managed inmemory array is considered small
     */
    filterDelayThreshold: number | null;
    /**
     * Overrides `DefaultGetDataProvider.filterFilterName`.
     * The value supplied should be the name of the angular `$filter` service that will be selected to perform
     * the actual filter logic.
     */
    filterFilterName?: string;
    /**
     * Tells `DefaultGetData` to use this function supplied to perform the filtering instead of selecting an angular $filter.
     */
    filterFn?: FilterFunc<T>;
    /**
     * The layout to use when multiple html templates are to rendered in a single table header column.
     */
    filterLayout: FilterLayout;
}
