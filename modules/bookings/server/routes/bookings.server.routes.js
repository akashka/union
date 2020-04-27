'use strict';

/**
 * Module dependencies
 */
var bookingsPolicy = require('../policies/bookings.server.policy'),
  bookings = require('../controllers/bookings.server.controller');

module.exports = function (app) {
  // Bookings collection routes
  app.route('/api/bookings').all(bookingsPolicy.isAllowed)
    .get(bookings.list)
    .put(bookings.update)    
    .post(bookings.create);

  app.route('/api/downloads/:bookingId')
    .get(bookings.downloadByID);

  // Single booking routes
  app.route('/api/bookings/:bookingId').all(bookingsPolicy.isAllowed)
    .get(bookings.read)
    .put(bookings.update)
    .delete(bookings.delete);

  app.route('/api/filteredBookings').all(bookingsPolicy.isAllowed)
    .post(bookings.filteredBookings);

  app.route('/api/getPrimaryDetails').all(bookingsPolicy.isAllowed)
    .get(bookings.getPrimaryDetails);

  app.route('/api/getHomePageData').all(bookingsPolicy.isAllowed)
    .get(bookings.getHomePageData);

  app.route('/api/getClientGraphData').all(bookingsPolicy.isAllowed)
    .get(bookings.getClientGraphData);

  app.route('/api/getMonthGraphData').all(bookingsPolicy.isAllowed)
    .get(bookings.getMonthGraphData);

  app.route('/api/getBookingDetails').all(bookingsPolicy.isAllowed)
    .post(bookings.getBookingDetails)

    // Finish by binding the booking middleware
  // app.param('bookingId', bookings.bookingByID);
};
