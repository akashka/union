"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  BillPayment = mongoose.model("BillPayment"),
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
 * Create a billPayment
 */
exports.create = function(req, res) {
  var billPayment = new BillPayment(req.body);
  billPayment.user = req.user;

  billPayment.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(billPayment);
    }
  });
};

/**
 * Show the current billPayment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var billPayment = req.billPayment ? req.billPayment.toJSON() : {};

  // Add a custom field to the BillPayment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the BillPayment model.
  billPayment.isCurrentUserOwner = !!(
    req.user &&
    billPayment.user &&
    billPayment.user._id.toString() === req.user._id.toString()
  );

  res.json(billPayment);
};

/**
 * Update an billPayment
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var billPayment = req.body;
  delete billPayment._id;
  delete billPayment.__v;

  BillPayment.update(
    { _id: id },
    billPayment,
    { upsert: true, new: true },
    function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(billPayment);
      }
    }
  );
};

/**
 * Delete an billPayment
 */
exports.delete = function(req, res) {
  var billPayment = req.params.billPaymentId;
  console.log(req);
  console.log(billPayment);
  return BillPayment.findById(billPayment, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(billPayment);
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
 * List of billPayments
 */
exports.list = function(req, res) {
  BillPayment.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, billPayments) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(billPayments);
      }
    });
};

/**
 * BillPayment middleware
 */
exports.billPaymentByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "BillPayment is invalid"
    });
  }

  BillPayment.findById(id)
    .populate("user", "displayName")
    .exec(function(err, billPayment) {
      if (err) {
        return next(err);
      } else if (!billPayment) {
        return res.status(404).send({
          message: "No billPayment with that identifier has been found"
        });
      }
      req.billPayment = billPayment;
      next();
    });
};
