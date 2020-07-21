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
 * ConsignmentPayment Schema
 */
var ConsignmentPaymentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  consignmentBranch: {
    type: String
  },
  mrBran: {
    type: String
  },
  mrDate: {
    type: Date
  },
  consignmentNo: {
    type: Number
  },
  mrAmount: {
    type: Number
  },
  mrNo: {
    type: String
  },
  consignmentDate: {
    type: Date,
    default: Date.now
  },
  less: {
    type: Number
  },
  remarks: {
    type: String
  },
  consigner: {
    type: String
  },
  wRem: {
    type: String
  },
  from: {
    type: String
  },
  to: {
    type: String
  },
  billBranch: {
    type: String
  },
  bfrt: {
    type: Number
  },
  BillNO: {
    type: Number
  },
  toParty: {
    type: String
  },
  toBill: {
    type: String
  },
  billDate: {
    type: Date
  },
  paid: {
    type: Boolean
  },
  hire: {
    type: Number
  },
  billAmount: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

ConsignmentPaymentSchema.statics.seed = seed;

mongoose.model("ConsignmentPayment", ConsignmentPaymentSchema);

/**
 * Seeds the User collection with document (ConsignmentPayment)
 * and provided options.
 */
function seed(doc, options) {
  var ConsignmentPayment = mongoose.model("ConsignmentPayment");

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
        ConsignmentPayment.findOne({
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

          // Remove ConsignmentPayment (overwrite)

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
              "Database Seeding: ConsignmentPayment\t" + doc.lr_number + " skipped"
            )
          });
        }

        var consignmentPayment = new ConsignmentPayment(doc);

        consignmentPayment.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message:
              "Database Seeding: ConsignmentPayment\t" +
              consignmentPayment.lr_number +
              " added"
          });
        });
      });
    }
  });
}
