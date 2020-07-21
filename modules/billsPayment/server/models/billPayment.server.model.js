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
 * BillPayment Schema
 */
var BillPaymentSchema = new Schema({
  created: {
    type: Date,
    default: 'Date.now',
  }, 
  billBranch: {
    type: String,
  },
  billNo: {
    type: Number,
  },
  billsDate: {
    type: Date,
    default: 'Date.now',
  },
  pRCode: {
    type: Number,
  },
  billAmount: {
    type: Number,
  },
  billRemarks: {
    type: String,
  },
  less: {
    type: Number,
  },
  dn: {
    type: String,
  },
  discount: {
      type: Number,
  },
  sdEmd: {
      type: String,
  },
  short: {
     type: String,
  },
  npv: {
     type: String,
  },
  claim: {
     type: Number,
  },
  serTax: {
    type: Number,
   },
  lt: {
    type: String,
   },
  tpt: {
    type: Number, 
  },
  tds: {
    type: Number,
  },
  educationCess: {
    type: Number,
  },
 remarks: {
    type: String,
  },
 cbsBranch: {
    type: String,
  },
 cbsDate: {
    type:  Date,
  },
 mrNo: {
     type: Number,
   },
  chequeNo: {
     type: Number,
  },
  tds: {
     type: Number,
  },
  less: {
     Type: Number,
   },
  sd: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },

});

BillPaymentSchema.statics.seed = seed;

mongoose.model("BillPayment", BillPaymentSchema);

/**
 * Seeds the User collection with document (BillPayment)
 * and provided options.
 */
function seed(doc, options) {
  var BillPayment = mongoose.model("BillPayment");

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
        BillPayment.findOne({
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

          // Remove BillPayment (overwrite)

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
              "Database Seeding: BillPayment\t" + doc.lr_number + " skipped"
            )
          });
        }

        var billPayment = new BillPayment(doc);

        billPayment.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message:
              "Database Seeding: BillPayment\t" +
              billPayment.lr_number +
              " added"
          });
        });
      });
    }
  });
}
