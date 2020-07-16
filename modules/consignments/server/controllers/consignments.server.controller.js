"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  Consignment = mongoose.model("Consignment"),
  errorHandler = require(path.resolve(
    "./modules/core/server/controllers/errors.server.controller"
  )),
  PDFDocument = require("pdfkit"),
  fs = require("fs"),
  moment = require("moment");
var htmlToPdf = require("html-to-pdf");
var conversion = require("phantom-html-to-pdf")({
  numberOfWorkers: 10,
  timeout: 50000
});
var printer = require("node-thermal-printer");
var pdf2img = require("pdf2img");

/**
 * Create a consignment
 */
exports.create = function(req, res) {
  var consignment = new Consignment(req.body);
  consignment.user = req.user;

  consignment.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consignment);
    }
  });
};

/**
 * Show the current consignment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var consignment = req.consignment ? req.consignment.toJSON() : {};

  // Add a custom field to the Consignment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Consignment model.
  consignment.isCurrentUserOwner = !!(
    req.user &&
    consignment.user &&
    consignment.user._id.toString() === req.user._id.toString()
  );

  res.json(consignment);
};

/**
 * Update an consignment
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var consignment = req.body;
  delete consignment._id;
  delete consignment.__v;

  Consignment.update(
    { _id: id },
    consignment,
    { upsert: true, new: true },
    function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(consignment);
      }
    }
  );
};

/**
 * Delete an consignment
 */
exports.delete = function(req, res) {
  var consignment = req.params.consignmentId;
  console.log(req);
  console.log(consignment);
  return Consignment.findById(consignment, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(consignment);
        } else {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
    } else {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

/**
 * List of consignments
 */
exports.list = function(req, res) {
  Consignment.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, consignments) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(consignments);
      }
    });
};

/**
 * Consignment middleware
 */
exports.consignmentByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Consignment is invalid"
    });
  }

  Consignment.findById(id)
    .populate("user", "displayName")
    .exec(function(err, consignment) {
      if (err) {
        return next(err);
      } else if (!consignment) {
        return res.status(404).send({
          message: "No consignment with that identifier has been found"
        });
      }
      req.consignment = consignment;
      next();
    });
};
