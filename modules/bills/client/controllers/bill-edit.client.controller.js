(function() {
  "use strict";

  angular
    .module("bills")
    .controller("BillsAdminEditController", BillsAdminEditController);

  BillsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BillsService",
    "Authentication",
    "Notification"
  ];

  function BillsAdminEditController(
    $scope,
    $state,
    $window,
    BillsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    BillsService.getBillDetails($state.params.billId).$promise.then(
      function(response) {
        vm.bill = response;
        // vm.bill.bill_no = vm.bill.bill_no + "A";
        // vm.bill.co_copy = true;
        vm.bill.bill_date = new Date(moment(vm.bill.bill_date));
        vm.bill.ref_date = new Date(moment(vm.bill.ref_date));
        for (var i = 0; i < vm.bill.details.length; i++) {
          vm.bill.details[i].gc_date = new Date(
            moment(vm.bill.details[i].gc_date)
          );
        }
        vm.details = vm.bill.details;
        vm.isLoading++;
      }
    );

    BillsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allBills = response.data;
      vm.isLoading++;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing Bill
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        bill.$remove(function() {
          $state.go("admin.bills.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> Bill deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function() {
      vm.bill.details = vm.details;

      // Create a new bill, or update the current instance
      BillsService
        .createOrUpdate(vm.bill)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("bills.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> Bill saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> Bill save error!'
        });
      }
    };

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.billCompleted = false;

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
      if (vm.bill.bill_no != undefined && vm.bill.bill_no != "") {
        vm.duplicateBillNumber = vm.allBills.bill_no.includes(
          vm.bill.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.bill.ref_no != undefined && vm.bill.ref_no != "") {
        vm.duplicateRefNumber = vm.allBills.ref_no.includes(
          vm.bill.ref_no.toString()
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
