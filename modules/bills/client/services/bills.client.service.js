(function() {
  "use strict";

  angular
    .module("bills.services")
    .factory("BillsService", BillsService);

  BillsService.$inject = ["$resource", "$log"];

  function BillsService($resource, $log) {
    var Bill = $resource(
      "/api/bills",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/bills",
          params: {
            provider: "@provider"
          }
        },
        saveBill: {
          method: "POST",
          url: "/api/bills"
        },
        getBillDetail: {
          method: "POST",
          url: "/api/getBillDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(bill) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Bill, {
      createOrUpdate: function(bill) {
        if (bill._id) {
          return this.update(bill).$promise;
        } else {
          return this.saveBill(bill).$promise;
        }
      },
      getBillDetails: function(params) {
        var body = {
          params: params
        };
        return this.getBillDetail(body);
      }
    });

    return Bill;

    function createOrUpdate(bill) {
      if (bill._id) {
        return this.update(bill).$promise;
      } else {
        return this.saveBill(bill).$promise;
      }

      // Handle successful response
      function onSuccess(bill) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
})();
