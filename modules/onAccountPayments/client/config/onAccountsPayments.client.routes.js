(function() {
  "use strict";

  angular.module("onAccountPayments.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("onAccountPayments", {
        abstract: true,
        url: "/onAccountPayments",
        template: "<ui-view/>"
      })
      .state("onAccountPayments.list", {
        url: "",
        templateUrl:
          "/modules/onAccountPayments/client/views/list-onAccountPayments.client.view.html",
        controller: "OnAccountPaymentsListController",
        controllerAs: "vm"
      })
      .state("onAccountPayments.create", {
        url: "/create",
        templateUrl:
          "/modules/onAccountPayments/client/views/create-onAccountPayment.client.view.html",
        controller: "OnAccountPaymentsAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create OnAccountPayment"
        },
        resolve: {
          onAccountPaymentResolve: newOnAccountPayment
        }
      })
      .state("onAccountPayments.edit", {
        url: "/:onAccountPaymentId/edit",
        templateUrl:
          "/modules/onAccountPayments/client/views/edit-onAccountPayment.client.view.html",
        controller: "OnAccountPaymentsAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit OnAccountPayment"
        }
      })
      .state("onAccountPayments.view", {
        url: "/:onAccountPaymentId",
        templateUrl:
          "/modules/onAccountPayments/client/views/view-onAccountPayment.client.view.html",
        controller: "OnAccountPaymentsController",
        controllerAs: "vm",
        data: {
          pageTitle: "View OnAccountPayment"
        }
      });
  }

  getOnAccountPayment.$inject = ["$stateParams", "OnAccountPaymentsService"];

  function getOnAccountPayment($stateParams, OnAccountPaymentsService) {
    return OnAccountPaymentsService.query({ isArray: true }).$promise;
  }

  newOnAccountPayment.$inject = ["OnAccountPaymentsService"];

  function newOnAccountPayment(OnAccountPaymentsService) {
    return new OnAccountPaymentsService();
  }
})();
