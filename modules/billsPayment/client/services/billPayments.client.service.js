(function() {
  "use strict";

  angular
    .module("billPayments.services")
    .factory("BillPaymentsService", BillPaymentsService);

  BillPaymentsService.$inject = ["$resource", "$log"];

  function BillPaymentsService($resource, $log) {
    var BillPayment = $resource(
      "/api/billPayments",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/billPayments",
          params: {
            provider: "@provider"
          }
        },
        saveBillPayment: {
          method: "POST",
          url: "/api/billPayments"
        },
        getBillPaymentDetail: {
          method: "POST",
          url: "/api/getBillPaymentDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(billPayment) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(BillPayment, {
      createOrUpdate: function(billPayment) {
        if (billPayment._id) {
          return this.update(billPayment).$promise;
        } else {
          return this.saveBillPayment(billPayment).$promise;
        }
      },
      getBillPaymentDetails: function(params) {
        var body = {
          params: params
        };
        return this.getBillPaymentDetail(body);
      }
    });

    return BillPayment;

    function createOrUpdate(billPayment) {
      if (billPayment._id) {
        return this.update(billPayment).$promise;
      } else {
        return this.saveBillPayment(billPayment).$promise;
      }

      // Handle successful response
      function onSuccess(billPayment) {
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
