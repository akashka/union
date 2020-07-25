"use strict";

/**
 * Module dependencies
 */
var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    path = require("path"),
    config = require(path.resolve("./config/config")),
    chalk = require("chalk");

/**
 * OnAccountPayment Schema
 */
var OnAccountPaymentSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    branch: {
        type: String
    },
    partyCode: {
        type: String,
    },
    chequeNo: {
        type: Number
    },
    cbsDate: {
        type: Date
    },
    amtrec: {
        type: String
    },
    recmrno: {
        type: String
    },
    billBranch: {
        type: String
    },
    billNo: {
        type: Number
    },
    chequeNo: {
        type: Number
    },
    remarks: {
        type: String
    },
    adjyn: {
        type: String
    },
    adjDate: {
        type: Date
    },
    cbsDate: {
        type: Date
    },
    adjMrNo: {
        type: Number
    },
    adjRem: {
        type: String
    },
    amtrec: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
});

OnAccountPaymentSchema.statics.seed = seed;

mongoose.model("OnAccountPayment", OnAccountPaymentSchema);

/**
 * Seeds the User collection with document (OnAccountPayment)
 * and provided options.
 */
function seed(doc, options) {
    var OnAccountPayment = mongoose.model("OnAccountPayment");

    return new Promise(function(resolve, reject) {
        skipDocument()
            .then(findAdminUser)
            .then(add)
            .then(function(response) {
                return resolve(response);
            })
            .catch(function(err) {
                return reject(err);
            });

        function findAdminUser(skip) {
            var User = mongoose.model("User");

            return new Promise(function(resolve, reject) {
                if (skip) {
                    return resolve(true);
                }

                User.findOne({
                    roles: { $in: ["admin"] }
                }).exec(function(err, admin) {
                    if (err) {
                        return reject(err);
                    }

                    doc.user = admin;

                    return resolve();
                });
            });
        }

        function skipDocument() {
            return new Promise(function(resolve, reject) {
                OnAccountPayment.findOne({
                    lr_number: doc.lr_number
                }).exec(function(err, existing) {
                    if (err) {
                        return reject(err);
                    }

                    if (!existing) {
                        return resolve(false);
                    }

                    if (existing && !options.overwrite) {
                        return resolve(true);
                    }

                    // Remove OnAccountPayment (overwrite)

                    existing.remove(function(err) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(false);
                    });
                });
            });
        }

        function add(skip) {
            return new Promise(function(resolve, reject) {
                if (skip) {
                    return resolve({
                        message: chalk.yellow(
                            "Database Seeding: OnAccountPayment\t" + doc.lr_number + " skipped"
                        )
                    });
                }

                var onAccountPayment = new OnAccountPayment(doc);

                onAccountPayment.save(function(err) {
                    if (err) {
                        return reject(err);
                    }

                    return resolve({
                        message: "Database Seeding: OnAccountPayment\t" +
                            onAccountPayment.lr_number +
                            " added"
                    });
                });
            });
        }
    });
}