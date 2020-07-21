(function () {
  'use strict';

  angular
    .module('billPayments')
    .controller('BillPaymentsController', BillPaymentsController);

  BillPaymentsController.$inject = ['$scope', 'BillPaymentsService', 'Authentication', '$state'];

  function BillPaymentsController($scope, BillPaymentsService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    BillPaymentsService.getBillPaymentDetails($state.params.billPaymentId).$promise.then(function(response) {
      vm.billPaymentForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
