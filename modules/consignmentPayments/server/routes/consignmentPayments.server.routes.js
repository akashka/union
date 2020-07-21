"use strict";

/**
 * Module dependencies
 */
var consignmentPaymentsPolicy = require("../policies/consignmentPayments.server.policy"),
  consignmentPayments = require("../controllers/consignmentPayments.server.controller");

module.exports = function(app) {
  // ConsignmentPayments collection routes
  app
    .route("/api/consignmentPayments")
    .all(consignmentPaymentsPolicy.isAllowed)
    .get(consignmentPayments.list)
    .put(consignmentPayments.update)
    .post(consignmentPayments.create);

  // Single consignmentPayment routes
  app
    .route("/api/consignmentPayments/:consignmentPaymentId")
    .all(consignmentPaymentsPolicy.isAllowed)
    .get(consignmentPayments.read)
    .put(consignmentPayments.update)
    .delete(consignmentPayments.delete);

  // Finish by binding the consignmentPayment middleware
  // app.param('consignmentPaymentId', consignmentPayments.consignmentPaymentByID);
};
