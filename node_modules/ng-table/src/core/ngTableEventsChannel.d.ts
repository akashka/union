/// <reference types="angular" />
/**
 * ngTable: Table + Angular JS
 *
 * @author Vitalii Savchuk <esvit666@gmail.com>
 * @url https://github.com/esvit/ng-table/
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */
import * as ng1 from 'angular';
import { IScope } from 'angular';
import { DataResult } from './data';
import { PageButton } from './paging';
import { NgTableParams } from './ngTableParams';
/**
 * Alias for the types that can be used to filter events
 */
export declare type EventSelector<T> = NgTableParams<T> | EventSelectorFunc;
/**
 * Signature of the event hander that is registered to receive the *afterCreated* event
 */
export interface AfterCreatedListener {
    (publisher: NgTableParams<any>): any;
}
/**
 * Signature of the event hander that is registered to receive the *afterReloadData* event
 */
export interface AfterReloadDataListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[], oldData: DataResult<T>[]): any;
}
/**
 * Signature of the event hander that is registered to receive the *datasetChanged* event
 */
export interface DatasetChangedListener<T> {
    (publisher: NgTableParams<T>, newDataset: T[], oldDataset: T[]): any;
}
/**
 * Signature of the function used to filter the events to only specific instances of
 * {@link NgTableParams}
 */
export interface EventSelectorFunc {
    (publisher: NgTableParams<any>): boolean;
}
/**
 * Signature of the event hander that is registered to receive the *pagesChanged* event
 */
export interface PagesChangedListener {
    (publisher: NgTableParams<any>, newPages: PageButton[], oldPages: PageButton[]): any;
}
/**
* Signature of the event hander that is registered to receive the *afterDataFiltered* event
*/
export interface AfterDataFilteredListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[]): any;
}
/**
* Signature of the event hander that is registered to receive the *afterDataSorted* event
*/
export interface AfterDataSortedListener<T> {
    (publisher: NgTableParams<T>, newData: DataResult<T>[]): any;
}
/**
 * Signature of the function used to explicitly unregister an event handler so that it stops
 * receiving notifications
 */
export interface UnregistrationFunc {
    (): void;
}
/**
 * Strongly typed pub/sub for {@link NgTableParams}
 *
 * Supported events:
 *
 * * afterCreated - raised when a new instance of {@link NgTableParams} has finished being constructed
 * * afterReloadData - raised when the {@link NgTableParams} `reload` method has finished loading new data
 * * datasetChanged - raised when {@link Settings} `dataset` receives a new data array
 * * pagesChanged - raised when a new pages array has been generated
 */
export interface NgTableEventsChannel {
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: AfterCreatedListener, scope: IScope, eventFilter?: EventSelectorFunc): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new `NgTableParams` instance has finished being constructed.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterCreated(listener: AfterCreatedListener, eventFilter?: EventSelectorFunc): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: AfterReloadDataListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the `reload` method of an `NgTableParams` instance has successfully executed
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterReloadData<T>(listener: AfterReloadDataListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: DatasetChangedListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a new data rows *array* is supplied as a `settings` value to a `NgTableParams` instance.
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onDatasetChanged<T>(listener: DatasetChangedListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called. Supply a
     * `scope` to have angular automatically unregister the listener when the `scope` is destroyed.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: PagesChangedListener, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever the paging buttons for an `NgTableParams` instance change
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `NgTableParams` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onPagesChanged<T>(listener: PagesChangedListener, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance filters data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataFiltered<T>(listener: AfterDataFilteredListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance filters data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataFiltered<T>(listener: AfterDataFilteredListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance orders data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param scope the angular `$scope` that will limit the lifetime of the event subscription
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataSorted<T>(listener: AfterDataSortedListener<T>, scope: IScope, eventFilter?: EventSelector<T>): UnregistrationFunc;
    /**
     * Subscribe to receive notification whenever a `ngTableDefaultGetData` instance orders data
     * Optionally supply an `eventFilter` to restrict which events that should trigger the `listener` to be called.
     *
     * @param listener the function that will be called when the event fires
     * @param eventFilter either the specific `DefaultGetData` instance you want to receive events for or a predicate function that should return true to receive the event
     * @return a unregistration function that when called will unregister the `listener`
     */
    onAfterDataSorted<T>(listener: AfterDataSortedListener<T>, eventFilter?: EventSelector<T>): UnregistrationFunc;
    publishAfterCreated<T>(publisher: NgTableParams<T>): void;
    publishAfterReloadData<T>(publisher: NgTableParams<T>, newData: T[], oldData: T[]): void;
    publishDatasetChanged<T>(publisher: NgTableParams<T>, newDataset: T[] | undefined, oldDataset: T[] | undefined): void;
    publishPagesChanged<T>(publisher: NgTableParams<T>, newPages: PageButton[], oldPages: PageButton[]): void;
    publishAfterDataFiltered<T>(publisher: NgTableParams<T>, newData: T[]): void;
    publishAfterDataSorted<T>(params: NgTableParams<T>, newData: T[]): void;
}
export declare class NgTableEventsChannel {
    private $rootScope;
    static $inject: string[];
    constructor($rootScope: ng1.IRootScopeService);
    private addTableParamsEvent(eventName, target);
    private createPublishEventFn(eventName);
    private createEventSubscriptionFn(eventName);
}
