(function() {
  "use strict";

  angular
    .module("bookings")
    .controller("BookingsAdminController", BookingsAdminController);

  BookingsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BookingsService",
    "Authentication",
    "Notification",
    "bookingResolve",
    "$timeout"
  ];

  function BookingsAdminController(
    $scope,
    $state,
    $window,
    booking,
    Authentication,
    Notification,
    bookingResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    booking.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allBookings = response.data;
      vm.bookingForm.bill_no = Number(vm.allBookings.latest_bill_no) + 1;
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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.bookingForm");
        return false;
      }
      vm.bookingForm.details = vm.details;

      // Create a new booking, or update the current instance
      booking
        .createOrUpdate(vm.bookingForm)
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

    vm.reset = function() {
      vm.bookingForm = {
        bill_date: "",
        bill_no: "",
        bill_to: "",
        consignor: {
          name: "",
          gstin_no: ""
        },
        consignee: {
          name: "",
          gstin_no: ""
        },
        details: [],
        ref_no: "",
        ref_date: "",
        co_copy: false,
        _id: null
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

    vm.details = [
      {
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
        extras: [],
        total_amount: 0
      }
    ];

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
        extras: [],
        total_amount: 0
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
      if (vm.bookingForm.bill_no != undefined && vm.bookingForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allBookings.bill_no.includes(
          vm.bookingForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allBookings.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.bookingForm.ref_no != undefined && vm.bookingForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allBookings.ref_no.includes(
          vm.bookingForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(booking_name) {
      var result = "";
      for (var i = 0; i < vm.allBookings.length; i++) {
        if (
          vm.allBookings[i].consignor.name.toUpperCase() ==
          booking_name.toUpperCase()
        )
          result = vm.allBookings[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBookings.length; i++) {
          if (
            vm.allBookings[i].consignee.name.toUpperCase() ==
            booking_name.toUpperCase()
          )
            result = vm.allBookings[i].consignee.gstin_no;
        }
      }
      vm.bookingForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(booking_name) {
      var result = "";
      for (var i = 0; i < vm.allBookings.length; i++) {
        if (
          vm.allBookings[i].consignee.name.toUpperCase() ==
          booking_name.toUpperCase()
        )
          result = vm.allBookings[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBookings.length; i++) {
          if (
            vm.allBookings[i].consignor.name.toUpperCase() ==
            booking_name.toUpperCase()
          )
            result = vm.allBookings[i].consignor.gstin_no;
        }
      }
      vm.bookingForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allBookingTos = [];
    vm.bookingTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allBookings.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBookings.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.bookingForm.consignor.name = string.name;
      vm.bookingForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allBookings.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBookings.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.bookingForm.consignee.name = string.name;
      vm.bookingForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.bookingTos = [];
      angular.forEach(vm.allBookings.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.bookingTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.bookingForm.bill_to = string;
      vm.bookingTos = [];
    };

    if ($state.params.bookingId) {
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
      angular.element(abc).val(bookingResolve[0].bill_no);
    }

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
