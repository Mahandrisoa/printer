const express = require('express');
var nodemailer = require('nodemailer');
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const device = new escpos.Network('localhost'); // Network('host', port)
const options = { encoding: "GB18030" /* default */ }
// encoding is optional
const printer = new escpos.Printer(device, options);
const router = express.Router();

router.post('/print', (req, res) => {
    const reservation = req.body.reservation;
    const orders = req.body.orders;
    const intcust = req.body.intcust;
    const paymentsMode = req.body.payments_mode;

    device.open(function(error){
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .barcode('1234567', 'EAN8')
            .table(["One", "Two", "Three"])
            .tableCustom(
                [
                    { text:"Left", align:"LEFT", width:0.33, style: 'B' },
                    { text:"Center", align:"CENTER", width:0.33},
                    { text:"Right", align:"RIGHT", width:0.33 }
                ],
                { encoding: 'cp857', size: [1, 1] }
            )
    });

    res.send({ message: 'Print api' });
});

var mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'name@mail.com', // TO BE CHANGED
      pass: 'password' // TO BE CHANGED
    }
});
  
router.post('/csv', function(req, res) {
    var mailOptions = {
        from: 'name@mail.com', // TO BE CHANGED
        to: req.body.email,
        subject: 'Table Manager Fichier',
        html: '<h1>Bonjour,</h1><p>Veuillez trouver ci-joint le fichier que vous avez exporté</p><br/><p>Cordialement,</p><p>Table Manager</p>',
        attachments: [
            {   
                filename: req.body.filename,
                content: req.body.csv,
                contentType: 'application/csv'
            }
        ]
    };

    mail.sendMail(mailOptions, function(error, info){
        if (error) {
            res.json({
                "status": false,
                "message": error
            })
        } else {
            res.json({
                "status": true,
                "message": "Email sent : " + info.response
            });
        }
    });
});

module.exports = router;
