"use strict";

/**
 * Module dependencies
 */
var billPaymentsPolicy = require("../policies/billPayments.server.policy"),
  billPayments = require("../controllers/billPayments.server.controller");

module.exports = function(app) {
  // BillPayments collection routes
  app
    .route("/api/billPayments")
    .all(billPaymentsPolicy.isAllowed)
    .get(billPayments.list)
    .put(billPayments.update)
    .post(billPayments.create);

  // Single billPayment routes
  app
    .route("/api/billPayments/:billPaymentId")
    .all(billPaymentsPolicy.isAllowed)
    .get(billPayments.read)
    .put(billPayments.update)
    .delete(billPayments.delete);

  // Finish by binding the billPayment middleware
  // app.param('billPaymentId', billPayments.billPaymentByID);
};
