/// <reference types="angular" />
/// <reference types="angular-mocks" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAttributes, IAugmentedJQuery, ICompileService, IDocumentService, IParseService, IScope, ITimeoutService } from 'angular';
import { DataResults, GroupedDataResults, NgTableParams, NgTableEventsChannel, PageButton } from '../core';
import { ColumnDef, ColumnDefPartial, DynamicTableColDef, TableHtmlAttributes } from './public-interfaces';
import { NgTableColumn } from './ngTableColumn';
/**
 * @private
 */
export interface TableScope<T> extends IScope {
    $columns: ColumnDef[];
    $loading: boolean;
    $filterRow: {
        disabled: boolean;
    };
    $data?: DataResults<T>;
    $groups?: GroupedDataResults<T>;
    $groupRow: {
        show: boolean;
    };
    show_filter: boolean;
    pages: PageButton[];
    templates: {
        header: string;
        pagination: string;
    };
    params: NgTableParams<T>;
}
/**
 * The controller for the {@link ngTable ngTable} and {@link ngTableDynamic ngTableDynamic} directives
 */
export declare class NgTableController<TParams, TCol extends ColumnDefPartial | DynamicTableColDef> {
    private $scope;
    private $parse;
    private $compile;
    private $attrs;
    private $element;
    private $document;
    private ngTableColumn;
    private ngTableEventsChannel;
    static $inject: string[];
    private delayFilter;
    private readonly hasVisibleFilterColumn;
    constructor($scope: TableScope<TParams>, $timeout: ITimeoutService, $parse: IParseService, $compile: ICompileService, $attrs: IAttributes & TableHtmlAttributes, $element: IAugmentedJQuery, $document: IDocumentService, ngTableColumn: NgTableColumn<TCol>, ngTableEventsChannel: NgTableEventsChannel);
    private onDataReloadStatusChange(newStatus);
    compileDirectiveTemplates(): void;
    loadFilterData($columns: ColumnDef[]): void;
    buildColumns(columns: TCol[]): ColumnDef[];
    parseNgTableDynamicExpr(attr: string): {
        tableParams: string;
        columns: string;
    };
    setupBindingsToInternalScope(tableParamsExpr: string): void;
    private setupFilterRowBindingsToInternalScope();
    private setupGroupRowBindingsToInternalScope();
    private getVisibleColumns();
    private subscribeToTableEvents();
    private some<T>(array, predicate);
}
