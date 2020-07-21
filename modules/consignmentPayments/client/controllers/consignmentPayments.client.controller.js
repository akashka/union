(function () {
  'use strict';

  angular
    .module('consignmentPayments')
    .controller('ConsignmentPaymentsController', ConsignmentPaymentsController);

  ConsignmentPaymentsController.$inject = ['$scope', 'ConsignmentPaymentsService', 'Authentication', '$state'];

  function ConsignmentPaymentsController($scope, ConsignmentPaymentsService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    ConsignmentPaymentsService.getConsignmentPaymentDetails($state.params.consignmentPaymentId).$promise.then(function(response) {
      vm.consignmentPaymentForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
