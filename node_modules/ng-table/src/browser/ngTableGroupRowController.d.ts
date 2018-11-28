/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IPromise } from 'angular';
import { DataResult, GroupingFunc } from '../core';
import { ColumnDef } from './public-interfaces';
import { TableScope } from './ngTableController';
/**
 * @private
 */
export interface ScopeExtensions<T> {
    $selGroup: GroupingFunc<any> | string;
    $selGroupTitle: string;
}
/**
 * Controller for the {@link ngTableGroupRow ngTableGroupRow} directive
 */
export declare class NgTableGroupRowController<T> {
    private $scope;
    static $inject: string[];
    private groupFns;
    constructor($scope: TableScope<T> & ScopeExtensions<T>);
    getGroupables(): (GroupingFunc<any> | ColumnDef)[];
    getGroupTitle(group: GroupingFunc<any> | ColumnDef): string | undefined;
    getVisibleColumns(): ColumnDef[];
    groupBy(group: GroupingFunc<any> | ColumnDef): void;
    isSelectedGroup(group: GroupingFunc<any> | ColumnDef): boolean;
    toggleDetail(): IPromise<DataResult<T>[]>;
    private changeSortDirection();
    private findGroupColumn(groupKey);
    private isGroupingFunc(val);
    private setGroup(grouping);
}
