/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import { IScope } from 'angular';
import { FilterTemplateDef, FilterTemplateDefMap } from './public-interfaces';
import { NgTableFilterConfig } from './ngTableFilterConfig';
/**
 * @private
 */
export interface ScopeExtensions {
    getFilterPlaceholderValue(filterDef: string | FilterTemplateDef, filterKey?: string): string;
}
/**
 * Controller for the {@link ngTableFilterRow ngTableFilterRow} directive
 */
export declare class NgTableFilterRowController {
    static $inject: string[];
    config: NgTableFilterConfig;
    constructor($scope: IScope & ScopeExtensions, ngTableFilterConfig: NgTableFilterConfig);
    getFilterCellCss(filter: FilterTemplateDefMap, layout: string): string;
    getFilterPlaceholderValue(filterDef: string | FilterTemplateDef, filterKey?: string): string;
}
