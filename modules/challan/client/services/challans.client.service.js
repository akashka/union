(function() {
  "use strict";

  angular
    .module("challans.services")
    .factory("ChallansService", ChallansService);

  ChallansService.$inject = ["$resource", "$log"];

  function ChallansService($resource, $log) {
    var Challan = $resource(
      "/api/challans",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/challans",
          params: {
            provider: "@provider"
          }
        },
        saveChallan: {
          method: "POST",
          url: "/api/challans"
        },
        getChallanDetail: {
          method: "POST",
          url: "/api/getChallanDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(challan) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Challan, {
      createOrUpdate: function(challan) {
        if (challan._id) {
          return this.update(challan).$promise;
        } else {
          return this.saveChallan(challan).$promise;
        }
      },
      getChallanDetails: function(params) {
        var body = {
          params: params
        };
        return this.getChallanDetail(body);
      }
    });

    return Challan;

    function createOrUpdate(challan) {
      if (challan._id) {
        return this.update(challan).$promise;
      } else {
        return this.saveChallan(challan).$promise;
      }

      // Handle successful response
      function onSuccess(challan) {
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
