(function() {
  "use strict";

  angular.module("bills").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Bills",
      state: "bills",
      type: "dropdown",
      roles: ["admin", "user"],
      position: 5
    });

    menuService.addSubMenuItem("topbar", "bills", {
      title: "List Bills",
      state: "bills.list",
      roles: ["admin", "user"]
    });

    menuService.addSubMenuItem("topbar", "bills", {
      title: "New Bill",
      state: "bills.create",
      roles: ["admin", "user"]
    });
  }
})();
