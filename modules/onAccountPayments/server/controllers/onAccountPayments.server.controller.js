"use strict";

/**
 * Module dependencies
 */
var path = require("path"),
    mongoose = require("mongoose"),
    OnAccountPayment = mongoose.model("OnAccountPayment"),
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
 * Create a onAccountPayment
 */
exports.create = function(req, res) {
    var onAccountPayment = new OnAccountPayment(req.body);
    onAccountPayment.user = req.user;

    onAccountPayment.save(function(err) {
        if (err) {
            return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(onAccountPayment);
        }
    });
};

/**
 * Show the current onAccountPayment
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var onAccountPayment = req.onAccountPayment ? req.onAccountPayment.toJSON() : {};

    // Add a custom field to the OnAccountPayment, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the OnAccountPayment model.
    onAccountPayment.isCurrentUserOwner = !!(
        req.user &&
        onAccountPayment.user &&
        onAccountPayment.user._id.toString() === req.user._id.toString()
    );

    res.json(onAccountPayment);
};

/**
 * Update an onAccountPayment
 */
exports.update = function(req, res) {
    var id = req.body._id;
    var onAccountPayment = req.body;
    delete onAccountPayment._id;
    delete onAccountPayment.__v;

    OnAccountPayment.update({ _id: id },
        onAccountPayment, { upsert: true, new: true },
        function(err) {
            if (err) {
                return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(onAccountPayment);
            }
        }
    );
};

/**
 * Delete an onAccountPayment
 */
exports.delete = function(req, res) {
    var onAccountPayment = req.params.onAccountPaymentId;
    console.log(req);
    console.log(onAccountPayment);
    return OnAccountPayment.findById(onAccountPayment, function(err, f) {
        if (!err) {
            return f.remove(function(err) {
                if (!err) {
                    res.json(onAccountPayment);
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
 * List of onAccountPayments
 */
exports.list = function(req, res) {
    OnAccountPayment.find()
        .sort("-created")
        .populate("user", "displayName")
        .exec(function(err, onAccountPayments) {
            if (err) {
                return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(onAccountPayments);
            }
        });
};

/**
 * OnAccountPayment middleware
 */
exports.onAccountPaymentByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: "OnAccountPayment is invalid"
        });
    }

    OnAccountPayment.findById(id)
        .populate("user", "displayName")
        .exec(function(err, onAccountPayment) {
            if (err) {
                return next(err);
            } else if (!onAccountPayment) {
                return res.status(404).send({
                    message: "No onAccountPayment with that identifier has been found"
                });
            }
            req.onAccountPayment = onAccountPayment;
            next();
        });
};