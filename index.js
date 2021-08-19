const escpos = require('escpos');
escpos.Network = require('escpos-network');

const networkDevice = new escpos.Network('localhost', 3000);
