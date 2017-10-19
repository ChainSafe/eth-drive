const $ = require('jQuery');
var sudo = require('sudo-prompt');
var options = {
  name: 'eth drive'
};
// FAST SCRUB OPTION
function fastScrub(deviceName, callback) {
    $('.drive-list-container').html("<div>Formating....</div>");        
    sudo.exec(`format-udf.sh -w quick ${deviceName} 'eth_wallet'`, options, function(error, stdout, stderr) {
        console.log('Error:', error);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
        if (error === null) {
            $('.filesizes-container').html("<div>Your drive has been formatted!</div>");        
            callback(true);
        } else {
            $('.filesizes-container').html(`<div>An error occured: \n ${error}</div>`);  
            callback(false);
        }
    })
}

// SLOW SCRUB OPTION
function deepScrub(deviceName) {
    if (selectedDrive !== '') {
        sudo.exec(`./format-udf.sh -w zero ${deviceName} 'eth_wallet'`, options, function(error, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            if (error === null) {
                $('.filesizes-container').html("<div>Your drive has been scrubbed!</div>");        
                callback(true);
            } else {
                $('.filesizes-container').html(`<div>An error occured: \n ${error}</div>`);  
                callback(false);
            }
        });
    }
}

module.exports = {
    fastScrub,
    deepScrub
}