(function() {
  "use strict";

  angular
    .module("billPayments")
    .controller("BillPaymentsListController", BillPaymentsListController);

  BillPaymentsListController.$inject = [
    "$scope",
    "$state",
    "$window",
    "BillPaymentsService",
    "Authentication",
    "Notification",
    "$timeout",
    "$http",
    "NgTableParams"
  ];

  function BillPaymentsListController(
    $scope,
    $state,
    $window,
    BillPaymentsService,
    Authentication,
    Notification,
    $timeout,
    $http,
    NgTableParams
  ) {
    var vm = this;
    var self = this;
    vm.isLoading = 0;

    BillPaymentsService.getPrimaryDetails().$promise.then(function(response) {
      vm.allClients = response.data.consignor;
      vm.allsClients = response.data.consignee;
      vm.allBillPaymentTos = response.data.bill_to;
      vm.isLoading++;
    });

    vm.generateTable = function() {
      self.tableParams = new NgTableParams(
        {
          page: vm.currentPage,
          count: vm.itemsPerPage,
          sorting: vm.sortBy,
          isSortBy: vm.sortBy,
          orderBy: vm.orderBy
        },
        {
          total: 0,
          getData: function($defer, params) {
            var ob = $defer.orderBy();
            var st = $defer.sorting();
            var param = {
              orderBy: ob.length > 1 ? vm.orderBy : ob[0].substring(1),
              sortBy: (typeof st == 'string') ? st : st[Object.keys(st)[0]],
              countFrom: ($defer.page() - 1) * $defer.count(),
              paginationNumber: $defer.count(),
              params: vm.search
            };
            return BillPaymentsService.filteredBillPayments(param).$promise.then(
              function(response) {
                vm.billPayments = response.data;
                vm.totalCount = response.count;
                $defer.total(vm.totalCount);
                return vm.billPayments;
              }
            );
          }
        }
      );
    };

    vm.searches = function() {
      vm.generateTable();
    };

    vm.reset = function() {
      vm.search = {
        bill_from: "",
        bill_to: "",
        bill_number: "",
        consignor: "",
        consignee: "",
        bill_to_address: ""
      };
      vm.bill_from = { isOpened: false };
      vm.bill_to = { isOpened: false };
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.orderBy = "created";
      vm.sortBy = "desc";
      vm.generateTable();
      vm.isLoading++;
    };
    vm.reset();

    vm.gotoNewBillPayment = function() {
      $state.go("billPayments.create");
    };

    vm.selectDate = function($event, num) {
      if (num == 1) {
        vm.bill_from.isOpened = true;
      }
      if (num == 2) {
        vm.bill_to.isOpened = true;
      }
    };

    vm.deleteBillPayment = function(id) {
      var r = confirm(
        "Are you sure you want to delete this? This action cannot be undone!"
      );
      if (r == true) {
        $http.delete("/api/billPayments/" + id).then(function(response) {
          if (response.status == 200) {
            Notification.success({
              message:
                '<i class="glyphicon glyphicon-ok"></i> BillPayment deleted successfully!'
            });
            $state.reload();
          } else {
            Notification.error({
              message: res.data.message,
              title:
                '<i class="glyphicon glyphicon-remove"></i> BillPayment deletion error!'
            });
          }
        });
      } else {
      }
    };

    vm.convertToFloat = function(stri) {
      if (stri == null || stri == undefined) return 0;
      return parseFloat(stri);
    };

    vm.calculateTotal = function(book) {
      var total = 0;
      for (var i = 0; i < book.length; i++) {
        total += vm.convertToFloat(book[i].amount);
        for (var k = 0; k < book[i].extras.length; k++) {
          total += vm.convertToFloat(book[i].extras[k].extra_value);
        }
      }
      return total;
    };

    vm.download = function(billPaymentId) {
      // BillPaymentsService.downloads(billPaymentId)
      // .then(function (res) {
      // var file = new Blob([res], { type: 'application/pdf' });
      var fileurl = "/api/downloads/" + billPaymentId;
      window.open(fileurl, "_blank", "");
      $window.open("localhost:xxx/api/document", "_blank");
      // Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> BillPayment saved successfully!' });
      // })
      // .catch(function (res) {
      // Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> BillPayment save error!' });
      // });
    };

    vm.sortTable = function(n) {
      var table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
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
        for (i = 1; i < rows.length - 1; i++) {
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
              shouldSwitch = true;
              break;
            }
          } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
              //if so, mark as a switch and break the loop:
              shouldSwitch = true;
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
          switchcount++;
        } else {
          /*If no switching has been done AND the direction is "asc",
          set the direction to "desc" and run the while loop again.*/
          if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
          }
        }
      }
    };
  }
})();
