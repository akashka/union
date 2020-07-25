(function() {
  "use strict";

  angular
    .module("onAccountPayments.services")
    .factory("OnAccountPaymentsService", OnAccountPaymentsService);

  OnAccountPaymentsService.$inject = ["$resource", "$log"];

  function OnAccountPaymentsService($resource, $log) {
    var OnAccountPayment = $resource(
      "/api/onAccountPayments",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/onAccountPayments",
          params: {
            provider: "@provider"
          }
        },
        saveOnAccountPayment: {
          method: "POST",
          url: "/api/onAccountPayments"
        },
        getOnAccountPaymentDetail: {
          method: "POST",
          url: "/api/getOnAccountPaymentDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(onAccountPayment) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(OnAccountPayment, {
      createOrUpdate: function(onAccountPayment) {
        if (onAccountPayment._id) {
          return this.update(onAccountPayment).$promise;
        } else {
          return this.saveOnAccountPayment(onAccountPayment).$promise;
        }
      },
      getOnAccountPaymentDetails: function(params) {
        var body = {
          params: params
        };
        return this.getOnAccountPaymentDetail(body);
      }
    });

    return OnAccountPayment;

    function createOrUpdate(onAccountPayment) {
      if (onAccountPayment._id) {
        return this.update(onAccountPayment).$promise;
      } else {
        return this.saveOnAccountPayment(onAccountPayment).$promise;
      }

      // Handle successful response
      function onSuccess(onAccountPayment) {
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
