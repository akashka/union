(function () {
  'use strict';

  angular
    .module('bookings.services')
    .factory('BookingsService', BookingsService);

  BookingsService.$inject = ['$resource', '$log'];

  function BookingsService($resource, $log) {
    var Booking = $resource('/api/bookings', {}, {
      update: {
        method: 'PUT',
        url: '/api/bookings',
        params: {
          provider: '@provider'
        }
      },
      saveBooking: {
        method: 'POST',
        url: '/api/bookings'
      },
      download: {
        method: 'POST',
        url: '/api/downloads'
      },
      filteredBooking: {
        method: 'POST',
        url: '/api/filteredBookings'
      },
      getPrimaryDetail: {
        method: 'GET',
        url: '/api/getPrimaryDetails'
      },
      getHomePageDatas: {
        method: 'GET',
        url: '/api/getHomePageData'
      },
      getClientGraphDatas: {
        method: 'GET',
        url: '/api/getClientGraphData'
      },
      getMonthGraphDatas: {
        method: 'GET',
        url: '/api/getMonthGraphData'
      },
      getBookingDetail: {
        method: 'POST',
        url: '/api/getBookingDetails'
      }
    });

    // Handle successful response
    function onSuccess(booking) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Booking, {
      createOrUpdate: function (booking) {
        if (booking._id) {
          return this.update(booking).$promise;
        } else {
          return this.saveBooking(booking).$promise;
        }
      },
      downloads: function(bookingId) {
        var params = {"bookingId": bookingId};
        return this.download(params).$promise;
      },
      filteredBookings: function (params) {
        return this.filteredBooking(params);
      },
      getPrimaryDetails: function() {
        return this.getPrimaryDetail();
      },
      getHomePageData: function() {
        return this.getHomePageDatas();
      },
      getClientGraphData: function() {
        return this.getClientGraphDatas();
      },
      getMonthGraphData: function() {
        return this.getMonthGraphDatas();
      },
      getBookingDetails: function(params) {
        var body = {
          params: params
        };
        return this.getBookingDetail(body);
      }
    });

    return Booking;

    function createOrUpdate(booking) {
      if (booking._id) {
        return this.update(booking).$promise;
      } else {
        return this.saveBooking(booking).$promise;
      }

      // Handle successful response
      function onSuccess(booking) {
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
}());
