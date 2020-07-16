(function() {
  "use strict";

  angular
    .module("challans")
    .controller("ChallansAdminController", ChallansAdminController);

  ChallansAdminController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ChallansService",
    "Authentication",
    "Notification",
    "challanResolve",
    "$timeout"
  ];

  function ChallansAdminController(
    $scope,
    $state,
    $window,
    challan,
    Authentication,
    Notification,
    challanResolve,
    $timeout
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;

    challan.getPrimaryDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allChallans = response.data;
      vm.challanForm.bill_no = Number(vm.allChallans.latest_bill_no) + 1;
    });

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    // Remove existing Challan
    vm.remove = function() {
      if ($window.confirm("Are you sure you want to delete?")) {
        challan.$remove(function() {
          $state.go("admin.challans.list");
          Notification.success({
            message:
              '<i class="glyphicon glyphicon-ok"></i> Challan deleted successfully!'
          });
        });
      }
    };

    // Save Bookiing
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast("show-errors-check-validity", "vm.form.challanForm");
        return false;
      }
      vm.challanForm.details = vm.details;

      // Create a new challan, or update the current instance
      challan
        .createOrUpdate(vm.challanForm)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go("challans.list");
        Notification.success({
          message:
            '<i class="glyphicon glyphicon-ok"></i> Challan saved successfully!'
        });
      }

      function errorCallback(res) {
        Notification.error({
          message: res.data.message,
          title:
            '<i class="glyphicon glyphicon-remove"></i> Challan save error!'
        });
      }
    };

    vm.reset = function() {
      vm.challanForm = {
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
      vm.challanCompleted = false;
    };
    vm.reset();

    vm.gotoNewChallan = function() {
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
      if (vm.challanForm.bill_no != undefined && vm.challanForm.bill_no != "") {
        vm.duplicateBillNumber = vm.allChallans.bill_no.includes(
          vm.challanForm.bill_no.toString()
        );
      }
    };

    vm.duplicateGcNumber = false;
    vm.onGcNumberChange = function(gc_number) {
      if (gc_number != "" && gc_number != undefined) {
        vm.duplicateGcNumber = vm.allChallans.gc_number
          .map(gcs => {
            return gcs.includes(gc_number.toString());
          })
          .includes(true);
      }
      console.log(vm.duplicateGcNumber);
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.challanForm.ref_no != undefined && vm.challanForm.ref_no != "") {
        vm.duplicateRefNumber = vm.allChallans.ref_no.includes(
          vm.challanForm.ref_no.toString()
        );
      }
    };

    vm.onConsignorNameChange = function(challan_name) {
      var result = "";
      for (var i = 0; i < vm.allChallans.length; i++) {
        if (
          vm.allChallans[i].consignor.name.toUpperCase() ==
          challan_name.toUpperCase()
        )
          result = vm.allChallans[i].consignor.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allChallans.length; i++) {
          if (
            vm.allChallans[i].consignee.name.toUpperCase() ==
            challan_name.toUpperCase()
          )
            result = vm.allChallans[i].consignee.gstin_no;
        }
      }
      vm.challanForm.consignor.gstin_no = result;
    };

    vm.onConsigneeNameChange = function(challan_name) {
      var result = "";
      for (var i = 0; i < vm.allChallans.length; i++) {
        if (
          vm.allChallans[i].consignee.name.toUpperCase() ==
          challan_name.toUpperCase()
        )
          result = vm.allChallans[i].consignee.gstin_no;
      }
      if (result == "") {
        for (var i = 0; i < vm.allChallans.length; i++) {
          if (
            vm.allChallans[i].consignor.name.toUpperCase() ==
            challan_name.toUpperCase()
          )
            result = vm.allChallans[i].consignor.gstin_no;
        }
      }
      vm.challanForm.consignee.gstin_no = result;
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allChallanTos = [];
    vm.challanTos = [];

    vm.complete = function(selectedClient) {
      var output = [];
      vm.clients = [];
      angular.forEach(vm.allChallans.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allChallans.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.clients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.fillTextbox = function(string) {
      vm.challanForm.consignor.name = string.name;
      vm.challanForm.consignor.gstin_no = string.gstin_no;
      vm.clients = [];
    };

    vm.scomplete = function(selectedClient) {
      vm.sclients = [];
      var output = [];
      angular.forEach(vm.allChallans.consignor, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      angular.forEach(vm.allChallans.consignee, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.sclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.sfillTextbox = function(string) {
      vm.challanForm.consignee.name = string.name;
      vm.challanForm.consignee.gstin_no = string.gstin_no;
      vm.sclients = [];
    };

    vm.tcomplete = function(selectedClient) {
      var output = [];
      vm.challanTos = [];
      angular.forEach(vm.allChallans.bill_to, function(clts) {
        if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
          output.push(clts);
        }
      });
      vm.challanTos = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.tfillTextbox = function(string) {
      vm.challanForm.bill_to = string;
      vm.challanTos = [];
    };

    if ($state.params.challanId) {
      vm.challanForm = {
        _id: challanResolve[0]._id,
        bill_date: challanResolve[0].bill_date,
        bill_no: challanResolve[0].bill_no,
        bill_to: challanResolve[0].bill_to,
        consignor: challanResolve[0].consignor,
        consignee: challanResolve[0].consignee,
        details: challanResolve[0].details,
        ref_no: challanResolve[0].ref_no,
        ref_date: challanResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      angular.element(abc).val(challanResolve[0].bill_no);
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
