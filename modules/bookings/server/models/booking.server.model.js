'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Booking Schema
 */
var BookingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  }, 
  bill_date: {
    type: Date,
    default: Date.now
  },
  bill_no: {
    type: String,
    default: '',
    trim: true,
    required: 'Bill Number cannot be blank'
  },
  bill_to: {
    type: String,
    default: ''
  },
  consignor: {
  },
  consignee: {
  },
  details: {
  },
  ref_no: {
    type: String,
    default: ''
  },
  ref_date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
});

BookingSchema.statics.seed = seed;

mongoose.model('Booking', BookingSchema);

/**
* Seeds the User collection with document (Booking)
* and provided options.
*/
function seed(doc, options) {
  var Booking = mongoose.model('Booking');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Booking
          .findOne({
            lr_number: doc.lr_number
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Booking (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Booking\t' + doc.lr_number + ' skipped')
          });
        }

        var booking = new Booking(doc);

        booking.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Booking\t' + booking.lr_number + ' added'
          });
        });
      });
    }
  });
}
