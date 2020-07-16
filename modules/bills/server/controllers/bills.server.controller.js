"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  Bill = mongoose.model("Bill"),
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
 * Create a bill
 */
exports.create = function(req, res) {
  var bill = new Bill(req.body);
  bill.user = req.user;

  bill.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(bill);
    }
  });
};

/**
 * Show the current bill
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bill = req.bill ? req.bill.toJSON() : {};

  // Add a custom field to the Bill, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Bill model.
  bill.isCurrentUserOwner = !!(
    req.user &&
    bill.user &&
    bill.user._id.toString() === req.user._id.toString()
  );

  res.json(bill);
};

/**
 * Update an bill
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var bill = req.body;
  delete bill._id;
  delete bill.__v;

  Bill.update(
    { _id: id },
    bill,
    { upsert: true, new: true },
    function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(bill);
      }
    }
  );
};

/**
 * Delete an bill
 */
exports.delete = function(req, res) {
  var bill = req.params.billId;
  console.log(req);
  console.log(bill);
  return Bill.findById(bill, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(bill);
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
 * List of bills
 */
exports.list = function(req, res) {
  Bill.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, bills) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(bills);
      }
    });
};

/**
 * Bill middleware
 */
exports.billByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Bill is invalid"
    });
  }

  Bill.findById(id)
    .populate("user", "displayName")
    .exec(function(err, bill) {
      if (err) {
        return next(err);
      } else if (!bill) {
        return res.status(404).send({
          message: "No bill with that identifier has been found"
        });
      }
      req.bill = bill;
      next();
    });
};
