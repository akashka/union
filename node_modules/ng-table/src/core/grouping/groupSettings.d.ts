import { SortDirection } from '../sorting';
export declare type GroupSort = SortDirection | '';
export declare type GroupSettingsPartial = Partial<GroupSettings>;
/**
 * Configuration that determines the data row grouping behaviour of a table
 */
export declare class GroupSettings {
    /**
     * The default sort direction that will be used whenever a group is supplied that
     * does not define its own sort direction
     */
    defaultSort: SortDirection;
    /**
     * Determines whether groups should be displayed expanded to show their items. Defaults to true
     */
    isExpanded: boolean;
}
