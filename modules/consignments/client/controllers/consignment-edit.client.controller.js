(function() {
  "use strict";

  angular
    .module("consignments")
    .controller(
      "ConsignmentsAdminEditController",
      ConsignmentsAdminEditController
    );

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
    Consignment,
    Authentication,
    Notification
  ) {
    var vm = this;
    vm.authentication = Authentication;
    vm.isLoading = 0;
    vm.allStates = [
      "Andaman and Nicobar Islands",
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chandigarh",
      "Chhattisgarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Delhi",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Ladakh",
      "Lakshadeep",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Orissa",
      "Puducherry",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telagana",
      "Tripura",
      "Uttarakhand",
      "Uttar Pradesh",
      "West Bengal"
    ];

    Consignment.getConsignmentDetails(
      $state.params.consignmentId
    ).$promise.then(function(response) {
      vm.consignmentForm = response;
      vm.isLoading++;
      vm.consignmentForm.consignmentDate = new Date(
        moment(vm.consignmentForm.consignmentDate)
      );
    });

    Consignment.filteredConsignments().$promise.then(function(response) {
      vm.isLoading++;
      vm.allConsignments = response.data;
      vm.consignmentForm.bill_no =
        Number(vm.allConsignments.latest_bill_no) + 1;
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
        $scope.$broadcast(
          "show-errors-check-validity",
          "vm.form.consignmentForm"
        );
        return false;
      }
      // vm.consignmentForm.details = vm.details;

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

    vm.gotoNewConsignment = function() {
      vm.reset();
    };

    vm.selectRowDate = function($event, i) {
      vm.gc_date[i].isOpened = true;
    };

    //
    vm.selectDate = function($event, num) {
      if (num == 1) {
        vm.dateset.consignmentDate.isOpened = true;
      }
    };

    //
    vm.dateOptions = {
      formatYear: "yy",
      maxDate: new Date(2030, 5, 22),
      minDate: new Date(1920, 5, 22),
      startingDay: 1
    };

    //
    vm.dateset = {
      consignmentDate: { isOpened: false }
    };

    vm.gc_date = {
      0: { isOpened: false }
    };
  }
})();
