const express = require('express');
var nodemailer = require('nodemailer');
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const device = new escpos.Network('localhost'); // Network('host', port)
const options = { encoding: "GB18030" /* default */ }
// encoding is optional
const printer = new escpos.Printer(device, options);
const router = express.Router();
const tableCustomEncoding =  {
    encoding: 'cp857',
    size: [1, 1]
};

router.post('/print', (req, res) => {
    const corporation = req.body.corporation;
    const siret = req.body.siret;
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
            .text(`${'Sri Ganesha'}`)
            .text(`SIRET : \n ${'67 Avenue de la Valeuse, 14200 Hérouville Saint-Clair'} `)
            .text('MERCI DE MANGER CHEZ NOUS')
            .tableCustom([
                {text: '2 x Fish Pakora 5,00€', align: 'LEFT', width: 0.5, style: 'B'},
                {text: '10,00€', align: 'RIGHT', width: 0.5, style: 'B'}
            ],tableCustomEncoding)
            .tableCustom([
                {text: '2 x Fish Pakora 5,00€', align: 'LEFT', width: 0.5, style: 'B'},
                {text: '10,00€', align: 'RIGHT', width: 0.5, style: 'B'}
            ],tableCustomEncoding)
            .table(["TOTAL", "10,00€"])
            .text('Payments')
            .tableCustom([
                {text: 'CB', align: 'LEFT', width: 0.5, style: 'B'},
                {text: '45€', align: 'RIGHT', width: 0.5, style: 'B'}
            ],  tableCustomEncoding)
            .tableCustom([
                {text: 'Ticket R', align: 'LEFT', width: 0.5, style: 'B'},
                {text: '45€', align: 'RIGHT', width: 0.5, style: 'B'}
            ],  tableCustomEncoding)
            .table(["TOTAL", "90€"]);
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
