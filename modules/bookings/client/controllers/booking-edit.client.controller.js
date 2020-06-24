(function() {
  "use strict";

  angular
    .module("bookings")
    .controller("BookingsAdminEditController", BookingsAdminEditController);

  BookingsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BookingsService",
    "Authentication",
    "Notification"
  ];

  function BookingsAdminEditController(
    $scope,
    $state,
    $window,
    BookingsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    BookingsService.getBookingDetails($state.params.bookingId).$promise.then(
      function(response) {
        vm.booking = response;
        // vm.booking.bill_no = vm.booking.bill_no + "A";
        // vm.booking.co_copy = true;
        vm.booking.bill_date = new Date(moment(vm.booking.bill_date));
        vm.booking.ref_date = new Date(moment(vm.booking.ref_date));
        for (var i = 0; i < vm.booking.details.length; i++) {
          vm.booking.details[i].gc_date = new Date(
            moment(vm.booking.details[i].gc_date)
          );
        }
        vm.details = vm.booking.details;
        vm.isLoading++;
      }
    );

    BookingsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allBookings = response.data;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing Booking
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        booking.$remove(function() {
          $state.go("admin.bookings.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> Booking deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function() {
      vm.booking.details = vm.details;

      // Create a new booking, or update the current instance
      BookingsService
        .createOrUpdate(vm.booking)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("bookings.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> Booking save error!'
        });
      }
    };

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.bookingCompleted = false;

    vm.selectDate = function($event, num) {
      if (num == 1) {
        vm.dateset.bill_date.isOpened = true;
      }
      if (num == 2) {
        vm.dateset.ref_date.isOpened = true;
      }
    };

    vm.selectRowDate = function($event, i) {
      vm.gc_date[i].isOpened = true;
    };

    vm.dateOptions = {
      formatYear: "yy",
      maxDate: new Date(2030, 5, 22),
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
      vm.gc_date[vm.details.length - 1] = { isOpened: false };
    };

    vm.deleteRow = function(ind) {
      vm.details.splice(ind, 1);
    };

    vm.addExtra = function(index) {
      if (vm.details[index].extras == undefined) vm.details[index].extras = [];
      vm.details[index].extras.push({
        extra_name: "",
        extra_value: "0"
      });
    };

    vm.removeExtra = function(index) {
      vm.details[index].extras.splice(vm.details[index].extras.length - 1, 1);
    };

    vm.duplicateBillNumber = false;
    vm.onBillNumberChange = function() {
      if (vm.booking.bill_no != undefined && vm.booking.bill_no != "") {
        vm.duplicateBillNumber = vm.allBookings.bill_no.includes(
          vm.booking.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.booking.ref_no != undefined && vm.booking.ref_no != "") {
        vm.duplicateRefNumber = vm.allBookings.ref_no.includes(
          vm.booking.ref_no.toString()
        );
      }
    };

    $("input:text").bind("keydown", function(e) {
      var n = $("input:text").length;
      if (e.which == 13) {
        //Enter key
        e.preventDefault(); //to skip default behavior of the enter key
        var nextIndex = $("input:text").index(this) + 1;
        if (nextIndex < n) $("input:text")[nextIndex].focus();
        else {
          $("input:text")[nextIndex - 1].blur();
          $("#btnSubmit").click();
        }
      }
    });
  }
})();
