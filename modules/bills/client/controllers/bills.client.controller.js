(function () {
  'use strict';

  angular
    .module('bills')
    .controller('BillsController', BillsController);

  BillsController.$inject = ['$scope', 'BillsService', 'Authentication', '$state'];

  function BillsController($scope, BillsService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    BillsService.getBillDetails($state.params.billId).$promise.then(function(response) {
      vm.billForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
