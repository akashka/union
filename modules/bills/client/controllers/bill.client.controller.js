(function() {
  "use strict";

  angular
    .module("bills")
    .controller("BillsAdminController", BillsAdminController);

  BillsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BillsService",
    "Authentication",
    "Notification",
    "billResolve",
    "$timeout"
  ];

  function BillsAdminController(
    $scope,
    $state,
    $window,
    bill,
    Authentication,
    Notification,
    billResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    bill.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allBills = response.data;
      vm.billForm.bill_no = Number(vm.allBills.latest_bill_no) + 1;
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
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.billForm");
        return false;
      }
      vm.billForm.details = vm.details;

      // Create a new bill, or update the current instance
      bill
        .createOrUpdate(vm.billForm)
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

    vm.reset = function() {
      vm.billForm = {
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
      vm.billCompleted = false;
    };
    vm.reset();

    vm.gotoNewBill = function() {
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
      if (vm.billForm.bill_no != undefined && vm.billForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allBills.bill_no.includes(
          vm.billForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allBills.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.billForm.ref_no != undefined && vm.billForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allBills.ref_no.includes(
          vm.billForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(bill_name) {
      var result = "";
      for (var i = 0; i < vm.allBills.length; i++) {
        if (
          vm.allBills[i].consignor.name.toUpperCase() ==
          bill_name.toUpperCase()
        )
          result = vm.allBills[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBills.length; i++) {
          if (
            vm.allBills[i].consignee.name.toUpperCase() ==
            bill_name.toUpperCase()
          )
            result = vm.allBills[i].consignee.gstin_no;
        }
      }
      vm.billForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(bill_name) {
      var result = "";
      for (var i = 0; i < vm.allBills.length; i++) {
        if (
          vm.allBills[i].consignee.name.toUpperCase() ==
          bill_name.toUpperCase()
        )
          result = vm.allBills[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allBills.length; i++) {
          if (
            vm.allBills[i].consignor.name.toUpperCase() ==
            bill_name.toUpperCase()
          )
            result = vm.allBills[i].consignor.gstin_no;
        }
      }
      vm.billForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allBillTos = [];
    vm.billTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allBills.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBills.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.billForm.consignor.name = string.name;
      vm.billForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allBills.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allBills.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.billForm.consignee.name = string.name;
      vm.billForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.billTos = [];
      angular.forEach(vm.allBills.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.billTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.billForm.bill_to = string;
      vm.billTos = [];
    };

    if ($state.params.billId) {
      vm.billForm = {
        _id: billResolve[0]._id,
        bill_date: billResolve[0].bill_date,
        bill_no: billResolve[0].bill_no,
        bill_to: billResolve[0].bill_to,
        consignor: billResolve[0].consignor,
        consignee: billResolve[0].consignee,
        details: billResolve[0].details,
        ref_no: billResolve[0].ref_no,
        ref_date: billResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(billResolve[0].bill_no);
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
