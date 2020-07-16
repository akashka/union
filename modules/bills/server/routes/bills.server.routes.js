"use strict";

/**
 * Module dependencies
 */
var billsPolicy = require("../policies/bills.server.policy"),
  bills = require("../controllers/bills.server.controller");

module.exports = function(app) {
  // Bills collection routes
  app
    .route("/api/bills")
    .all(billsPolicy.isAllowed)
    .get(bills.list)
    .put(bills.update)
    .post(bills.create);

  // Single bill routes
  app
    .route("/api/bills/:billId")
    .all(billsPolicy.isAllowed)
    .get(bills.read)
    .put(bills.update)
    .delete(bills.delete);

  // Finish by binding the bill middleware
  // app.param('billId', bills.billByID);
};
