(function () {
  'use strict';

  angular
    .module('challans')
    .controller('ChallansController', ChallansController);

  ChallansController.$inject = ['$scope', 'ChallansService', 'Authentication', '$state'];

  function ChallansController($scope, ChallansService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    ChallansService.getChallanDetails($state.params.challanId).$promise.then(function(response) {
      vm.challanForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
