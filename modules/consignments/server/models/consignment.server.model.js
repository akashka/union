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
    type: String
  },
  consignmentDate: { 
    type: Date,
    default: Date.now
  },
  consignor: {
    type: Object
    // name
    // state
    // gstno
  },
  consignee: {
    type: Object
    // name
    // state
    // gstno
  },
  invoiceNo: {
    type: String
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
  tobBat: {
    type: Number
  },
  consignmentType: {
    type: String
  },
  acWtInKgs: {
    type: Number
  },
  chWtInKgs: {
    type: Number
  },
  baWtInKgs: {
    type: Number
  },
  billing: {
    type: Object
    // code:
    // state:
    // gstNo:
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
  wCnyN: {
    type: String
  },
  material: {
    type: String
  },
  dcNo: {
    type: String
  },
  custCode: {
    type: String
  },
  totFrieght: {
    type: String
  },
  serviceTax: {
    type: String
  },
  educationCess: {
    type: String
  },
  remarks: {
    type: String
  },
  // billNo: {
  //   type: Number
  // },
  // billDate: {
  //   type: Date,
  //   default: Date.now()
  // },
  // toBill: {
  //   type: String
  // },
  // toPay: {
  //   type: String
  // },
  // cbsbr: {
  //   type: String
  // },
  // mrAmount: {
  //   type: Number
  // },
  // mrNo: {
  //   type: Number
  // },
  // cbsDate: {
  //   type: Date
  // },
  // paid: {
  //   type: Number
  // },
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
