/// <reference types="angular" />
import { IQService } from 'angular';
import { DataRowGroup, DefaultGetData } from '../data';
import { GetGroupFunc } from './';
/**
 * Implementation of the {@link DefaultGetData} interface
 *
 * @ngdoc service
 */
export declare function ngTableDefaultGetGroups<T>($q: IQService, ngTableDefaultGetData: DefaultGetData<DataRowGroup<T>>): GetGroupFunc<T>;
