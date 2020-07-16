(function() {
  "use strict";

  angular.module("challans").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Challans",
      state: "challans",
      type: "dropdown",
      roles: ["*"],
      position: 2
    });

    menuService.addSubMenuItem("topbar", "challans", {
      title: "List Challans",
      state: "challans.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "challans", {
      title: "New Challan",
      state: "challans.create",
      roles: ["*"]
    });
  }
})();
