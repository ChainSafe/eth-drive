const $ = require('jQuery');
const Dialogs = require('dialogs')
const shell = require('shelljs');

// RELATIVE IMPORTS
const connections = require('./connections');
const generateWallet = require('./generateWallet');
const scrubber = require('./scruber');
const drives = require('./drives');

// CONSTANTS
let os;
let fileSizes;
let selectedDrive = '';
let selectedDeviceName = '';
// SHUT DOWN NETWORK]
switch (process.platform) {
    case 'darwin':
        connections.macWifiOff();  
        os = 'darwin';
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
        if (type === 'fast') {
            scrubber.fastScrub(selectedDeviceName);
        if (type) 'deep':
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
        fileSizes = res.fileSizes;
    });
    $('.filesizes-container').html(`<div>${selectedDeviceName} - ${selectedDrive}</div>`);
    // logFiles();
};

// TODO: make sthis work... loop doesnt work idk...
function logFiles() {
    const files = fileSizes.files;
    let html = '';
    for (var key in files) {
        html += `<p>${key}: ${files[key]} MB</p>`;
    }
    console.log(fileSizes.total);
    html += `<p>Total: ${fileSizes.total} MB</p>`
    $('.filesizes-container').html(html);
}

// EVENT HANDLERS
$('#fast-scrub').on('click', function() { scrub('fast') });
$('#full-scrub').on('click', function() { scrub('deep') });
$('#refresh').on('click', function() { drives.findDrives() });
$('#generate-key').on('click', function() { generateKeyStore() });
$('.drive-list-container').on("click", 'div', function() {
    const item = $(this);    
    handleSelectedDrive(item) 
});

