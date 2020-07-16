(function() {
  "use strict";

  angular
    .module("consignments")
    .controller("ConsignmentsAdminEditController", ConsignmentsAdminEditController);

  ConsignmentsAdminEditController.$inject = [
    "$scope",
    "$state",
    "$window",
    "ConsignmentsService",
    "Authentication",
    "Notification"
  ];

  function ConsignmentsAdminEditController(
    $scope,
    $state,
    $window,
    ConsignmentsService,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isCoScreen = false;
    vm.isLoading = 0;

    ConsignmentsService.getConsignmentDetails($state.params.consignmentId).$promise.then(
      function(response) {
        vm.consignment = response;
        // vm.consignment.bill_no = vm.consignment.bill_no + "A";
        // vm.consignment.co_copy = true;
        vm.consignment.bill_date = new Date(moment(vm.consignment.bill_date));
        vm.consignment.ref_date = new Date(moment(vm.consignment.ref_date));
        for (var i = 0; i < vm.consignment.details.length; i++) {
          vm.consignment.details[i].gc_date = new Date(
            moment(vm.consignment.details[i].gc_date)
          );
        }
        vm.details = vm.consignment.details;
        vm.isLoading++;
      }
    );

    ConsignmentsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allConsignments = response.data;
      vm.isLoading++;
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
    vm.save = function() {
      vm.consignment.details = vm.details;

      // Create a new consignment, or update the current instance
      ConsignmentsService
        .createOrUpdate(vm.consignment)
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

    vm.isError = false;
    vm.requestSubmitted = false;
    vm.consignmentCompleted = false;

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
      if (vm.consignment.bill_no != undefined && vm.consignment.bill_no != "") {
        vm.duplicateBillNumber = vm.allConsignments.bill_no.includes(
          vm.consignment.bill_no.toString()
        );
      }
    };

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      if (vm.consignment.ref_no != undefined && vm.consignment.ref_no != "") {
        vm.duplicateRefNumber = vm.allConsignments.ref_no.includes(
          vm.consignment.ref_no.toString()
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
