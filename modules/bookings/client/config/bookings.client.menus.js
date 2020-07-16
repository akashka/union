(function() {
  "use strict";

  angular.module("bookings").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Bookings",
      state: "bookings",
      type: "dropdown",
      roles: ["*"],
      position: 1
    });

    menuService.addSubMenuItem("topbar", "bookings", {
      title: "List Bookings",
      state: "bookings.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "bookings", {
      title: "New Booking",
      state: "bookings.create",
      roles: ["*"]
    });
  }
})();
