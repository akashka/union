/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IScope } from 'angular';
import { ColumnDef, ColumnDefPartial, DynamicTableColDef } from './public-interfaces';
/**
 * @private
 * Service to construct a $column definition used by {@link ngTable ngTable} directive
 */
export declare class NgTableColumn<TCol extends ColumnDefPartial | DynamicTableColDef> {
    static $inject: string[];
    /**
     * Creates a $column for use within a header template
     *
     * @param column the initial definition for $column to build
     * @param defaultScope the $scope to supply to the $column getter methods when not supplied by caller
     * @param columns a reference to the $columns array to make available on the context supplied to the
     * $column getter methods
     */
    buildColumn(column: TCol, defaultScope: IScope, columns: ColumnDef[]): ColumnDef;
    private createDefaults();
    private createGetterSetter(initialValue);
}
