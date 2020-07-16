"use strict";

/**
 * Module dependencies
 */
var challansPolicy = require("../policies/challans.server.policy"),
  challans = require("../controllers/challans.server.controller");

module.exports = function(app) {
  // Challans collection routes
  app
    .route("/api/challans")
    .all(challansPolicy.isAllowed)
    .get(challans.list)
    .put(challans.update)
    .post(challans.create);

  // Single challan routes
  app
    .route("/api/challans/:challanId")
    .all(challansPolicy.isAllowed)
    .get(challans.read)
    .put(challans.update)
    .delete(challans.delete);

  // Finish by binding the challan middleware
  // app.param('challanId', challans.challanByID);
};
