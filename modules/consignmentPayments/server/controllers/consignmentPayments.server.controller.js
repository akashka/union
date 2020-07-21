"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  ConsignmentPayment = mongoose.model("ConsignmentPayment"),
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
 * Create a consignmentPayment
 */
exports.create = function(req, res) {
  var consignmentPayment = new ConsignmentPayment(req.body);
  consignmentPayment.user = req.user;

  consignmentPayment.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(consignmentPayment);
    }
  });
};

/**
 * Show the current consignmentPayment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var consignmentPayment = req.consignmentPayment ? req.consignmentPayment.toJSON() : {};

  // Add a custom field to the ConsignmentPayment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the ConsignmentPayment model.
  consignmentPayment.isCurrentUserOwner = !!(
    req.user &&
    consignmentPayment.user &&
    consignmentPayment.user._id.toString() === req.user._id.toString()
  );

  res.json(consignmentPayment);
};

/**
 * Update an consignmentPayment
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var consignmentPayment = req.body;
  delete consignmentPayment._id;
  delete consignmentPayment.__v;

  ConsignmentPayment.update(
    { _id: id },
    consignmentPayment,
    { upsert: true, new: true },
    function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(consignmentPayment);
      }
    }
  );
};

/**
 * Delete an consignmentPayment
 */
exports.delete = function(req, res) {
  var consignmentPayment = req.params.consignmentPaymentId;
  console.log(req);
  console.log(consignmentPayment);
  return ConsignmentPayment.findById(consignmentPayment, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(consignmentPayment);
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
 * List of consignmentPayments
 */
exports.list = function(req, res) {
  ConsignmentPayment.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, consignmentPayments) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(consignmentPayments);
      }
    });
};

/**
 * ConsignmentPayment middleware
 */
exports.consignmentPaymentByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "ConsignmentPayment is invalid"
    });
  }

  ConsignmentPayment.findById(id)
    .populate("user", "displayName")
    .exec(function(err, consignmentPayment) {
      if (err) {
        return next(err);
      } else if (!consignmentPayment) {
        return res.status(404).send({
          message: "No consignmentPayment with that identifier has been found"
        });
      }
      req.consignmentPayment = consignmentPayment;
      next();
    });
};
