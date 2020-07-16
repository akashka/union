(function() {
  "use strict";

  angular.module("challans.routes").config(routeConfig);

  routeConfig.$inject = ["$stateProvider"];

  function routeConfig($stateProvider) {
    $stateProvider
      .state("challans", {
        abstract: true,
        url: "/challans",
        template: "<ui-view/>"
      })
      .state("challans.list", {
        url: "",
        templateUrl:
          "/modules/challans/client/views/list-challans.client.view.html",
        controller: "ChallansListController",
        controllerAs: "vm"
      })
      .state("challans.create", {
        url: "/create",
        templateUrl:
          "/modules/challans/client/views/create-challan.client.view.html",
        controller: "ChallansAdminController",
        controllerAs: "vm",
        data: {
          pageTitle: "Create Challan"
        },
        resolve: {
          challanResolve: newChallan
        }
      })
      .state("challans.edit", {
        url: "/:challanId/edit",
        templateUrl:
          "/modules/challans/client/views/edit-challan.client.view.html",
        controller: "ChallansAdminEditController",
        controllerAs: "vm",
        data: {
          pageTitle: "Edit Challan"
        }
      })
      .state("challans.view", {
        url: "/:challanId",
        templateUrl:
          "/modules/challans/client/views/view-challan.client.view.html",
        controller: "ChallansController",
        controllerAs: "vm",
        data: {
          pageTitle: "View Challan"
        }
      });
  }

  getChallan.$inject = ["$stateParams", "ChallansService"];

  function getChallan($stateParams, ChallansService) {
    return ChallansService.query({ isArray: true }).$promise;
  }

  newChallan.$inject = ["ChallansService"];

  function newChallan(ChallansService) {
    return new ChallansService();
  }
})();
