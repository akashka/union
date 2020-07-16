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
 * Bill Schema
 */
var BillSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  }, 
  billNo: {
    type: Number,
  },
  billDate: {
    type: Date,
    default: Date.now
  },
  party: {
    type: String,
  },
  subCode: {
    type: Number,
  },
  consignmentNo: {
    type: Number,
  },
  From: {
     Type: String,
   },
  to: {
    type: String,
  },
  freight: {
    type: Number,
  },
  hamali: {
    type: Number,
  },
  Misc: {
    type: Number,
  },
  Octroi: {
    type: Number,
   },
  Oschal: {
    type: Number,
   },
  demurge: {
    type: String
  },
  challanPost: {
    type: String,
   },
  Dent: {
    type: String,
  },
 lcDc: {
    type: String,
   },
billWeight: {
    type: Number,
  },
localHire: {
   type: Number
  
},
bonus: {
   type: Number,
  },
Penalty: {
   type: Number,
  },
serviceTax: {
   type: Number,
  },  
  educationCess: {
    type: Number,
  },
  exAmount: {
    type: Number,
  },
  StChar: {
    type: Number, 
  },
  remarks: {
      type: String,
  },

  SdEmd: {
      type: String,
  },
  total: {
     type: Number,
  },
  consignmentBranch: {
     type: String,
  },
  consignmentNo: {
     type: Number,
  },
  consignmentDate: {
    type: Date,
    default: Date
   },
  from: {
    type: String,
   },
To: {
  type: String,
  },
 kms: {
   type: Number, 
  },
 frieght: {
    type: Number,
  },
  weight: {
    type: Number,
  },
 remarks: {
    type: String,
  },
 withRem: {
    type: String,
  },
 user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
});

BillSchema.statics.seed = seed;

mongoose.model("Bill", BillSchema);

/**
 * Seeds the User collection with document (Bill)
 * and provided options.
 */
function seed(doc, options) {
  var Bill = mongoose.model("Bill");

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
        Bill.findOne({
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

          // Remove Bill (overwrite)

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
              "Database Seeding: Bill\t" + doc.lr_number + " skipped"
            )
          });
        }

        var bill = new Bill(doc);

        bill.save(function(err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message:
              "Database Seeding: Bill\t" +
              bill.lr_number +
              " added"
          });
        });
      });
    }
  });
}
