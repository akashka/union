"use strict";

/**
 * Module dependencies
 */
var onAccountPaymentsPolicy = require("../policies/onAccountPayments.server.policy"),
    onAccountPayments = require("../controllers/onAccountPayments.server.controller");

module.exports = function(app) {
    // OnAccountPayments collection routes
    app
        .route("/api/onAccountPayments")
        .all(onAccountPaymentsPolicy.isAllowed)
        .get(onAccountPayments.list)
        .put(onAccountPayments.update)
        .post(onAccountPayments.create);

    // Single onAccountPayment routes
    app
        .route("/api/onAccountPayments/:onAccountPaymentId")
        .all(onAccountPaymentsPolicy.isAllowed)
        .get(onAccountPayments.read)
        .put(onAccountPayments.update)
        .delete(onAccountPayments.delete);

    // Finish by binding the onAccountPayment middleware
    // app.param('onAccountPaymentId', onAccountPayments.onAccountPaymentByID);
};