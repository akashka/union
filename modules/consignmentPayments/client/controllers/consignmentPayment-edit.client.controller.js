(function() {
  "use strict";

  angular
    .module("consignmentPayments")
    .controller("ConsignmentPaymentsAdminEditController", ConsignmentPaymentsAdminEditController);

  ConsignmentPaymentsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ConsignmentPaymentsService",
    "Authentication",
    "Notification"
  ];

  function ConsignmentPaymentsAdminEditController(
    $scope,
    $state,
    $window,
    ConsignmentPaymentsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    ConsignmentPaymentsService.getConsignmentPaymentDetails($state.params.consignmentPaymentId).$promise.then(
      function(response) {
        vm.consignmentPayment = response;
        // vm.consignmentPayment.bill_no = vm.consignmentPayment.bill_no + "A";
        // vm.consignmentPayment.co_copy = true;
        vm.consignmentPayment.bill_date = new Date(moment(vm.consignmentPayment.bill_date));
        vm.consignmentPayment.ref_date = new Date(moment(vm.consignmentPayment.ref_date));
        for (var i = 0; i < vm.consignmentPayment.details.length; i++) {
          vm.consignmentPayment.details[i].gc_date = new Date(
            moment(vm.consignmentPayment.details[i].gc_date)
          );
        }
        vm.details = vm.consignmentPayment.details;
        vm.isLoading++;
      }
    );

    ConsignmentPaymentsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allConsignmentPayments = response.data;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing ConsignmentPayment
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        consignmentPayment.$remove(function() {
          $state.go("admin.consignmentPayments.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> ConsignmentPayment deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function() {
      vm.consignmentPayment.details = vm.details;

      // Create a new consignmentPayment, or update the current instance
      ConsignmentPaymentsService
        .createOrUpdate(vm.consignmentPayment)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("consignmentPayments.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> ConsignmentPayment saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> ConsignmentPayment save error!'
        });
      }
    };

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.consignmentPaymentCompleted = false;

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
      if (vm.consignmentPayment.bill_no != undefined && vm.consignmentPayment.bill_no != "") {
        vm.duplicateBillNumber = vm.allConsignmentPayments.bill_no.includes(
          vm.consignmentPayment.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.consignmentPayment.ref_no != undefined && vm.consignmentPayment.ref_no != "") {
        vm.duplicateRefNumber = vm.allConsignmentPayments.ref_no.includes(
          vm.consignmentPayment.ref_no.toString()
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
