(function() {
  "use strict";

  angular.module("billPayments.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("billPayments", {
        abstract: true,
        url: "/billPayments",
        template: "<ui-view/>"
      })
      .state("billPayments.list", {
        url: "",
        templateUrl:
          "/modules/billPayments/client/views/list-billPayments.client.view.html",
        controller: "BillPaymentsListController",
        controllerAs: "vm"
      })
      .state("billPayments.create", {
        url: "/create",
        templateUrl:
          "/modules/billPayments/client/views/create-billPayment.client.view.html",
        controller: "BillPaymentsAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create BillPayment"
        },
        resolve: {
          billPaymentResolve: newBillPayment
        }
      })
      .state("billPayments.edit", {
        url: "/:billPaymentId/edit",
        templateUrl:
          "/modules/billPayments/client/views/edit-billPayment.client.view.html",
        controller: "BillPaymentsAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit BillPayment"
        }
      })
      .state("billPayments.view", {
        url: "/:billPaymentId",
        templateUrl:
          "/modules/billPayments/client/views/view-billPayment.client.view.html",
        controller: "BillPaymentsController",
        controllerAs: "vm",
        data: {
          pageTitle: "View BillPayment"
        }
      });
  }

  getBillPayment.$inject = ["$stateParams", "BillPaymentsService"];

  function getBillPayment($stateParams, BillPaymentsService) {
    return BillPaymentsService.query({ isArray: true }).$promise;
  }

  newBillPayment.$inject = ["BillPaymentsService"];

  function newBillPayment(BillPaymentsService) {
    return new BillPaymentsService();
  }
})();
