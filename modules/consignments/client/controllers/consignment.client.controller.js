(function() {
  "use strict";

  angular
    .module("consignments")
    .controller("ConsignmentsAdminController", ConsignmentsAdminController);

  ConsignmentsAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ConsignmentsService",
    "Authentication",
    "Notification",
    "consignmentResolve",
    "$timeout"
  ];

  function ConsignmentsAdminController(
    $scope,
    $state,
    $window,
    consignment,
    Authentication,
    Notification,
    consignmentResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    consignment.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allConsignments = response.data;
      vm.consignmentForm.bill_no = Number(vm.allConsignments.latest_bill_no) + 1;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing Consignment
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        consignment.$remove(function() {
          $state.go("admin.consignments.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> Consignment deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.consignmentForm");
        return false;
      }
      vm.consignmentForm.details = vm.details;

      // Create a new consignment, or update the current instance
      consignment
        .createOrUpdate(vm.consignmentForm)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("consignments.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> Consignment saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> Consignment save error!'
        });
      }
    };

    vm.reset = function() {
      vm.consignmentForm = {
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
      vm.consignmentCompleted = false;
    };
    vm.reset();

    vm.gotoNewConsignment = function() {
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
      if (vm.consignmentForm.bill_no != undefined && vm.consignmentForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allConsignments.bill_no.includes(
          vm.consignmentForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allConsignments.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.consignmentForm.ref_no != undefined && vm.consignmentForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allConsignments.ref_no.includes(
          vm.consignmentForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(consignment_name) {
      var result = "";
      for (var i = 0; i < vm.allConsignments.length; i++) {
        if (
          vm.allConsignments[i].consignor.name.toUpperCase() ==
          consignment_name.toUpperCase()
        )
          result = vm.allConsignments[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allConsignments.length; i++) {
          if (
            vm.allConsignments[i].consignee.name.toUpperCase() ==
            consignment_name.toUpperCase()
          )
            result = vm.allConsignments[i].consignee.gstin_no;
        }
      }
      vm.consignmentForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(consignment_name) {
      var result = "";
      for (var i = 0; i < vm.allConsignments.length; i++) {
        if (
          vm.allConsignments[i].consignee.name.toUpperCase() ==
          consignment_name.toUpperCase()
        )
          result = vm.allConsignments[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allConsignments.length; i++) {
          if (
            vm.allConsignments[i].consignor.name.toUpperCase() ==
            consignment_name.toUpperCase()
          )
            result = vm.allConsignments[i].consignor.gstin_no;
        }
      }
      vm.consignmentForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allConsignmentTos = [];
    vm.consignmentTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allConsignments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allConsignments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.consignmentForm.consignor.name = string.name;
      vm.consignmentForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allConsignments.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allConsignments.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.consignmentForm.consignee.name = string.name;
      vm.consignmentForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.consignmentTos = [];
      angular.forEach(vm.allConsignments.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.consignmentTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.consignmentForm.bill_to = string;
      vm.consignmentTos = [];
    };

    if ($state.params.consignmentId) {
      vm.consignmentForm = {
        _id: consignmentResolve[0]._id,
        bill_date: consignmentResolve[0].bill_date,
        bill_no: consignmentResolve[0].bill_no,
        bill_to: consignmentResolve[0].bill_to,
        consignor: consignmentResolve[0].consignor,
        consignee: consignmentResolve[0].consignee,
        details: consignmentResolve[0].details,
        ref_no: consignmentResolve[0].ref_no,
        ref_date: consignmentResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(consignmentResolve[0].bill_no);
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
