(function() {
  "use strict";

  angular.module("consignments").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Consignments",
      state: "consignments",
      type: "dropdown",
      roles: ["admin", "user"],
      position: 3
    });

    menuService.addSubMenuItem("topbar", "consignments", {
      title: "List Consignments",
      state: "consignments.list",
      roles: ["admin", "user"]
    });

    menuService.addSubMenuItem("topbar", "consignments", {
      title: "New Consignment",
      state: "consignments.create",
      roles: ["admin", "user"]
    });
  }
})();
