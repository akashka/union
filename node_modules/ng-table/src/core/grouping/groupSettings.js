/**
 * Configuration that determines the data row grouping behaviour of a table
 */
var GroupSettings = (function () {
    function GroupSettings() {
        /**
         * The default sort direction that will be used whenever a group is supplied that
         * does not define its own sort direction
         */
        this.defaultSort = 'asc';
        /**
         * Determines whether groups should be displayed expanded to show their items. Defaults to true
         */
        this.isExpanded = true;
    }
    return GroupSettings;
}());
export { GroupSettings };
//# sourceMappingURL=groupSettings.js.map