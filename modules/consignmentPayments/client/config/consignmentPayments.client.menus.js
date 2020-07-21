(function() {
  "use strict";

  angular.module("consignmentPayments").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "ConsignmentPayments",
      state: "consignmentPayments",
      type: "dropdown",
      roles: ["*"],
      position: 2
    });

    menuService.addSubMenuItem("topbar", "consignmentPayments", {
      title: "List ConsignmentPayments",
      state: "consignmentPayments.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "consignmentPayments", {
      title: "New ConsignmentPayment",
      state: "consignmentPayments.create",
      roles: ["*"]
    });
  }
})();
