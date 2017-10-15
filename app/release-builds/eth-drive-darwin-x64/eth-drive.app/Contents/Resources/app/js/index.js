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

function generateKeyStore(pass){
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
              console.log("fileSaved:)");
          });
      printPubKey(pubKey, name);
    })
}

function printPubKey(key, name) {
    dialog.showSaveDialog({ 
      title: 'Save path for public key',
      properties: ['openDirectory'], 
      defaultPath: name 
    }, function(path) {
      fs.writeFile(path + '.txt', key, (err) => {
        if(err) throw err;
      })
    })
}
// RENDER A LIST OF DRIVES
// drives: list of drives 
function renderDrives(drives) {
  var driveList = "";
  for(var i = 0; i < drives.length; i++) {
    if (drives[i].mountpoints.length > 0) {
      var item = `<li id='${drives[i].device}' className='listItem'>` + drives[i].mountpoints[0].path + "</li>";
      driveList += item;
      item = "";
    }
  }
  $('.drive-list').html(driveList);
}

// FIND DEVICES ON THE LOCAL MACHINE
function findDevices(){
  $('.drive-list').html('<p>Searching for drives...</p>')
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
    shell.exec(`./format-udf.sh -w quick ${selectedDeviceName} 'eth_wallet'`, function(code, stdout, stderr) {
      console.log('Exit code:', code);
      console.log('Program output:', stdout);
      console.log('Program stderr:', stderr);
    });

    //   const child = execFile('./format-udf.sh', ['chmod +x', '-w quick', '-z', `${selectedDrive} 'eth_wallet'`], (error, stdout, stderr) => {
    //     if (error) {
    //       throw error;
    //     }
    //     console.log(stdout);
    //   });
  }
}

// SLOW SCRUB OPTION
function fullScrub() {
  if (selectedDrive !== '') {
    
  }
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



//Lookin 4 drives

// INITIAL SEARCH FOR DRIVES

findDevices();

