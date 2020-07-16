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
 * Challan Schema
 */
var ChallanSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  }, 
  challanNo: {
    type: Number,
  },
  challanDate: {
    type: Date,
    default: 'Date.now',
  },
  mfNo: {
    type: Number,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  weight: {
    type: Number,
  },
  rate: {
    type: Number,
  },
  lorryNo: {
    type: Number,
  },
  payAt: {
      type: String,
  },
  prGodown: {
      type: String,
  },
  Kms: {
     type: String,
  },
  Tonnes: {
     type: String,
  },
  freight: {
     type: Number,
  },
  Tds: {
    type: Number,
   },
  balHire: {
    type: String,
   },
  remarks: {
    type: String,
  },
  Hamali: {
    type: Number,
  },
  advance: {
    type: Number,
  },
 totalDeduction: {
    type: Number,
  },
 Owner: {
    type: String,
  },
 Detention: {
    type:  String,
  },
  coolie: {
     type: Number,
   },
  totalHire: {
     type: String,
  },
  ownerMobile: {
     type: Number,
  },
  Broker: {
     Type: String,
   },
  panNo: {
    type: String,
  },
  mfNo: {
    type: Number,
  },
 consignmentDate: {
    type: Date,
  },
 consignmentWeight: {
    type:  Number,
  },
 consignmentFrieght: {
    type: Number,
  },
 passMfcns: {
    type: String,
  },
consignmentBranch: {
    type: String,
  },
From: {
   type: String,
  },
Mpwt: {
  type: String,
  },
cnprem: {
   type: String,
  },
 consignmentNo: {
    type: Number,
  },
 to: {
    type: String,
  },
mfFrt: {
   type: Number,
  },
 movNo: {
   type: Number,
  },
Pkgs: {
    type: Number,
  },
from: {
    type: String,
  },
to: {
   type: String,
  },
Mfrem: {
   type: String,
  },
 user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
});

ChallanSchema.statics.seed = seed;

mongoose.model("Challan", ChallanSchema);

/**
 * Seeds the User collection with document (Challan)
 * and provided options.
 */
function seed(doc, options) {
  var Challan = mongoose.model("Challan");

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
        Challan.findOne({
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

          // Remove Challan (overwrite)

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
              "Database Seeding: Challan\t" + doc.lr_number + " skipped"
            )
          });
        }

        var challan = new Challan(doc);

        challan.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message:
              "Database Seeding: Challan\t" +
              challan.lr_number +
              " added"
          });
        });
      });
    }
  });
}
