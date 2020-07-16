"use strict";

/**
 * Module dependencies
 */
var consignmentsPolicy = require("../policies/consignments.server.policy"),
  consignments = require("../controllers/consignments.server.controller");

module.exports = function(app) {
  // Consignments collection routes
  app
    .route("/api/consignments")
    .all(consignmentsPolicy.isAllowed)
    .get(consignments.list)
    .put(consignments.update)
    .post(consignments.create);

  // Single consignment routes
  app
    .route("/api/consignments/:consignmentId")
    .all(consignmentsPolicy.isAllowed)
    .get(consignments.read)
    .put(consignments.update)
    .delete(consignments.delete);

  // Finish by binding the consignment middleware
  // app.param('consignmentId', consignments.consignmentByID);
};
