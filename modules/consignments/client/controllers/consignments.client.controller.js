(function() {
  "use strict";

  angular
    .module("consignments")
    .controller("ConsignmentsController", ConsignmentsController);

  ConsignmentsController.$inject = [
    "$scope",
    "ConsignmentsService",
    "Authentication",
    "$state"
  ];

  function ConsignmentsController(
    $scope,
    ConsignmentsService,
    Authentication,
    $state
  ) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    ConsignmentsService.getConsignmentDetails(
      $state.params.consignmentId
    ).$promise.then(function(response) {
      vm.consignmentForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };
  }
})();
