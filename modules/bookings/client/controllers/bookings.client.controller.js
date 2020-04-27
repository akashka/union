(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsController', BookingsController);

  BookingsController.$inject = ['$scope', 'BookingsService', 'Authentication', '$state'];

  function BookingsController($scope, BookingsService, Authentication, $state) {
    var vm = this;
    vm.isLoading = 0;

    vm.authentication = Authentication;
    BookingsService.getBookingDetails($state.params.bookingId).$promise.then(function(response) {
      vm.bookingForm = response;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

  }
}());
