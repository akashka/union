(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsPaymentController', BookingsPaymentController);

  BookingsPaymentController.$inject = ['$scope', '$state', '$window', 'BookingsService', 'Authentication', 'Notification', '$timeout', '$uibModal'];

  function BookingsPaymentController($scope, $state, $window, BookingsService, Authentication, Notification, $timeout, $uibModal) {
    var vm = this;

    vm.bookings = BookingsService.query();
    vm.allBookings = BookingsService.query();

    vm.paymentForm = {
        amount: "",
        details: "",
        dated: new Date(),
    };

    vm.save = function() {
      if(!valid) {
        return false;
      }

      if(vm.booking.payments == undefined || vm.booking.payments == null)
          vm.booking.payments = [];

      vm.booking.payments.push(vm.paymentForm);

      // Create a new booking, or update the current instance
      booking.createOrUpdate(vm.booking)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('bookings.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Booking save error!' });
      }
    }

    vm.isOpened = false;

    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(1920, 5, 22),
      startingDay: 1
    };

    vm.selectDate = function($event, num) {
      if(num == 1) { vm.isOpened = true; }
    };

  }
}());
