(function () {
  'use strict';

  angular
    .module('onAccountPayments')
    .controller('OnAccountPaymentsController', OnAccountPaymentsController);

  OnAccountPaymentsController.$inject = ['$scope', 'OnAccountPaymentsService', 'Authentication', '$state'];

  function OnAccountPaymentsController($scope, OnAccountPaymentsService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    OnAccountPaymentsService.getOnAccountPaymentDetails($state.params.onAccountPaymentId).$promise.then(function(response) {
      vm.onAccountPaymentForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
