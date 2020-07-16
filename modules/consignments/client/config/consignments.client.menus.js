(function() {
  "use strict";

  angular.module("consignments").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Consignments",
      state: "consignments",
      type: "dropdown",
      roles: ["*"],
      position: 2
    });

    menuService.addSubMenuItem("topbar", "consignments", {
      title: "List Consignments",
      state: "consignments.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "consignments", {
      title: "New Consignment",
      state: "consignments.create",
      roles: ["*"]
    });
  }
})();
