(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsAdminController', BookingsAdminController);

  BookingsAdminController.$inject = ['$scope', '$state', '$window', 'BookingsService', 'Authentication', 'Notification', 'bookingResolve', '$timeout'];

  function BookingsAdminController($scope, $state, $window, booking, Authentication, Notification, bookingResolve, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.bookings = angular.toJson(booking);
    vm.allBookings = booking.query();

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

    // Remove existing Booking
    vm.remove = function() {
      if ($window.confirm('Are you sure you want to delete?')) {
        booking.$remove(function () {
          $state.go('admin.bookings.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking deleted successfully!' });
        });
      }
    }

    // Save Bookiing
    vm.save = function(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bookingForm');
        return false;
      }
      vm.bookingForm.details = vm.details;

      // Create a new booking, or update the current instance
      booking.createOrUpdate(vm.bookingForm)
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('bookings.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Booking save error!' });
      }
    }

    vm.reset = function() {
      vm.bookingForm = {
        bill_date: "",
        bill_no: "",
        bill_to: "",
        consignor: {
          name: "",
          gstin_no: "",
        },
        consignee: {
          name: "",
          gstin_no: "",
        },
        details: [],
        ref_no: "",
        ref_date: "",
        co_copy: false,
        _id: null,
      };

      vm.isError = false;
      vm.requestSubmitted = false;
      vm.bookingCompleted = false;

    };

    $timeout(function () {
      vm.bookingForm.bill_no = Number(vm.allBookings[0].bill_no) + 1;
    }, 500);
      
    vm.reset();

    vm.gotoNewBooking = function() {
         vm.reset();         
    };

    vm.selectDate = function($event, num) {
      if(num == 1) { vm.dateset.bill_date.isOpened = true; }
      if(num == 2) { vm.dateset.ref_date.isOpened = true; }
    };

    vm.selectRowDate = function($event, i) {
       vm.gc_date[i].isOpened = true;
    };

    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
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

    vm.details = [{
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
    }];

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
      vm.gc_date[vm.details.length-1] = { isOpened: false };
    }

    vm.deleteRow = function(ind) {
      vm.details.splice(ind, 1);
    }

    vm.addExtra = function(index) {
      if(vm.details[index].extras == undefined) vm.details[index].extras = [];
      vm.details[index].extras.push({
          extra_name: "",
          extra_value: "0"
      });
    }

    vm.removeExtra = function(index) {
      vm.details[index].extras.splice(vm.details[index].extras.length-1, 1);
    }

    vm.duplicateBillNumber = false;
    vm.onBillNumberChange = function() {
      vm.duplicateBillNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].bill_no == vm.bookingForm.bill_no) vm.duplicateBillNumber = true;
      }
    }

    vm.duplicateRefNumber = false;
    vm.onRefNumberChange = function() {
      vm.duplicateRefNumber = false;
      for(var a = 0; a < vm.allBookings.length; a++) {
        if(vm.allBookings[a].ref_no == vm.bookingForm.ref_no) vm.duplicateRefNumber = true;
      }
    }

    vm.onConsignorNameChange = function(booking_name) {
        var result = "";
        for(var i=0; i<vm.allBookings.length; i++) {
          if(vm.allBookings[i].consignor.name.toUpperCase() == booking_name.toUpperCase()) result = vm.allBookings[i].consignor.gstin_no;
        }
        if(result == ""){
          for(var i=0; i<vm.allBookings.length; i++) {
            if(vm.allBookings[i].consignee.name.toUpperCase() == booking_name.toUpperCase()) result = vm.allBookings[i].consignee.gstin_no;
          }
        }
        vm.bookingForm.consignor.gstin_no = result;
    }

    vm.onConsigneeNameChange = function(booking_name) {
        var result = "";
        for(var i=0; i<vm.allBookings.length; i++) {
          if(vm.allBookings[i].consignee.name.toUpperCase() == booking_name.toUpperCase()) result = vm.allBookings[i].consignee.gstin_no;
        }
        if(result == ""){
          for(var i=0; i<vm.allBookings.length; i++) {
            if(vm.allBookings[i].consignor.name.toUpperCase() == booking_name.toUpperCase()) result = vm.allBookings[i].consignor.gstin_no;
          }
        }
        vm.bookingForm.consignee.gstin_no = result;
    }

    vm.allClients = [];
    vm.clients = [];
    vm.allsClients = [];
    vm.sclients = [];
    vm.allBookingTos = [];
    vm.bookingTos = [];

    $timeout(function () {
      for(var i=0; i<vm.allBookings.length; i++) {
        var isFound = false;
        for(var j=0; j<vm.allClients.length; j++) {
          if(vm.allClients[j].name.toUpperCase() == vm.allBookings[i].consignor.name.toUpperCase()) isFound = true;
        }
        if(!isFound) vm.allClients.push(vm.allBookings[i].consignor);
        var issFound = false;
        for(var j=0; j<vm.allsClients.length; j++) {
          if(vm.allsClients[j].name.toUpperCase() == vm.allBookings[i].consignee.name.toUpperCase()) isFound = true;
        }
        if(!isFound) vm.allsClients.push(vm.allBookings[i].consignee);
        var istFound = false;
        for(var j=0; j<vm.allBookingTos.length; j++) {
          if(vm.allBookingTos[j].toUpperCase() == vm.allBookings[i].bill_to.toUpperCase()) istFound = true;
        }
        if(!istFound) vm.allBookingTos.push(vm.allBookings[i].bill_to);
      }
    }, 500);

    vm.complete = function(selectedClient) {
      vm.clientbookings = [];
			var output=[];
			angular.forEach(vm.allClients,function(clts){
				if(clts.name.toLowerCase().indexOf(selectedClient.toLowerCase())>=0){
					output.push(clts);
				}
			});
			vm.clients=output;
    }
    
		vm.fillTextbox=function(string){
			vm.bookingForm.consignor.name=string.name;
      vm.bookingForm.consignor.gstin_no=string.gstin_no;
      vm.clients=[];
    }

    vm.scomplete = function(selectedClient) {
      vm.clientbookings = [];
			var output=[];
			angular.forEach(vm.allsClients,function(clts){
				if(clts.name.toLowerCase().indexOf(selectedClient.toLowerCase())>=0){
					output.push(clts);
				}
			});
			vm.sclients=output;
    }
    
		vm.sfillTextbox=function(string){
			vm.bookingForm.consignee.name=string.name;
      vm.bookingForm.consignee.gstin_no=string.gstin_no;
      vm.sclients=[];
    }

    vm.tcomplete = function(selectedClient) {
			var output=[];
			angular.forEach(vm.allBookingTos,function(clts){
				if(clts.toLowerCase().indexOf(selectedClient.toLowerCase())>=0){
					output.push(clts);
				}
			});
			vm.bookingTos=output;
    }
    
		vm.tfillTextbox=function(string){
			vm.bookingForm.bill_to=string;
      vm.bookingTos=[];
    }

    if($state.params.bookingId) {
      vm.bookingForm = {
        _id: bookingResolve[0]._id,
        bill_date: bookingResolve[0].bill_date,
        bill_no: bookingResolve[0].bill_no,
        bill_to: bookingResolve[0].bill_to,
        consignor: bookingResolve[0].consignor,
        consignee: bookingResolve[0].consignee,
        details: bookingResolve[0].details,
        ref_no: bookingResolve[0].ref_no,
        ref_date: bookingResolve[0].ref_date
      };
      var abc = document.getElementById("bill_no");
      console.log(bookingResolve[0].bill_no);
      angular.element(abc).val(bookingResolve[0].bill_no);
      console.log(angular.element(abc));
      // angular.element($()).val().trigger('change');
    }

    $('input[type="text"]').keyup(function(e) {
        if(e.keyCode == 13) {
            $(this).next().focus();
        }
    });


  }
}());
