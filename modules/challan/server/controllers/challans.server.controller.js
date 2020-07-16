"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  Challan = mongoose.model("Challan"),
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
 * Create a challan
 */
exports.create = function(req, res) {
  var challan = new Challan(req.body);
  challan.user = req.user;

  challan.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(challan);
    }
  });
};

/**
 * Show the current challan
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var challan = req.challan ? req.challan.toJSON() : {};

  // Add a custom field to the Challan, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Challan model.
  challan.isCurrentUserOwner = !!(
    req.user &&
    challan.user &&
    challan.user._id.toString() === req.user._id.toString()
  );

  res.json(challan);
};

/**
 * Update an challan
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var challan = req.body;
  delete challan._id;
  delete challan.__v;

  Challan.update(
    { _id: id },
    challan,
    { upsert: true, new: true },
    function(err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(challan);
      }
    }
  );
};

/**
 * Delete an challan
 */
exports.delete = function(req, res) {
  var challan = req.params.challanId;
  console.log(req);
  console.log(challan);
  return Challan.findById(challan, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(challan);
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
 * List of challans
 */
exports.list = function(req, res) {
  Challan.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, challans) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(challans);
      }
    });
};

/**
 * Challan middleware
 */
exports.challanByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Challan is invalid"
    });
  }

  Challan.findById(id)
    .populate("user", "displayName")
    .exec(function(err, challan) {
      if (err) {
        return next(err);
      } else if (!challan) {
        return res.status(404).send({
          message: "No challan with that identifier has been found"
        });
      }
      req.challan = challan;
      next();
    });
};
