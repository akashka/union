(function() {
  "use strict";

  angular.module("consignmentPayments.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("consignmentPayments", {
        abstract: true,
        url: "/consignmentPayments",
        template: "<ui-view/>"
      })
      .state("consignmentPayments.list", {
        url: "",
        templateUrl:
          "/modules/consignmentPayments/client/views/list-consignmentPayments.client.view.html",
        controller: "ConsignmentPaymentsListController",
        controllerAs: "vm"
      })
      .state("consignmentPayments.create", {
        url: "/create",
        templateUrl:
          "/modules/consignmentPayments/client/views/create-consignmentPayment.client.view.html",
        controller: "ConsignmentPaymentsAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create ConsignmentPayment"
        },
        resolve: {
          consignmentPaymentResolve: newConsignmentPayment
        }
      })
      .state("consignmentPayments.edit", {
        url: "/:consignmentPaymentId/edit",S
        templateUrl:
          "/modules/consignmentPayments/client/views/edit-consignmentPayment.client.view.html",
        controller: "ConsignmentPaymentsAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit ConsignmentPayment"
        }
      })
      .state("consignmentPayments.view", {
        url: "/:consignmentPaymentId",
        templateUrl:
          "/modules/consignmentPayments/client/views/view-consignmentPayment.client.view.html",
        controller: "ConsignmentPaymentsController",
        controllerAs: "vm",
        data: {
          pageTitle: "View ConsignmentPayment"
        }
      });
  }

  getConsignmentPayment.$inject = ["$stateParams", "ConsignmentPaymentsService"];

  function getConsignmentPayment($stateParams, ConsignmentPaymentsService) {
    return ConsignmentPaymentsService.query({ isArray: true }).$promise;
  }

  newConsignmentPayment.$inject = ["ConsignmentPaymentsService"];

  function newConsignmentPayment(ConsignmentPaymentsService) {
    return new ConsignmentPaymentsService();
  }
})();
