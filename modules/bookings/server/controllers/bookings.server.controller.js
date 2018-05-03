'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Booking = mongoose.model('Booking'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  PDFDocument = require('pdfkit'),
  fs = require('fs'),
  moment = require('moment');
var htmlToPdf = require('html-to-pdf');
var conversion = require("phantom-html-to-pdf")();
// var printJS = require('print-js');
var printer = require("node-thermal-printer");
// var Printer = require('node-printer');
// var printer = require("printer");
// var nodeThermalPrinter = require("node-thermal-printer");
var pdf2img = require('pdf2img');

/**
 * Create a booking
 */
exports.create = function (req, res) {
  var booking = new Booking(req.body);
  booking.user = req.user;

  booking.save(function (err) {
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
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var booking = req.booking ? req.booking.toJSON() : {};

  // Add a custom field to the Booking, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Booking model.
  booking.isCurrentUserOwner = !!(req.user && booking.user && booking.user._id.toString() === req.user._id.toString());

  res.json(booking);
};

/**
 * Update an booking
 */
exports.update = function (req, res) {
  var id = req.body._id;
  var booking = req.body;
  delete booking._id;

  Booking.update({_id: id}, booking, {upsert: true, new: true}, function (err) {
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
exports.delete = function (req, res) {
  var booking = req.booking;

  booking.remove(function (err) {
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
 * List of bookings
 */
exports.list = function (req, res) {
  Booking.find().sort('-created').populate('user', 'displayName').exec(function (err, bookings) {
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
exports.bookingByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Booking is invalid'
    });
  }

  Booking.findById(id).populate('user', 'displayName').exec(function (err, booking) {
    if (err) {
      return next(err);
    } else if (!booking) {
      return res.status(404).send({
        message: 'No booking with that identifier has been found'
      });
    }
    req.booking = booking;
    next();
  });
};

var convertToWord = function(num) {
    var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    str += "Only";
    return str.toUpperCase();
}

var printFile = function(fileName) {
    console.log(fileName);
    printer.init({
      type: 'epson',
      interface: '/dev/usb/lp0'
    });
    printer.alignCenter();
    printer.printImage(fileName, function(done){
      printer.cut();
      console.log("execute");
      printer.execute(function(err){
        console.log("Yes");
        if (err) {
          console.error("Print failed", err);
        } else {
        console.log("Print done");
        }
      });
    });
        // var filename = './output.pdf';
        // var printername = 'Deskjet-1510-series';
        // filename = path.resolve(process.cwd(), filename);
        // fs.readFile(filename, function(err, data){
        //   if(err) {
        //     console.error('err:' + err);
        //     return;
        //   }
        //   console.log('data type is: '+typeof(data) + ', is buffer: ' + Buffer.isBuffer(data));
        //     printer.printDirect({
        //         data: data,
        //         type: 'PDF',
        //         success: function(id) {
        //             console.log('printed with id ' + id);
        //         },
        //         error: function(err) {
        //             console.error('error on printing: ' + err);
        //         }
        //     })
        // });
}

var findTotal = function(details) {
  var sum = 0;
  for(var i=0; i<details.length; i++) {
    sum += Number(details[i].amount);
    for(var p=0; p<details[i].extras.length; p++) {
      sum += Number(details[i].extras[p].extra_value);
    }
  }
  return sum;
}

exports.downloadByID = function (req, res) {
  var id = req.params.bookingId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Booking is invalid'
    });
  }

  Booking.findById(id).populate('user', 'displayName').exec(function (err, booking) {
    if (err) {
      return next(err);
    } else if (!booking) {
      return res.status(404).send({
        message: 'No booking with that identifier has been found'
      });
    }

    var stringTemplate = fs.readFileSync(path.join(__dirname, '../controllers') + '/bill.html', "utf8");
    
    stringTemplate = stringTemplate.replace('{{bill_no}}', booking.bill_no.toUpperCase());
    stringTemplate = stringTemplate.replace('{{ref_no}}', booking.ref_no.toUpperCase());
    stringTemplate = stringTemplate.replace('{{bill_date}}', moment(booking.bill_date).format('DD-MM-YYYY'));
    stringTemplate = stringTemplate.replace('{{ref_date}}', moment(booking.ref_date).format('DD-MM-YYYY'));
    stringTemplate = stringTemplate.replace('{{bill_to}}', booking.bill_to.toUpperCase());
    stringTemplate = stringTemplate.replace('{{consignor_name}}', booking.consignor.name.toUpperCase());
    stringTemplate = stringTemplate.replace('{{consignor_gst}}', booking.consignor.gstin_no.toUpperCase());
    stringTemplate = stringTemplate.replace('{{consignee_name}}', booking.consignee.name.toUpperCase());
    stringTemplate = stringTemplate.replace('{{consignee_gst}}', booking.consignee.gstin_no.toUpperCase());

    var prntStrng = "";
    for(var r=0; r<booking.details.length; r++) {
        prntStrng += ("\n" + booking.details[r].gc_number.toUpperCase() + "&nbsp; &nbsp; &nbsp;" + moment(booking.details[r].gc_date).format('DD-MM-YYYY')
            + "&nbsp; &nbsp;" + booking.details[r].from.toUpperCase() + "&nbsp; &nbsp; " + booking.details[r].to.toUpperCase() + "&nbsp; &nbsp; " + booking.details[r].package.toUpperCase()
            + "&nbsp; &nbsp;" + booking.details[r].weight.toUpperCase() + "&nbsp; &nbsp; &nbsp;" + booking.details[r].rate.toUpperCase() + "&nbsp; &nbsp;" + booking.details[r].kms.toUpperCase()
            + "&nbsp; &nbsp; &nbsp;" + booking.details[r].amount.toUpperCase() + ".00" + "\n");
        if(booking.details[r].extra_info != "")
          prntStrng += ("(" + booking.details[r].extra_info.toUpperCase() + ")" + "\n");
        for(var m=0; m<booking.details[r].extras.length; m++) {
          prntStrng += (booking.details[r].extras[m].extra_name.toUpperCase() + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + booking.details[r].extras[m].extra_value + ".00" + "\n");
        }
    }

    stringTemplate = stringTemplate.replace('{{row_to_print}}', prntStrng);   

    stringTemplate = stringTemplate.replace('{{total_amount_words}}', convertToWord(findTotal(booking.details)));
    stringTemplate = stringTemplate.replace('{{total_amount}}', (findTotal(booking.details) + ".00"));

    conversion({ html: stringTemplate }, function(err, pdf) {
        console.log('E');  
        var output = fs.createWriteStream('./bill.pdf');
        pdf.stream.pipe(output);
        let filename = "invoice";
        filename = encodeURIComponent(filename) + '.pdf';
        var file = fs.readFileSync('./bill.pdf');   
        console.log("Getting in");
        pdf2img.setOptions({
          type: 'png',                                // png or jpg, default jpg 
          density: 600,                               // default 600 
          outputname: 'test',                         // output file name, dafault null (if null given, then it will create image name same as input name) 
          page: null                                  // convert selected page, default null (if null given, then it will convert all pages) 
        });
        
        pdf2img.convert('./output.pdf', function(err, info) {
          if (err) console.log(err)
          else printFile(info.message[0].path);
        });

        console.log("Getting out");        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        pdf.stream.pipe(res);
    });

  });
}
