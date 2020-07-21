(function() {
  "use strict";

  angular
    .module("billPayments")
    .controller("BillPaymentsAdminEditController", BillPaymentsAdminEditController);

  BillPaymentsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BillPaymentsService",
    "Authentication",
    "Notification"
  ];

  function BillPaymentsAdminEditController(
    $scope,
    $state,
    $window,
    BillPaymentsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    BillPaymentsService.getBillPaymentDetails($state.params.billPaymentId).$promise.then(
      function(response) {
        vm.billPayment = response;
        // vm.billPayment.bill_no = vm.billPayment.bill_no + "A";
        // vm.billPayment.co_copy = true;
        vm.billPayment.bill_date = new Date(moment(vm.billPayment.bill_date));
        vm.billPayment.ref_date = new Date(moment(vm.billPayment.ref_date));
        for (var i = 0; i < vm.billPayment.details.length; i++) {
          vm.billPayment.details[i].gc_date = new Date(
            moment(vm.billPayment.details[i].gc_date)
          );
        }
        vm.details = vm.billPayment.details;
        vm.isLoading++;
      }
    );

    BillPaymentsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allBillPayments = response.data;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing BillPayment
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        billPayment.$remove(function() {
          $state.go("admin.billPayments.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> BillPayment deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function() {
      vm.billPayment.details = vm.details;

      // Create a new billPayment, or update the current instance
      BillPaymentsService
        .createOrUpdate(vm.billPayment)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("billPayments.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> BillPayment saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> BillPayment save error!'
        });
      }
    };

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.billPaymentCompleted = false;

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
      if (vm.billPayment.bill_no != undefined && vm.billPayment.bill_no != "") {
        vm.duplicateBillNumber = vm.allBillPayments.bill_no.includes(
          vm.billPayment.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.billPayment.ref_no != undefined && vm.billPayment.ref_no != "") {
        vm.duplicateRefNumber = vm.allBillPayments.ref_no.includes(
          vm.billPayment.ref_no.toString()
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
