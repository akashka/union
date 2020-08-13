(function() {
  "use strict";

  angular.module("challans").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Challans",
      state: "challans",
      type: "dropdown",
      roles: ["admin", "user"],
      position: 4
    });

    menuService.addSubMenuItem("topbar", "challans", {
      title: "List Challans",
      state: "challans.list",
      roles: ["admin", "user"]
    });

    menuService.addSubMenuItem("topbar", "challans", {
      title: "New Challan",
      state: "challans.create",
      roles: ["admin", "user"]
    });
  }
})();
