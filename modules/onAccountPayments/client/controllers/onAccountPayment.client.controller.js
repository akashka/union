(function() {
  "use strict";

  angular
    .module("onAccountPayments")
    .controller("OnAccountPaymentsAdminController", OnAccountPaymentsAdminController);

  OnAccountPaymentsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "OnAccountPaymentsService",
    "Authentication",
    "Notification",
    "onAccountPaymentResolve",
    "$timeout"
  ];

  function OnAccountPaymentsAdminController(
    $scope,
    $state,
    $window,
    onAccountPayment,
    Authentication,
    Notification,
    onAccountPaymentResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    onAccountPayment.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allOnAccountPayments = response.data;
      vm.onAccountPaymentForm.bill_no = Number(vm.allOnAccountPayments.latest_bill_no) + 1;
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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.onAccountPaymentForm");
        return false;
      }
      vm.onAccountPaymentForm.details = vm.details;

      // Create a new onAccountPayment, or update the current instance
      onAccountPayment
        .createOrUpdate(vm.onAccountPaymentForm)
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

    vm.reset = function() {
      vm.onAccountPaymentForm = {
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
      vm.onAccountPaymentCompleted = false;
    };
    vm.reset();

    vm.gotoNewOnAccountPayment = function() {
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
      if (vm.onAccountPaymentForm.bill_no != undefined && vm.onAccountPaymentForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allOnAccountPayments.bill_no.includes(
          vm.onAccountPaymentForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allOnAccountPayments.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.onAccountPaymentForm.ref_no != undefined && vm.onAccountPaymentForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allOnAccountPayments.ref_no.includes(
          vm.onAccountPaymentForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(onAccountPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allOnAccountPayments.length; i++) {
        if (
          vm.allOnAccountPayments[i].consignor.name.toUpperCase() ==
          onAccountPayment_name.toUpperCase()
        )
          result = vm.allOnAccountPayments[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allOnAccountPayments.length; i++) {
          if (
            vm.allOnAccountPayments[i].consignee.name.toUpperCase() ==
            onAccountPayment_name.toUpperCase()
          )
            result = vm.allOnAccountPayments[i].consignee.gstin_no;
        }
      }
      vm.onAccountPaymentForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(onAccountPayment_name) {
      var result = "";
      for (var i = 0; i < vm.allOnAccountPayments.length; i++) {
        if (
          vm.allOnAccountPayments[i].consignee.name.toUpperCase() ==
          onAccountPayment_name.toUpperCase()
        )
          result = vm.allOnAccountPayments[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allOnAccountPayments.length; i++) {
          if (
            vm.allOnAccountPayments[i].consignor.name.toUpperCase() ==
            onAccountPayment_name.toUpperCase()
          )
            result = vm.allOnAccountPayments[i].consignor.gstin_no;
        }
      }
      vm.onAccountPaymentForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allOnAccountPaymentTos = [];
    vm.onAccountPaymentTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allOnAccountPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allOnAccountPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.onAccountPaymentForm.consignor.name = string.name;
      vm.onAccountPaymentForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allOnAccountPayments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allOnAccountPayments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.onAccountPaymentForm.consignee.name = string.name;
      vm.onAccountPaymentForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.onAccountPaymentTos = [];
      angular.forEach(vm.allOnAccountPayments.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.onAccountPaymentTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.onAccountPaymentForm.bill_to = string;
      vm.onAccountPaymentTos = [];
    };

    if ($state.params.onAccountPaymentId) {
      vm.onAccountPaymentForm = {
        _id: onAccountPaymentResolve[0]._id,
        bill_date: onAccountPaymentResolve[0].bill_date,
        bill_no: onAccountPaymentResolve[0].bill_no,
        bill_to: onAccountPaymentResolve[0].bill_to,
        consignor: onAccountPaymentResolve[0].consignor,
        consignee: onAccountPaymentResolve[0].consignee,
        details: onAccountPaymentResolve[0].details,
        ref_no: onAccountPaymentResolve[0].ref_no,
        ref_date: onAccountPaymentResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(onAccountPaymentResolve[0].bill_no);
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
