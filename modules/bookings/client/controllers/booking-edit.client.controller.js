(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsAdminEditController', BookingsAdminEditController);

  BookingsAdminEditController.$inject = ['$scope', '$state', '$window', 'BookingsService', 'Authentication', 'Notification', 'bookingResolve'];

  function BookingsAdminEditController($scope, $state, $window, booking, Authentication, Notification, bookingResolve) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bookings = angular.toJson(booking);
    vm.allBookings = booking.query();
    vm.isCoScreen = false;

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

    // Remove existing Booking
    vm.remove = function() {
      if ($window.confirm('Are you sure you want to delete?')) {
        booking.$remove(function () {
          $state.go('admin.bookings.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking deleted successfully!' });
        });
      }
    }

    // Save Bookiing
    vm.save = function() {
      vm.booking.details = vm.details;

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

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.bookingCompleted = false;

    vm.selectDate = function($event, num) {
      if(num == 1) { vm.dateset.bill_date.isOpened = true; }
      if(num == 2) { vm.dateset.ref_date.isOpened = true; }
    };

    vm.selectRowDate = function($event, i) {
       vm.gc_date[i].isOpened = true;
    };

    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(1920, 5, 22),
      startingDay: 1
    };

    vm.dateset = {
      bill_date: { isOpened: false },
      ref_date: { isOpened: false }
    };

    vm.gc_date = {
      0: { isOpened: false }
    };

    vm.addRow = function() {
      vm.details.push({
          gc_number: "",
          gc_date: "",
          from: "",
          to: "",
          package: "",
          weight: "",
          rate: "",
          kms: "",
          amount: "",
          extra_info: "",
          extras: []
      });
      vm.gc_date[vm.details.length-1] = { isOpened: false };
    }

    vm.deleteRow = function(ind) {
      vm.details.splice(ind, 1);
    }

    vm.addExtra = function(index) {
      if(vm.details[index].extras == undefined) vm.details[index].extras = [];
      vm.details[index].extras.push({
          extra_name: "",
          extra_value: "0"
      });
    }

    vm.removeExtra = function(index) {
      vm.details[index].extras.splice(vm.details[index].extras.length-1, 1);
    }

    vm.duplicateBillNumber = false;
    vm.onBillNumberChange = function() {
      vm.duplicateBillNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].bill_no == vm.booking.bill_no) vm.duplicateBillNumber = true;
      }
    }

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      vm.duplicateRefNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].ref_no == vm.booking.ref_no) vm.duplicateRefNumber = true;
      }
    }

    for(var k=0; k<bookingResolve.length; k++) {
      if(bookingResolve[k]._id == $state.params.bookingId) {
            for(var p=0; p<bookingResolve[k].details.length; p++) {
              bookingResolve[k].details[p].gc_date = new Date(moment(bookingResolve[k].details[p].gc_date));
            }
            vm.booking = {
                _id: bookingResolve[k]._id,
                bill_date: new Date(moment(bookingResolve[k].bill_date)),
                bill_no: bookingResolve[k].bill_no,
                bill_to: bookingResolve[k].bill_to,
                consignor: bookingResolve[k].consignor,
                consignee: bookingResolve[k].consignee,
                details: bookingResolve[k].details,
                ref_no: bookingResolve[k].ref_no,
                co_copy: bookingResolve[k].co_copy,
                ref_date: new Date(moment(bookingResolve[k].ref_date))
            };
            vm.details = bookingResolve[k].details;
      }
    }

  }
}());
