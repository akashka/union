/**
 * Controller for the {@link ngTableSorterRow ngTableSorterRow} directive
 */
var NgTableSorterRowController = (function () {
    function NgTableSorterRowController($scope) {
        this.$scope = $scope;
    }
    NgTableSorterRowController.prototype.sortBy = function ($column, event) {
        var parsedSortable = $column.sortable && $column.sortable();
        if (!parsedSortable || typeof parsedSortable !== 'string') {
            return;
        }
        else {
            var defaultSort = this.$scope.params.settings().defaultSort;
            var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
            var sorting = this.$scope.params.sorting() && this.$scope.params.sorting()[parsedSortable] && (this.$scope.params.sorting()[parsedSortable] === defaultSort);
            var sortingParams = (event.ctrlKey || event.metaKey) ? this.$scope.params.sorting() : {};
            sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);
            this.$scope.params.parameters({
                sorting: sortingParams
            });
        }
    };
    return NgTableSorterRowController;
}());
export { NgTableSorterRowController };
NgTableSorterRowController.$inject = ['$scope'];
//# sourceMappingURL=ngTableSorterRowController.js.map