(function() {
  "use strict";

  angular
    .module("billPayments")
    .controller("BillPaymentsAdminController", BillPaymentsAdminController);

  BillPaymentsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BillPaymentsService",
    "Authentication",
    "Notification",
    "billPaymentResolve",
    "$timeout"
  ];

  function BillPaymentsAdminController(
    $scope,
    $state,
    $window,
    billPayment,
    Authentication,
    Notification,
    billPaymentResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    billPayment.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allBillPayments = response.data;
      vm.billPaymentForm.bill_no = Number(vm.allBillPayments.latest_bill_no) + 1;
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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.billPaymentForm");
        return false;
      }
      vm.billPaymentForm.details = vm.details;

      // Create a new billPayment, or update the current instance
      billPayment
        .createOrUpdate(vm.billPaymentForm)
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

    vm.reset = function() {
      vm.billPaymentForm = {
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
      vm.billPaymentCompleted = false;
    };
    vm.reset();

    vm.gotoNewBillPayment = function() {
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
      if (vm.billPaymentForm.bill_no != undefined && vm.billPaymentForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allBillPayments.bill_no.includes(
          vm.billPaymentForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allBillPayments.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.billPaymentForm.ref_no != undefined && vm.billPaymentForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allBillPayments.ref_no.includes(
          vm.billPaymentForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(billPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allBillPayments.length; i++) {
        if (
          vm.allBillPayments[i].consignor.name.toUpperCase() ==
          billPayment_name.toUpperCase()
        )
          result = vm.allBillPayments[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBillPayments.length; i++) {
          if (
            vm.allBillPayments[i].consignee.name.toUpperCase() ==
            billPayment_name.toUpperCase()
          )
            result = vm.allBillPayments[i].consignee.gstin_no;
        }
      }
      vm.billPaymentForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(billPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allBillPayments.length; i++) {
        if (
          vm.allBillPayments[i].consignee.name.toUpperCase() ==
          billPayment_name.toUpperCase()
        )
          result = vm.allBillPayments[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBillPayments.length; i++) {
          if (
            vm.allBillPayments[i].consignor.name.toUpperCase() ==
            billPayment_name.toUpperCase()
          )
            result = vm.allBillPayments[i].consignor.gstin_no;
        }
      }
      vm.billPaymentForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allBillPaymentTos = [];
    vm.billPaymentTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allBillPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBillPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.billPaymentForm.consignor.name = string.name;
      vm.billPaymentForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allBillPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBillPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.billPaymentForm.consignee.name = string.name;
      vm.billPaymentForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.billPaymentTos = [];
      angular.forEach(vm.allBillPayments.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.billPaymentTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.billPaymentForm.bill_to = string;
      vm.billPaymentTos = [];
    };

    if ($state.params.billPaymentId) {
      vm.billPaymentForm = {
        _id: billPaymentResolve[0]._id,
        bill_date: billPaymentResolve[0].bill_date,
        bill_no: billPaymentResolve[0].bill_no,
        bill_to: billPaymentResolve[0].bill_to,
        consignor: billPaymentResolve[0].consignor,
        consignee: billPaymentResolve[0].consignee,
        details: billPaymentResolve[0].details,
        ref_no: billPaymentResolve[0].ref_no,
        ref_date: billPaymentResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(billPaymentResolve[0].bill_no);
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
