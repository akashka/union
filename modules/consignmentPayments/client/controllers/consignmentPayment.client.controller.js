(function() {
  "use strict";

  angular
    .module("consignmentPayments")
    .controller("ConsignmentPaymentsAdminController", ConsignmentPaymentsAdminController);

  ConsignmentPaymentsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ConsignmentPaymentsService",
    "Authentication",
    "Notification",
    "consignmentPaymentResolve",
    "$timeout"
  ];

  function ConsignmentPaymentsAdminController(
    $scope,
    $state,
    $window,
    consignmentPayment,
    Authentication,
    Notification,
    consignmentPaymentResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    consignmentPayment.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allConsignmentPayments = response.data;
      vm.consignmentPaymentForm.bill_no = Number(vm.allConsignmentPayments.latest_bill_no) + 1;
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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.consignmentPaymentForm");
        return false;
      }
      vm.consignmentPaymentForm.details = vm.details;

      // Create a new consignmentPayment, or update the current instance
      consignmentPayment
        .createOrUpdate(vm.consignmentPaymentForm)
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

    vm.reset = function() {
      vm.consignmentPaymentForm = {
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
      vm.consignmentPaymentCompleted = false;
    };
    vm.reset();

    vm.gotoNewConsignmentPayment = function() {
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
      if (vm.consignmentPaymentForm.bill_no != undefined && vm.consignmentPaymentForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allConsignmentPayments.bill_no.includes(
          vm.consignmentPaymentForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allConsignmentPayments.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.consignmentPaymentForm.ref_no != undefined && vm.consignmentPaymentForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allConsignmentPayments.ref_no.includes(
          vm.consignmentPaymentForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(consignmentPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allConsignmentPayments.length; i++) {
        if (
          vm.allConsignmentPayments[i].consignor.name.toUpperCase() ==
          consignmentPayment_name.toUpperCase()
        )
          result = vm.allConsignmentPayments[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allConsignmentPayments.length; i++) {
          if (
            vm.allConsignmentPayments[i].consignee.name.toUpperCase() ==
            consignmentPayment_name.toUpperCase()
          )
            result = vm.allConsignmentPayments[i].consignee.gstin_no;
        }
      }
      vm.consignmentPaymentForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(consignmentPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allConsignmentPayments.length; i++) {
        if (
          vm.allConsignmentPayments[i].consignee.name.toUpperCase() ==
          consignmentPayment_name.toUpperCase()
        )
          result = vm.allConsignmentPayments[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allConsignmentPayments.length; i++) {
          if (
            vm.allConsignmentPayments[i].consignor.name.toUpperCase() ==
            consignmentPayment_name.toUpperCase()
          )
            result = vm.allConsignmentPayments[i].consignor.gstin_no;
        }
      }
      vm.consignmentPaymentForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allConsignmentPaymentTos = [];
    vm.consignmentPaymentTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allConsignmentPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allConsignmentPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.consignmentPaymentForm.consignor.name = string.name;
      vm.consignmentPaymentForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allConsignmentPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allConsignmentPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.consignmentPaymentForm.consignee.name = string.name;
      vm.consignmentPaymentForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.consignmentPaymentTos = [];
      angular.forEach(vm.allConsignmentPayments.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.consignmentPaymentTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.consignmentPaymentForm.bill_to = string;
      vm.consignmentPaymentTos = [];
    };

    if ($state.params.consignmentPaymentId) {
      vm.consignmentPaymentForm = {
        _id: consignmentPaymentResolve[0]._id,
        bill_date: consignmentPaymentResolve[0].bill_date,
        bill_no: consignmentPaymentResolve[0].bill_no,
        bill_to: consignmentPaymentResolve[0].bill_to,
        consignor: consignmentPaymentResolve[0].consignor,
        consignee: consignmentPaymentResolve[0].consignee,
        details: consignmentPaymentResolve[0].details,
        ref_no: consignmentPaymentResolve[0].ref_no,
        ref_date: consignmentPaymentResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(consignmentPaymentResolve[0].bill_no);
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
