const express = require('express');
const escpos = require('escpos');
escpos.Network = require('escpos-network');

const networkDevice = new escpos.Network('localhost', 9002);
const options = { encoding: "GB18030" /* default */ }
// encoding is optional
const printer = new escpos.Printer(device, options);
const router = express.Router();

router.post('/print', (req, res) => {
    const reservation = req.body.reservation;
    const orders = req.body.orders;
    const intcust = req.body.intcust;
    const paymentsMode = req.body.payments_mode;

    networkDevice.open(function(error){
        // example taken from https://github.com/song940/node-escpos
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .text('敏捷的棕色狐狸跳过懒狗')
            .barcode('1234567', 'EAN8')
            .table(["One", "Two", "Three"])
            .tableCustom(
                [
                    { text:"Left", align:"LEFT", width:0.33, style: 'B' },
                    { text:"Center", align:"CENTER", width:0.33},
                    { text:"Right", align:"RIGHT", width:0.33 }
                ],
                { encoding: 'cp857', size: [1, 1] } // Optional
            )
            .qrimage('https://github.com/song940/node-escpos', function(err){
                this.cut();
                this.close();
            });
    });

    res.send({ message: 'Print api' });
});

router.post('/csv', function(req, res) {
    const reservation = req.body.reservation;
    const orders = req.body.orders;
    const intcust = req.body.intcust;
    const paymentsMode = req.body.payments_mode;

    // csv format return

    res.send({ message: 'Csv file' });
});

module.exports = router;
