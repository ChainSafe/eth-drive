const $ = require('jQuery');
const shell = require('shelljs');
var sudo = require('sudo-prompt');
var options = {
  name: 'eth drive'
};
// FAST SCRUB OPTION
function fastScrub(deviceName, callback) {
    $('.drive-list-container').html("<div>Formating....</div>");        
    // shell.exec(`sudo ./format-udf.sh -w quick ${deviceName} 'eth_wallet'`, function(code, stdout, stderr) {
    sudo.exec(`./format-udf.sh -w quick ${deviceName} 'eth_wallet'`, options, function(error, stdout, stderr) {
        console.log('Exit code:', error);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
        // if (code === 0) {
            // $('.filesizes-container').html("<div>" + "\n" + "Your drive has been formatted!</div>");        
            callback(true);
        // } else {
            // callback(false);
        // }
    })
}

// SLOW SCRUB OPTION
function deepScrub(deviceName) {
    if (selectedDrive !== '') {
        shell.exec(`./format-udf.sh -w zero ${deviceName} 'eth_wallet'`, function(code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            if (code === 0) {
                $('.filesizes-container').html("<div>Format success!" + "\n" + "Your drive has been formatted!</div>");        
            }
        });
    }
}

module.exports = {
    fastScrub,
    deepScrub
}