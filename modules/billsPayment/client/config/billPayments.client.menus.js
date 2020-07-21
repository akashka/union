(function() {
  "use strict";

  angular.module("billPayments").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "BillPayments",
      state: "billPayments",
      type: "dropdown",
      roles: ["*"],
      position: 2
    });

    menuService.addSubMenuItem("topbar", "billPayments", {
      title: "List BillPayments",
      state: "billPayments.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "billPayments", {
      title: "New BillPayment",
      state: "billPayments.create",
      roles: ["*"]
    });
  }
})();
