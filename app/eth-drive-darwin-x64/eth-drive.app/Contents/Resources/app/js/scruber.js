const $ = require('jQuery');
const shell = require('shelljs');

// FAST SCRUB OPTION
function fastScrub(deviceName, callback) {
    $('.drive-list-container').html("Formating....");        
    shell.exec(`sudo ./format-udf.sh -w quick ${deviceName} 'eth_wallet'`, function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
        if (code === 0) {
            $('.drive-list-container').html("<p>Format success!" + "\n" + "Your drive has been unmounted, please unplug and re-insert the drive!</p>");        
            callback(true);
        } else {
            callback(false);
        }
    })
}

// SLOW SCRUB OPTION
function deepScrub(deviceName) {
    if (selectedDrive !== '') {
        shell.exec(`./format-udf.sh -w zero ${deviceName} 'eth_wallet'`, function(code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            if (code === 0) {
                $('.drive-list-container').html("<p>Format success!" + "\n" + "Your drive has been unmounted, please unplug and re-insert the drive!</p>");        
            }
        });
    }
}

module.exports = {
    fastScrub,
    deepScrub
}