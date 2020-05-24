/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IAttributes, IDirective, IParseService, IQService, IScope } from 'angular';
import { ColumnDef, SelectOption } from './public-interfaces';
/**
 * @private
 */
export interface InputAttributes extends IAttributes {
    ngTableSelectFilterDs: string;
}
/**
 * @private
 */
export interface ScopeExtensions {
    $selectData: SelectOption[];
}
/**
 * Takes the array returned by $column.filterData and makes it available as `$selectData` on the `$scope`.
 *
 * The resulting `$selectData` array will contain an extra item that is suitable to represent the user
 * "deselecting" an item from a `<select>` tag
 *
 * This directive is is focused on providing a datasource to an `ngOptions` directive
 */
declare function ngTableSelectFilterDs(): IDirective;
/**
 * @private
 */
export declare class NgTableSelectFilterDsController {
    private $scope;
    private $attrs;
    private $q;
    static $inject: string[];
    $column: ColumnDef;
    constructor($scope: IScope & ScopeExtensions, $parse: IParseService, $attrs: InputAttributes, $q: IQService);
    private bindDataSource();
    private hasEmptyOption(data);
    private getSelectListData($column);
}
export { ngTableSelectFilterDs };
