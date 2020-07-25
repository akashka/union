(function() {
  "use strict";

  angular
    .module("onAccountPayments")
    .controller("OnAccountPaymentsAdminEditController", OnAccountPaymentsAdminEditController);

  OnAccountPaymentsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "OnAccountPaymentsService",
    "Authentication",
    "Notification"
  ];

  function OnAccountPaymentsAdminEditController(
    $scope,
    $state,
    $window,
    OnAccountPaymentsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    OnAccountPaymentsService.getOnAccountPaymentDetails($state.params.onAccountPaymentId).$promise.then(
      function(response) {
        vm.onAccountPayment = response;
        // vm.onAccountPayment.bill_no = vm.onAccountPayment.bill_no + "A";
        // vm.onAccountPayment.co_copy = true;
        vm.onAccountPayment.bill_date = new Date(moment(vm.onAccountPayment.bill_date));
        vm.onAccountPayment.ref_date = new Date(moment(vm.onAccountPayment.ref_date));
        for (var i = 0; i < vm.onAccountPayment.details.length; i++) {
          vm.onAccountPayment.details[i].gc_date = new Date(
            moment(vm.onAccountPayment.details[i].gc_date)
          );
        }
        vm.details = vm.onAccountPayment.details;
        vm.isLoading++;
      }
    );

    OnAccountPaymentsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allOnAccountPayments = response.data;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing OnAccountPayment
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        onAccountPayment.$remove(function() {
          $state.go("admin.onAccountPayments.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> OnAccountPayment deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function() {
      vm.onAccountPayment.details = vm.details;

      // Create a new onAccountPayment, or update the current instance
      OnAccountPaymentsService
        .createOrUpdate(vm.onAccountPayment)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("onAccountPayments.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> OnAccountPayment saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> OnAccountPayment save error!'
        });
      }
    };

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.onAccountPaymentCompleted = false;

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
      if (vm.onAccountPayment.bill_no != undefined && vm.onAccountPayment.bill_no != "") {
        vm.duplicateBillNumber = vm.allOnAccountPayments.bill_no.includes(
          vm.onAccountPayment.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.onAccountPayment.ref_no != undefined && vm.onAccountPayment.ref_no != "") {
        vm.duplicateRefNumber = vm.allOnAccountPayments.ref_no.includes(
          vm.onAccountPayment.ref_no.toString()
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
