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
    vm.allStates = [
      'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
      'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
      'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadeep', 
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Orissa', 'Puducherry', 
      'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telagana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 
      'West Bengal'
    ];

    consignment.getConsignmentDetails().$promise.then(function(response) {
      vm.isLoading++;
      vm.allConsignments = response.data;
      // vm.consignmentForm.bill_no = Number(vm.allConsignments.latest_bill_no) + 1;
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

    vm.reset = function() {
      vm.consignmentForm = {
        consignmentNo: "",
        consignmentDate: new Date(),
        consignor: {
          name: '',
          state: '',
          gstno: ''
        },
        consignee: {
          name: '',
          state: '',
          gstno: ''
        },
        invoiceNo: '',
        from: '',
        to: '',
        noOfPkgs: '',
        tobBat: '',
        consignmentType: '',
        acWtInKgs: '',
        chWtInKgs: '',
        baWtInKgs: '',
        billing: {
          code: '',
          state: '',
          gstNo: '',
        },
        loadType: '',
        serviceTaxPayableBy: '',
        freight: '',
        exCharges: '',
        matValue: '',
        wCnyN: '',
        material: '',
        dcNo: '',
        custCode: '',
        totFrieght: '',
        serviceTax: '',
        educationCess: '',
        remarks: '',
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
      consignmentDate: { isOpened: false },
    };

    vm.gc_date = {
      0: { isOpened: false }
    };

    // 
    vm.duplicateConsignmentNumber = false;
    vm.onConsignmentNumberChange = function() {
      // if (vm.consignmentForm.bill_no != undefined && vm.consignmentForm.bill_no != "") {
      //   vm.duplicateBillNumber = vm.allConsignments.bill_no.includes(
      //     vm.consignmentForm.bill_no.toString()
      //   );
      // }
    };

    vm.duplicateInvoiceNo = false;
    vm.onInvoiceNoChange = function() {

    }

    vm.onConsignorNameChange = function(consignment_name) {
      var result = "";
      var result1 = "";
      var isFound = false;
      for (var i = 0; i < vm.allConsignments.length; i++) {
        if (
          vm.allConsignments[i].consignor.name.toUpperCase() ==
          consignment_name.toUpperCase()
        ) {
          isFound = true;
          result = vm.allConsignments[i].consignor.gstno;
          result1 = vm.allConsignments[i].consignor.state;
        }
      }
      if (isFound == false) {
        for (var i = 0; i < vm.allConsignments.length; i++) {
          if (
            vm.allConsignments[i].consignee.name.toUpperCase() ==
            consignment_name.toUpperCase()
          ) {
            isFound = true;
            result = vm.allConsignments[i].consignee.gstno;
            result1 = vm.allConsignments[i].consignee.state;
          }
        }
      }
      if (isFound) {
        vm.consignmentForm.consignor.gstno = result;
        vm.consignmentForm.consignor.state = result1;
      }
    };

    vm.onConsigneeNameChange = function(consignment_name) {
      var result = "";
      var result1 = "";
      var isFound = false;
      for (var i = 0; i < vm.allConsignments.length; i++) {
        if (
          vm.allConsignments[i].consignee.name.toUpperCase() ==
          consignment_name.toUpperCase()
        ) {
          result = vm.allConsignments[i].consignee.gstno;
          result1 = vm.allConsignments[i].consignee.state;
          isFound = true;
        }
      }
      if (!isFound) {
        for (var i = 0; i < vm.allConsignments.length; i++) {
          if (
            vm.allConsignments[i].consignor.name.toUpperCase() ==
            consignment_name.toUpperCase()
          ) {
            result = vm.allConsignments[i].consignor.gstno;
            result1 = vm.allConsignments[i].consignor.state;
            isFound = true;
          }
        }
      }
      if (isFound) {
        vm.consignmentForm.consignee.gstno = result;
        vm.consignmentForm.consignee.state = result1;
      }
    };

    vm.clients = [];
    vm.allsClients = [];
    vm.allqClients = [];
    vm.sclients = [];
    vm.qclients = [];
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
      vm.consignmentForm.consignor.gstno = string.gstno;
      vm.consignmentForm.consignor.state = string.state;
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
      vm.consignmentForm.consignee.gstno = string.gstno;
      vm.consignmentForm.consignee.state = string.state;
      vm.sclients = [];
    };
    
    vm.qcomplete = function(selectedClient) {
      vm.qclients = [];
      var output = [];
      angular.forEach(vm.allConsignments.biller, function(clts) {
        if (
          clts.name.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0
        ) {
          output.push(clts);
        }
      });
      vm.qclients = output.length > 10 ? output.splice(1, 10) : output;
    };

    vm.qfillTextbox = function(string) {
      vm.consignmentForm.biller.name = string.name;
      vm.consignmentForm.biller.gstno = string.gstno;
      vm.consignmentForm.biller.state = string.state;
      vm.sclients = [];
    };

    // vm.tcomplete = function(selectedClient) {
    //   var output = [];
    //   vm.consignmentTos = [];
    //   angular.forEach(vm.allConsignments.bill_to, function(clts) {
    //     if (clts.toLowerCase().indexOf(selectedClient.toLowerCase()) >= 0) {
    //       output.push(clts);
    //     }
    //   });
    //   vm.consignmentTos = output.length > 10 ? output.splice(1, 10) : output;
    // };

    // vm.tfillTextbox = function(string) {
    //   vm.consignmentForm.bill_to = string;
    //   vm.consignmentTos = [];
    // };

    if ($state.params.consignmentId) {
      vm.consignmentForm = {
        consignmentNo: consignmentResolve[0].consignmentNo,
        consignmentDate: consignmentResolve[0].consignmentDate,
        consignor: consignmentResolve[0].consignor,
        consignee: consignmentResolve[0].consignee,
        invoiceNo: consignmentResolve[0].invoiceNo,
        from: consignmentResolve[0].from,
        to: consignmentResolve[0].to,
        noOfPkgs: consignmentResolve[0].noOfPkgs,
        tobBat: consignmentResolve[0].tobBat,
        consignmentType: consignmentResolve[0].consignmentType,
        acWtInKgs: consignmentResolve[0].acWtInKgs,
        chWtInKgs: consignmentResolve[0].chWtInKgs,
        baWtInKgs: consignmentResolve[0].baWtInKgs,
        billing: consignmentResolve[0].billing,
        loadType: consignmentResolve[0].loadType,
        serviceTaxPayableBy: consignmentResolve[0].serviceTaxPayableBy,
        freight: consignmentResolve[0].freight,
        exCharges: consignmentResolve[0].exCharges,
        matValue: consignmentResolve[0].matValue,
        wCnyN: consignmentResolve[0].wCnyN,
        material: consignmentResolve[0].material,
        dcNo: consignmentResolve[0].dcNo,
        custCode: consignmentResolve[0].custCode,
        totFrieght: consignmentResolve[0].totFrieght,
        serviceTax: consignmentResolve[0].serviceTax,
        educationCess: consignmentResolve[0].educationCess,
        remarks: consignmentResolve[0].remarks,
        _id: consignmentResolve[0]._id,        
      };
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

