(function() {
  "use strict";

  angular
    .module("consignmentPayments.services")
    .factory("ConsignmentPaymentsService", ConsignmentPaymentsService);

  ConsignmentPaymentsService.$inject = ["$resource", "$log"];

  function ConsignmentPaymentsService($resource, $log) {
    var ConsignmentPayment = $resource(
      "/api/consignmentPayments",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/consignmentPayments",
          params: {
            provider: "@provider"
          }
        },
        saveConsignmentPayment: {
          method: "POST",
          url: "/api/consignmentPayments"
        },
        getConsignmentPaymentDetail: {
          method: "POST",
          url: "/api/getConsignmentPaymentDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(consignmentPayment) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(ConsignmentPayment, {
      createOrUpdate: function(consignmentPayment) {
        if (consignmentPayment._id) {
          return this.update(consignmentPayment).$promise;
        } else {
          return this.saveConsignmentPayment(consignmentPayment).$promise;
        }
      },
      getConsignmentPaymentDetails: function(params) {
        var body = {
          params: params
        };
        return this.getConsignmentPaymentDetail(body);
      }
    });

    return ConsignmentPayment;

    function createOrUpdate(consignmentPayment) {
      if (consignmentPayment._id) {
        return this.update(consignmentPayment).$promise;
      } else {
        return this.saveConsignmentPayment(consignmentPayment).$promise;
      }

      // Handle successful response
      function onSuccess(consignmentPayment) {
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
