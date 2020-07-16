(function() {
  "use strict";

  angular.module("consignments.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("consignments", {
        abstract: true,
        url: "/consignments",
        template: "<ui-view/>"
      })
      .state("consignments.list", {
        url: "",
        templateUrl:
          "/modules/consignments/client/views/list-consignments.client.view.html",
        controller: "ConsignmentsListController",
        controllerAs: "vm"
      })
      .state("consignments.create", {
        url: "/create",
        templateUrl:
          "/modules/consignments/client/views/create-consignment.client.view.html",
        controller: "ConsignmentsAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create Consignment"
        },
        resolve: {
          consignmentResolve: newConsignment
        }
      })
      .state("consignments.edit", {
        url: "/:consignmentId/edit",
        templateUrl:
          "/modules/consignments/client/views/edit-consignment.client.view.html",
        controller: "ConsignmentsAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit Consignment"
        }
      })
      .state("consignments.view", {
        url: "/:consignmentId",
        templateUrl:
          "/modules/consignments/client/views/view-consignment.client.view.html",
        controller: "ConsignmentsController",
        controllerAs: "vm",
        data: {
          pageTitle: "View Consignment"
        }
      });
  }

  getConsignment.$inject = ["$stateParams", "ConsignmentsService"];

  function getConsignment($stateParams, ConsignmentsService) {
    return ConsignmentsService.query({ isArray: true }).$promise;
  }

  newConsignment.$inject = ["ConsignmentsService"];

  function newConsignment(ConsignmentsService) {
    return new ConsignmentsService();
  }
})();
