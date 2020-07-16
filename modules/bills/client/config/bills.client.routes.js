(function() {
  "use strict";

  angular.module("bills.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("bills", {
        abstract: true,
        url: "/bills",
        template: "<ui-view/>"
      })
      .state("bills.list", {
        url: "",
        templateUrl:
          "/modules/bills/client/views/list-bills.client.view.html",
        controller: "BillsListController",
        controllerAs: "vm"
      })
      .state("bills.create", {
        url: "/create",
        templateUrl:
          "/modules/bills/client/views/create-bill.client.view.html",
        controller: "BillsAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create Bill"
        },
        resolve: {
          billResolve: newBill
        }
      })
      .state("bills.edit", {
        url: "/:billId/edit",
        templateUrl:
          "/modules/bills/client/views/edit-bill.client.view.html",
        controller: "BillsAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit Bill"
        }
      })
      .state("bills.view", {
        url: "/:billId",
        templateUrl:
          "/modules/bills/client/views/view-bill.client.view.html",
        controller: "BillsController",
        controllerAs: "vm",
        data: {
          pageTitle: "View Bill"
        }
      });
  }

  getBill.$inject = ["$stateParams", "BillsService"];

  function getBill($stateParams, BillsService) {
    return BillsService.query({ isArray: true }).$promise;
  }

  newBill.$inject = ["BillsService"];

  function newBill(BillsService) {
    return new BillsService();
  }
})();
