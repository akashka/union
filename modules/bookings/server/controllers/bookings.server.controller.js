"use strict";
/**
 * Module dependencies
 */
var path = require("path"),
  mongoose = require("mongoose"),
  Booking = mongoose.model("Booking"),
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
 * Create a booking
 */
exports.create = function(req, res) {
  var booking = new Booking(req.body);
  booking.user = req.user;
  booking.save(function(err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};
/**
 * Show the current booking
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var booking = req.booking ? req.booking.toJSON() : {};
  // Add a custom field to the Booking, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Booking model.
  booking.isCurrentUserOwner = !!(
    req.user &&
    booking.user &&
    booking.user._id.toString() === req.user._id.toString()
  );
  res.json(booking);
};
/**
 * Update an booking
 */
exports.update = function(req, res) {
  var id = req.body._id;
  var booking = req.body;
  delete booking._id;
  delete booking.__v;
  Booking.update({ _id: id }, booking, { upsert: true, new: true }, function(
    err
  ) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(booking);
    }
  });
};
/**
 * Delete an booking
 */
exports.delete = function(req, res) {
  var booking = req.params.bookingId;
  console.log(req);
  console.log(booking);
  return Booking.findById(booking, function(err, f) {
    if (!err) {
      return f.remove(function(err) {
        if (!err) {
          res.json(booking);
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
 * List of bookings
 */
exports.list = function(req, res) {
  Booking.find()
    .sort("-created")
    .populate("user", "displayName")
    .exec(function(err, bookings) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(bookings);
      }
    });
};
/**
 * Booking middleware
 */
exports.bookingByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Booking is invalid"
    });
  }
  Booking.findById(id)
    .populate("user", "displayName")
    .exec(function(err, booking) {
      if (err) {
        return next(err);
      } else if (!booking) {
        return res.status(404).send({
          message: "No booking with that identifier has been found"
        });
      }
      req.booking = booking;
      next();
    });
};
var addCommas = function(x) {
  x = x.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res;
};
var convertToWord = function(num) {
  var a = [
    "",
    "one ",
    "two ",
    "three ",
    "four ",
    "five ",
    "six ",
    "seven ",
    "eight ",
    "nine ",
    "ten ",
    "eleven ",
    "twelve ",
    "thirteen ",
    "fourteen ",
    "fifteen ",
    "sixteen ",
    "seventeen ",
    "eighteen ",
    "nineteen "
  ];
  var b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety"
  ];
  if ((num = num.toString()).length > 9) return "overflow";
  var n = ("000000000" + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        ""
      : "";
  str += "Only / -";
  return str.toUpperCase();
};
var findTotal = function(details) {
  var sum = 0;
  for (var i = 0; i < details.length; i++) {
    sum += Number(details[i].amount);
    for (var p = 0; p < details[i].extras.length; p++) {
      sum += Number(details[i].extras[p].extra_value);
    }
  }
  return sum;
};
exports.downloadByID = function(req, res) {
  var id = req.params.bookingId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Booking is invalid"
    });
  }
  Booking.findById(id)
    .populate("user", "displayName")
    .exec(function(err, booking) {
      if (err) {
        return next(err);
      } else if (!booking) {
        return res.status(404).send({
          message: "No booking with that identifier has been found"
        });
      }
      var stringTemplate = fs.readFileSync(
        path.join(__dirname, "../controllers") + "/bill.html",
        "utf8"
      );
      stringTemplate = stringTemplate.replace(
        "{{bill_no}}",
        booking.bill_no != undefined ? booking.bill_no.toUpperCase() : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{ref_no}}",
        booking.ref_no != undefined && booking.ref_no != ""
          ? booking.ref_no.toUpperCase()
          : "."
      );
      stringTemplate = stringTemplate.replace(
        "{{bill_date}}",
        booking.bill_date != undefined
          ? moment(booking.bill_date)
              .add(1, "days")
              .format("DD-MM-YYYY")
          : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{ref_date}}",
        booking.ref_no != undefined && booking.ref_no != ""
          ? moment(booking.ref_date)
              .add(1, "days")
              .format("DD-MM-YYYY")
          : " &nbsp; "
      );
      stringTemplate = stringTemplate.replace(
        "{{bill_to}}",
        booking.bill_to != undefined ? booking.bill_to.toUpperCase() : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{consignor_name}}",
        booking.consignor.name != undefined
          ? booking.consignor.name.toUpperCase()
          : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{consignor_gst}}",
        booking.consignor.gstin_no != undefined
          ? "GST NO:   " + booking.consignor.gstin_no.toUpperCase()
          : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{consignee_name}}",
        booking.consignee.name != undefined
          ? booking.consignee.name.toUpperCase()
          : ""
      );
      stringTemplate = stringTemplate.replace(
        "{{consignee_gst}}",
        booking.consignee.gstin_no != undefined
          ? "GST NO:   " + booking.consignee.gstin_no.toUpperCase()
          : ""
      );
      var prntStrng = "";
      for (var r = 0; r < booking.details.length; r++) {
        prntStrng +=
          "\n" +
          (booking.details[r].gc_number != undefined
            ? booking.details[r].gc_number.toUpperCase()
            : " ") +
          "&nbsp; &nbsp; &nbsp;" +
          (booking.details[r].gc_date != undefined
            ? moment(booking.details[r].gc_date)
                .add(1, "days")
                .format("DD-MM-YYYY")
            : " ") +
          "&nbsp; &nbsp;" +
          (booking.details[r].from != undefined
            ? booking.details[r].from.toUpperCase()
            : " ") +
          "&nbsp; &nbsp; " +
          (booking.details[r].to != undefined
            ? booking.details[r].to.toUpperCase()
            : " ") +
          "&nbsp; &nbsp; " +
          (booking.details[r].package != undefined
            ? booking.details[r].package.toUpperCase()
            : " ") +
          "&nbsp; &nbsp;" +
          (booking.details[r].weight != undefined
            ? booking.details[r].weight.toUpperCase()
            : " ") +
          "&nbsp; &nbsp; &nbsp;" +
          (booking.details[r].rate != undefined
            ? booking.details[r].rate.toUpperCase()
            : " ") +
          "&nbsp; &nbsp;" +
          (booking.details[r].kms != undefined
            ? booking.details[r].kms.toUpperCase()
            : " ") +
          "&nbsp; &nbsp; &nbsp;" +
          "\n";
        if (
          booking.details[r].extra_info != "" &&
          booking.details[r].extra_info != undefined
        )
          prntStrng +=
            "(" + booking.details[r].extra_info.toUpperCase() + ")" + "\n";
        for (var m = 0; m < booking.details[r].extras.length; m++) {
          prntStrng +=
            booking.details[r].extras[m].extra_name.toUpperCase() + "\n";
        }
      }
      stringTemplate = stringTemplate.replace("{{row_to_print}}", prntStrng);
      prntStrng = "";
      for (var r = 0; r < booking.details.length; r++) {
        prntStrng += addCommas(booking.details[r].amount) + ".00" + "\n";
        for (var m = 0; m < booking.details[r].extras.length; m++) {
          prntStrng +=
            addCommas(booking.details[r].extras[m].extra_value) + ".00" + "\n";
        }
        prntStrng += "\n \n";
      }
      stringTemplate = stringTemplate.replace("{{amount_to_print}}", prntStrng);
      stringTemplate = stringTemplate.replace(
        "{{total_amount_words}}",
        convertToWord(findTotal(booking.details))
      );
      stringTemplate = stringTemplate.replace(
        "{{total_amount}}",
        addCommas(findTotal(booking.details)) + ".00"
      );
      conversion(
        {
          html: stringTemplate,
          paperSize: {
            format: "url",
            width: "10in",
            height: "6in"
          },
          waitForJS: false,
          waitForJSVarName: "PHANTOM_HTML_TO_PDF_READY",
          allowLocalFilesAccess: true,
          settings: {
            javascriptEnabled: true
          },
          format: {
            quality: 100
          },
          phantomPath: require("phantomjs-prebuilt").path
        },
        function(err, pdf) {
          console.log('errrrr', err);
          console.log('pdffff', pdf);
          var output = fs.createWriteStream("./bill.pdf");
          pdf.stream.pipe(output);
          let filename = "invoice";

    
          
            
    

          
    
    
  
          filename = encodeURIComponent(filename) + ".pdf";
          var file = fs.readFileSync("./bill.pdf");
          pdf2img.setOptions({
            type: "png", // png or jpg, default jpg
            outputname: "test", // output file name, dafault null (if null given, then it will create image name same as input name)
            page: null // convert selected page, default null (if null given, then it will convert all pages)
          });
          pdf2img.convert("./output.pdf", function(err, info) {
            if (err) console.log(err);
          });
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-disposition",
            'attachment; filename="' + filename + '"'
          );
          pdf.stream.pipe(res);
        }
      );
    });
};
exports.filteredBookings = function(req, res) {
  console.log(req.body);
  var orderBy = req.body.orderBy || "bill_no";
  var sortBy = req.body.sortBy || "desc";
  var countFrom = parseInt(req.body.countFrom) || 0;
  var paginationNumber = parseInt(req.body.paginationNumber) || 10;
  var params = {};
  if (req.body.params.bill_from !== "" && req.body.params.bill_from !== null) {
    params.bill_date = {
      $gt: req.body.params.bill_from
    };
  }
  if (req.body.params.bill_to !== "" && req.body.params.bill_to !== null) {
    params.bill_date = {
      $lt: req.body.params.bill_to
    };
  }
  if (
    req.body.params.bill_number !== "" &&
    req.body.params.bill_number !== null
  ) {
    params.bill_no = req.body.params.bill_number;
  }
  if (req.body.params.consignor !== "" && req.body.params.consignor !== null) {
    params.consignor = req.body.params.consignor;
  }
  if (req.body.params.consignee !== "" && req.body.params.consignee !== null) {
    params.consignor = req.body.params.consignee;
  }
  if (
    req.body.params.bill_to_address !== "" &&
    req.body.params.bill_to_address !== null
  ) {
    params.bill_to = req.body.params.bill_to_address;
  }
  var ordering = {};
  ordering[orderBy] = sortBy == "asc" ? 1 : -1;
  console.log(params);
  Booking.count().exec(function(err, counter) {
    Booking.find(params)
      .sort(ordering)
      .limit(paginationNumber)
      .skip(countFrom)
      .populate("user", "displayName")
      .exec(function(err, bookings) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var resp = {
            count: counter,
            data: bookings
          };
          res.json(resp);
        }
      });
  });
};
exports.getPrimaryDetails = function(req, res) {
  Booking.aggregate([
    {
      $group: {
        _id: 0,
        consignor: { $addToSet: "$consignor" },
        consignee: { $addToSet: "$consignee" },
        bill_to: { $addToSet: "$bill_to" },
        bill_no: { $addToSet: "$bill_no" },
        gc_number: { $addToSet: "$details.gc_number" },
        ref_no: { $addToSet: "$ref_no" }
      }
    }
  ]).exec(function(err, data) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Booking.find()
        .sort([['_id', -1]])
        .limit(1)
        .exec(function(err, bookings) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            data[0].latest_bill_no = bookings[0].bill_no;
            var resp = { data: data[0] };
            res.json(resp);
          }
        });
    }
  });
};
exports.getHomePageData = function(req, res) {
  Booking.aggregate([
    {
      $group: {
        _id: 0,
        total: {
          $sum: 1
        },
        count: {
          $sum: { $size: "$details" }
        },
        consignor: {
          $addToSet: "$consignor"
        },
        amount: { $push: "$details.amount" },
        extras: { $push: "$details.extras" }
      }
    }
  ]).exec(function(err, data) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(data[0]);
    }
  });
};
exports.getMonthGraphData = function(req, res) {
  Booking.aggregate([
    {
      $group: {
        _id: { month: { $month: "$bill_date" }, year: { $year: "$bill_date" } },
        values: { $push: "$details.amount" },
        extras: { $push: "$details.extras" },
        count: { $sum: 1 }
      }
    }
  ]).exec(function(err, data) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({ data });
    }
  });
};
exports.getClientGraphData = function(req, res) {
  Booking.aggregate([
    {
      $group: {
        _id: "$consignor.name",
        values: { $push: "$details.amount" },
        extras: { $push: "$details.extras" },
        count: { $sum: 1 }
      }
    }
  ]).exec(function(err, data) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json({ data });
    }
  });
};
exports.getBookingDetails = function(req, res) {
  var id = req.body.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Booking is invalid"
    });
  }
  Booking.findById(id)
    .populate("user", "displayName")
    .exec(function(err, booking) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else if (!booking) {
        return res.status(404).send({
          message: "No booking with that identifier has been found"
        });
      }
      res.json(booking);
    });
};