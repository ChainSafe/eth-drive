const { dialog } = require('electron').remote;
const $ = require('jQuery');
const fs = require("fs");
const moment = require('moment');
const drivelist = require('drivelist');
const Wallet = require('ethereumjs-wallet');
const generate = require('ethjs-account').generate;
const Dialogs = require('dialogs')
var dialogs = Dialogs();

// RELATIVE IMPORTS
var connections = require('./connections');

function generateKeystore(selectedDrive) {
    dialogs.prompt('Password for ETH wallet. Remember it because it cannot be recovered!', function(pass) {      
        var wallet = generate('892h@fsdf11ks8sk^2h8s8shfs.jk39hsoi@hohskd');
        var privKey = wallet.privateKey;
        var pubKey = wallet.address;
        var splitKey = privKey.split("");
        splitKey.splice(0,2);
        var finalKey = splitKey.join("");
        var key = Buffer.from(finalKey, 'hex');
        var wallet = Wallet.fromPrivateKey(key);
        var utc = wallet.toV3String(pass);
        var date = moment().format();
        var pubKey = pubKey;
        var name = selectedDrive + '/' + 'UTC' + date + '--' + pubKey;
        fs.writeFile(name, utc, (err) => {
        if (err) throw err;
            $('.filesizes-container').html("<p>Private key created!</p>");
        });
        printPubKey(key, name);
    })
}

function printPubKey(key, name) {
    $('.file-sizes-container').html("<p>Generating public key... </p>");
    dialog.showSaveDialog({ 
        title: 'Save path for public key.',
        properties: ['openDirectory'], 
        defaultPath: name 
    }, function(path) {
        fs.writeFile(path + '.txt', key, (err) => {
            if(err) throw err;
            if (process.platform === 'darwin') {
                connections.macWifiOn();
            }
        })
        $('.filesizes-container').html("<p>Public key generated!</p>" + "\n" + "<p>All done, enjoy your new eth-drive!</p>");
    })
}

module.exports = {
    generateKeystore,
}