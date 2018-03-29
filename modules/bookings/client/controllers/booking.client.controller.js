(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsAdminController', BookingsAdminController);

  BookingsAdminController.$inject = ['$scope', '$state', '$window', 'BookingsService', 'Authentication', 'Notification', 'bookingResolve'];

  function BookingsAdminController($scope, $state, $window, booking, Authentication, Notification, bookingResolve) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bookings = angular.toJson(booking);
    vm.allBookings = booking.query();

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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bookingForm');
        return false;
      }
      vm.bookingForm.details = vm.details;

      // Create a new booking, or update the current instance
      booking.createOrUpdate(vm.bookingForm)
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

    vm.reset = function() {
      vm.bookingForm = {
        bill_date: "",
        bill_no: "",
        bill_to: "",
        consignor: {
          name: "",
          gstin_no: "",
        },
        consignee: {
          name: "",
          gstin_no: "",
        },
        details: [],
        ref_no: "",
        ref_date: "",
        _id: null,
      };

      vm.isError = false;
      vm.requestSubmitted = false;
      vm.bookingCompleted = false;
    };

    vm.reset();

    vm.gotoNewBooking = function() {
         vm.reset();         
    };

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

    vm.details = [{
        gc_number: "",
        gc_date: "",
        from: "",
        to: "",
        package: "",
        weight: "",
        rate: "",
        kms: "",
        amount: "",
        extra_info: ""
    }];

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
          extra_info: ""
      });
      vm.gc_date[vm.details.length-1] = { isOpened: false };
    }

    vm.duplicateBillNumber = false;
    vm.onBillNumberChange = function() {
      vm.duplicateBillNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].bill_no == vm.bookingForm.bill_no) vm.duplicateBillNumber = true;
      }
    }

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      vm.duplicateRefNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].ref_no == vm.bookingForm.ref_no) vm.duplicateRefNumber = true;
      }
    }

    if($state.params.bookingId) {
      vm.bookingForm = {
        _id: bookingResolve[0]._id,
        bill_date: bookingResolve[0].bill_date,
        bill_no: bookingResolve[0].bill_no,
        bill_to: bookingResolve[0].bill_to,
        consignor: bookingResolve[0].consignor,
        consignee: bookingResolve[0].consignee,
        details: bookingResolve[0].details,
        ref_no: bookingResolve[0].ref_no,
        ref_date: bookingResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      console.log(bookingResolve[0].bill_no);
      angular.element(abc).val(bookingResolve[0].bill_no);
      console.log(angular.element(abc));
      // angular.element($()).val().trigger('change');
    }

  }
}());
