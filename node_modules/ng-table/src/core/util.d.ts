import { GroupingPartial, GroupingFunc } from './grouping';
import { SortingValues } from './sorting';
/**
 * @private
 */
export declare function convertSortToOrderBy(sorting: SortingValues): string[];
/**
 * @private
 */
export declare function isGroupingFun(val: string | GroupingPartial<any>): val is GroupingFunc<any>;
