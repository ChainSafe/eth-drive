var shell = require('shelljs');

function macWifiOn() {
    shell.exec('networksetup -setairportpower en0 on', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
    });
}

function macWifiOff() {
    shell.exec('networksetup -setairportpower en0 off', function(code, stdout, stderr) {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
    });
}

module.exports = { 
    macWifiOn,
    macWifiOff
};