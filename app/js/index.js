const { dialog } = require('electron').remote;
const $ = require('jQuery');
const fs = require("fs");
const moment = require('moment');
const drivelist = require('drivelist');
const Wallet = require('ethereumjs-wallet');
const generate = require('ethjs-account').generate;
const Dialogs = require('dialogs')
const chmod = require('chmod');
const shell = require('shelljs');
const { execFile } = require('child_process');

// RELATIVE IMPORTS
const connections = require('./connections');
const generateWallet = require('./generateWallet');
const scrubber = require('./scruber');
const drives = require('./drives');

// STUFFS
var dialogs = Dialogs();
chmod('./format-udf.sh', 777);

// CONSTANTS
let selectedDrive = '';
let selectedDeviceName = '';

// SHUT DOWN NETWORK
switch (process.platform) {
  case 'darwin':
    connections.macWifiOff();  
    break;
  case 'linux':
    break;
  default:
    console.log('platform not supported for disabling connections!')
}

// INITIAL SEARCH FOR DRIVES
drives.findDrives();

// SCRUB DRIVES
function scrub(type) {
    if (selectedDrive !== '') {
        switch (type) {
            case 'fast':
                scrubber.fastScrub(selectedDeviceName);
                break;
            case 'deep':
                scrubber.deepScrub(selectedDeviceName);
                break;
        }
    }
}

// GENERATE KEYSTORE
function generateKeyStore() {
    if (selectedDrive !== '') {
        $('.drive-list-container').html("<p>Generating wallet...</p>");
        generateWallet.generateKeystore(selectedDrive);
    }
}

// SELECTED DRIVE
function handleSelectedDrive(item) { 
    drives.driveSelected(item, function(res) {
        selectedDrive = res.drive;
        selectedDeviceName = res.deviceName;
    });
};

// EVENT HANDLERS
$('#fast-scrub').on('click', function() { scrub('fast') });
$('#full-scrub').on('click', function() { scrub('deep') });
$('#refresh').on('click', function() { drives.findDrives() });
$('#generate-key').on('click', function() { generateKeyStore() });
$('.drive-list-container').on("click", 'p', function() {
    const item = $(this);    
    handleSelectedDrive(item) 
});

