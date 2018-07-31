(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsListController', BookingsListController);

  BookingsListController.$inject = ['$scope', '$state', '$window', 'BookingsService', 'Authentication', 'Notification', '$timeout'];

  function BookingsListController($scope, $state, $window, BookingsService, Authentication, Notification, $timeout) {
    var vm = this;

    vm.bookings = BookingsService.query();
    vm.allBookings = BookingsService.query();

    vm.allClients = [];
    vm.allsClients = [];
    vm.allBookingTos = [];

    vm.search = {
      bill_from: "",
      bill_to: "",
      bill_number: "",
      consignor: '',
      consignee: '',
      bill_to_address: ''
    }

    vm.searches = function() {
      vm.bookings = [];
      var bookings = vm.allBookings;
      for(var i = 0; i < bookings.length; i++) {
        if(vm.search.bill_number != "" && vm.search.bill_number == bookings[i].bill_no)
          vm.bookings.push(bookings[i]);
        else if(vm.search.bill_from != "" && moment(vm.search.bill_from) <= moment(bookings[i].bill_date))
          vm.bookings.push(bookings[i]);
        else if(vm.search.bill_to != undefined && moment(vm.search.bill_to) >= moment(bookings[i].bill_date))
          vm.bookings.push(bookings[i]);
        else if(vm.search.bill_to_address != '' && vm.search.bill_to_address == bookings[i].bill_to)
          vm.bookings.push(bookings[i]);
        else if(vm.search.consignee != '' && vm.search.consignee == bookings[i].consignee.name)
          vm.bookings.push(bookings[i]);
        else if(vm.search.consignor != '' && vm.search.consignor == bookings[i].consignor.name)
          vm.bookings.push(bookings[i]);
      }        
    }

    vm.reset = function() {
      vm.bookings = vm.allBookings;
      vm.search = {
        bill_from: "",
        bill_to: "",
        bill_number: "",
        consignor: '',
        consignee: '',
        bill_to_address: ''
      };
      vm.bill_from = {isOpened: false};
      vm.bill_to = {isOpened: false}; 
    }

    vm.gotoNewBooking = function() {
        $state.go('bookings.create');
    }

    vm.bill_from = {isOpened: false};
    vm.bill_to = {isOpened: false}; 

    vm.selectDate = function($event, num) {
      if(num == 1) { vm.bill_from.isOpened = true; }
      if(num == 2) { vm.bill_to.isOpened = true; }
    };
    
    vm.buildPager = function() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    
    vm.figureOutItemsToDisplay = function() {
      vm.filteredItems = vm.bookings;
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    vm.pageChanged = function() {
      vm.figureOutItemsToDisplay();
    }

    vm.buildPager();

    vm.convertToFloat = function(stri) {
      if(stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    }

    vm.calculateTotal = function(book) {
      var total = 0;
      for(var i = 0; i < book.length; i++) {
        total += vm.convertToFloat(book[i].amount);
        for(var k=0; k<book[i].extras.length; k++) {
          total += vm.convertToFloat(book[i].extras[k].extra_value);          
        }
      }
      return total;
    }

    vm.download = function(bookingId) {
      // BookingsService.downloads(bookingId)
        // .then(function (res) {
            // var file = new Blob([res], { type: 'application/pdf' });
            var fileurl = "/api/downloads/" + bookingId;
            window.open(fileurl, '_blank', '');
            $window.open('localhost:xxx/api/document', '_blank');
            // Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!' });
        // })
        // .catch(function (res) {
            // Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Booking save error!' });
        // });
    }

    vm.sortTable = function(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("myTable2");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc"; 
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            }
            }
            if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
            } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
            }
        }
    }

    vm.makeCopy= function(bookingId) {
      
    }

    $timeout(function () {
      for(var i=0; i<vm.allBookings.length; i++) {
        var isFound = false;
        var issFound = false;
        var istFound = false;
        for(var j=0; j<vm.allClients.length; j++) {
          if(vm.allClients[j].name.toUpperCase() == vm.allBookings[i].consignor.name.toUpperCase()) isFound = true;
          if(vm.allsClients[j].name.toUpperCase() == vm.allBookings[i].consignee.name.toUpperCase()) issFound = true;
          if(vm.allBookingTos[j].toUpperCase() == vm.allBookings[i].bill_to.toUpperCase()) istFound = true;
        }
        if(!isFound) vm.allClients.push(vm.allBookings[i].consignor);
        if(!issFound) vm.allsClients.push(vm.allBookings[i].consignee);
        if(!istFound) vm.allBookingTos.push(vm.allBookings[i].bill_to);
      }
    }, 1000);

  }
}());
