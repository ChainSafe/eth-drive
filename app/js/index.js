const { dialog } = require('electron').remote;
var $ = require('jQuery');
const drivelist = require('drivelist');

var fs = require("fs");
var moment = require('moment');
var Wallet = require('ethereumjs-wallet');
const generate = require('ethjs-account').generate;
var Dialogs = require('dialogs')
var chmod = require('chmod');
var shell = require('shelljs');

const { execFile } = require('child_process');

var dialogs = Dialogs();

chmod('./format-udf.sh', 777);

var selectedDrive = '';
var selectedDeviceName = '';

switch (process.platform) {
  case 'darwin':
    // macWifiOff();  
    break;
  case 'linux':
    break;
  default:
    
}

function generateKeyStore(pass){
  if (selectedDrive !== '') {
    $('.drive-list-container').html("<p>Generating wallet...</p>");
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
                $('.drive-list-container').html("<p>Private keys created!</p>");
            });
        printPubKey(pubKey, name);
      })
    }
}

function printPubKey(key, name) {
    $('.drive-list-container').html("<p>Generating public key... </p>");
    dialog.showSaveDialog({ 
      title: 'Save path for public key',
      properties: ['openDirectory'], 
      defaultPath: name 
    }, function(path) {
      fs.writeFile(path + '.txt', key, (err) => {
        if(err) throw err;
          if (process.platform === 'darwin') {
            macWifiOn();
          }
      })
      $('.drive-list-container').html("<p>Public key generated!</p>" + "\n" + "<p>All done, enjoy your new eth-drive!</p>");
    })
}

// RENDER A LIST OF DRIVES
// drives: list of drives 
function renderDrives(drives) {
  var driveList = "";
  for(var i = 0; i < drives.length; i++) {
    if (drives[i].mountpoints.length > 0) {
      console.log(drives);
      var item = `<p id='${drives[i].device}' className='listItem'>` + drives[i].mountpoints[0].path + "</p>";
      driveList += item;
      item = "";
    }
  }
  $('.drive-list-container').html(driveList);
}

// FIND DEVICES ON THE LOCAL MACHINE
function findDevices(){
  $('.drive-list-container').html('<p>Searching for drives...</p>')
  drivelist.list((error, drives) => {   
    if (error) {
      throw error;
    }
    renderDrives(drives);
  });
}

function deviceSelection(item) {
  selectedDrive = item.text();
  selectedDeviceName = item.attr('id').split('/').pop();
  $('ul li').removeClass('selected');
  item.addClass('selected');
}

// FAST SCRUB OPTION
function fastScrub() {
  if (selectedDrive !== '') {
    $('.drive-list-container').html("Formating....");        
    shell.exec(`sudo ./format-udf.sh -w quick ${selectedDeviceName} 'eth_wallet'`, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
      if (code === 0) {
        $('.drive-list-container').html("<p>Format success!" + "\n" + "Your drive has been unmounted, please unplug and re-insert the drive!</p>");        
      }
    })
  }
}

// SLOW SCRUB OPTION
function fullScrub() {
  if (selectedDrive !== '') {
    shell.exec(`./format-udf.sh -w zero ${selectedDeviceName} 'eth_wallet'`, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
    });
  }
}

function macWifiOff() {
  shell.exec('networksetup -setairportpower en0 off', function(code, stdout, stderr) {
    console.log('Exit code:', code);
    console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
  });
}

function macWifiOn() {
  shell.exec('networksetup -setairportpower en0 on', function(code, stdout, stderr) {
    console.log('Exit code:', code);
    console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
  });
}
// EVENT HANDLERS
$('#fast-scrub').on('click', function() { fastScrub() });
$('#full-scrub').on('click', function() { fullScrub() });
$('#refresh').on('click', function() { findDevices() });
$('#generate-key').on('click', function() { generateKeyStore() });
$("ul").on("click", "li", function(){ 
  var item = $(this);
  deviceSelection(item);
});




// INITIAL SEARCH FOR DRIVES
findDevices();

