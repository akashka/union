/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAngularEvent } from 'angular';
import { ColumnDef } from './public-interfaces';
import { TableScope } from './ngTableController';
/**
 * @private
 */
export interface IAugmentedMouseEvent extends IAngularEvent {
    ctrlKey: boolean;
    metaKey: boolean;
}
/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
export declare class NgTableSorterRowController<T> {
    private $scope;
    static $inject: string[];
    constructor($scope: TableScope<T>);
    sortBy($column: ColumnDef, event: IAugmentedMouseEvent): void;
}
