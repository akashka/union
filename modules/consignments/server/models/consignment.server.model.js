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
 * Consignment Schema
 */
var ConsignmentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  consignmentNo: {
    type: Number
  },
  ConsignmentDate: {
    type: Date,
    default: Date.now
  },
  consignerName: {
    type: String
  },
  consignerState: {
    type: String
  },
  consignerGstNo: {
    type: string
  },
  consigneeName: {
    type: String
  },
  consigneeState: {
    type: String
  },
  consigneeGstNo: {
    type: string
  },
  invoiceNo: {
    type: Number
  },
  from: {
    type: String
  },
  to: {
    type: String
  },
  noOfPkgs: {
    type: Number
  },
  acWtInKgs: {
    type: Number
  },
  baWtInKgs: {
    type: Number
  },
  tobBal: {
    type: Number
  },
  consignmentType: {
    type: String
  },
  billingCode: {
    type: Number
  },
  billingState: {
    type: String
  },
  billerGstNo: {
    type: Number
  },
  loadType: {
    type: String
  },
  serviceTaxPayableBy: {
    type: String
  },
  freight: {
    type: Number
  },
  exCharges: {
    type: Number
  },
  matValue: {
    type: Number
  },
  rate: {
    type: Number
  },
  remarks: {
    type: String
  },
  wCnyN: {
    type: String
  },
  Material: {
    type: String
  },
  dcNo: {
    type: Number
  },
  custCode: {
    type: Number
  },
  totFrieght: {
    type: Number
  },
  serviceTax: {
    type: Number
  },
  educationCess: {
    type: Number
  },
  BillNO: {
    type: Number
  },
  billDate: {
    type: Date,
    default: Date.now()
  },
  toBill: {
    type: String
  },
  toPay: {
    type: String
  },
  Cbsbr: {
    type: String
  },
  mrAmount: {
    type: Number
  },
  mrNo: {
    type: Number
  },
  cbsDate: {
    type: Date
  },
  Paid: {
    type: Number
  },
  user: {
    type: Schema.ObjectId,
    ref: "User"
  }
});

ConsignmentSchema.statics.seed = seed;

mongoose.model("Consignment", ConsignmentSchema);

/**
 * Seeds the User collection with document (Consignment)
 * and provided options.
 */
function seed(doc, options) {
  var Consignment = mongoose.model("Consignment");

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
        Consignment.findOne({
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

          // Remove Consignment (overwrite)

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
              "Database Seeding: Consignment\t" + doc.lr_number + " skipped"
            )
          });
        }

        var consignment = new Consignment(doc);

        consignment.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message:
              "Database Seeding: Consignment\t" +
              consignment.lr_number +
              " added"
          });
        });
      });
    }
  });
}
