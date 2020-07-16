(function() {
  "use strict";

  angular
    .module("challans")
    .controller("ChallansAdminEditController", ChallansAdminEditController);

  ChallansAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ChallansService",
    "Authentication",
    "Notification"
  ];

  function ChallansAdminEditController(
    $scope,
    $state,
    $window,
    ChallansService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    ChallansService.getChallanDetails($state.params.challanId).$promise.then(
      function(response) {
        vm.challan = response;
        // vm.challan.bill_no = vm.challan.bill_no + "A";
        // vm.challan.co_copy = true;
        vm.challan.bill_date = new Date(moment(vm.challan.bill_date));
        vm.challan.ref_date = new Date(moment(vm.challan.ref_date));
        for (var i = 0; i < vm.challan.details.length; i++) {
          vm.challan.details[i].gc_date = new Date(
            moment(vm.challan.details[i].gc_date)
          );
        }
        vm.details = vm.challan.details;
        vm.isLoading++;
      }
    );

    ChallansService.getPrimaryDetails().$promise.then(function(response) {
      vm.allChallans = response.data;
      vm.isLoading++;
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
    vm.save = function() {
      vm.challan.details = vm.details;

      // Create a new challan, or update the current instance
      ChallansService
        .createOrUpdate(vm.challan)
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

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.challanCompleted = false;

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
      if (vm.challan.bill_no != undefined && vm.challan.bill_no != "") {
        vm.duplicateBillNumber = vm.allChallans.bill_no.includes(
          vm.challan.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.challan.ref_no != undefined && vm.challan.ref_no != "") {
        vm.duplicateRefNumber = vm.allChallans.ref_no.includes(
          vm.challan.ref_no.toString()
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
