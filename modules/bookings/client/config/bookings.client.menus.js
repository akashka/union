(function() {
  "use strict";

  angular.module("bookings").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "Bookings",
      state: "bookings",
      type: "dropdown",
      roles: ["admin", "user"],
      position: 1
    });

    menuService.addSubMenuItem("topbar", "bookings", {
      title: "List Bookings",
      state: "bookings.list",
      roles: ["admin", "user"]
    });

    menuService.addSubMenuItem("topbar", "bookings", {
      title: "New Booking",
      state: "bookings.create",
      roles: ["admin", "user"]
    });
  }
})();
