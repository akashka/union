(function() {
  "use strict";

  angular
    .module("consignments.services")
    .factory("ConsignmentsService", ConsignmentsService);

  ConsignmentsService.$inject = ["$resource", "$log"];

  function ConsignmentsService($resource, $log) {
    var Consignment = $resource(
      "/api/consignments",
      {},
      {
        update: {
          method: "PUT",
          url: "/api/consignments",
          params: {
            provider: "@provider"
          }
        },
        saveConsignment: {
          method: "POST",
          url: "/api/consignments"
        },
        getConsignmentDetail: {
          method: "POST",
          url: "/api/getConsignmentDetails"
        }
      }
    );

    // Handle successful response
    function onSuccess(consignment) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Consignment, {
      createOrUpdate: function(consignment) {
        if (consignment._id) {
          return this.update(consignment).$promise;
        } else {
          return this.saveConsignment(consignment).$promise;
        }
      },
      getConsignmentDetails: function(params) {
        var body = {
          params: params
        };
        return this.getConsignmentDetail(body);
      }
    });

    return Consignment;

    function createOrUpdate(consignment) {
      if (consignment._id) {
        return this.update(consignment).$promise;
      } else {
        return this.saveConsignment(consignment).$promise;
      }

      // Handle successful response
      function onSuccess(consignment) {
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
