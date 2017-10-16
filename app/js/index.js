const $ = require('jQuery');
const Dialogs = require('dialogs')
const shell = require('shelljs');

// RELATIVE IMPORTS
const connections = require('./connections');
const generateWallet = require('./generateWallet');
const scrubber = require('./scruber');
const drives = require('./drives');

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

