(function() {
  "use strict";

  angular.module("onAccountPayments").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenuItem("topbar", {
      title: "OnAccountPayment",
      state: "onAccountPayments",
      type: "dropdown",
      roles: ["*"],
      position: 2
    });

    menuService.addSubMenuItem("topbar", "onAccountPayments", {
      title: "List OnAccountPayments",
      state: "onAccountPayments.list",
      roles: ["*"]
    });

    menuService.addSubMenuItem("topbar", "onAccountPayments", {
      title: "New OnAccountPayment",
      state: "onAccountPayments.create",
      roles: ["*"]
    });
  }
})();
