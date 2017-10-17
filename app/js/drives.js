const $ = require('jQuery');
const drivelist = require('drivelist');
const fs = require('fs');

// FIND DEVICES ON THE LOCAL MACHINE
function findDrives(){
    $('.drive-list-container').html('<div>Searching for drives...</div>')
    drivelist.list((error, drives) => {   
        if (error) throw error;
        renderDrives(drives);
    });
}

// RENDER A LIST OF DRIVES
// drives: list of drives 
function renderDrives(drives) {
    var driveList = "";
    for(var i = 0; i < drives.length; i++) {
        if (drives[i].mountpoints.length > 0) {
            var item = `<div id='${drives[i].device}' className='listItem'>` + drives[i].mountpoints[0].path + "</div>";
            driveList += item;
            item = "";
        }
    }
    $('.drive-list-container').html(driveList);
}

function driveSelected(item, callback) {
    const result = {};
    result.drive = item.text();
    result.deviceName = item.attr('id').split('/').pop();
    $('.drive-list-container div').removeClass('selected');
    item.addClass('selected');
    calculateFileSize(result.drive, function(res) {
        result.fileSizes = res;
    });
    callback(result);
}

function calculateFileSize(path, callback) {
    const response = { 
        total: 0,
        files: {} 
    };
    const files = fs.readdirSync(path, 'utf8');
    for (let file of files) {
        if(file.charAt(0) !== '.') {
            fs.stat(path + '/' + file, function(err, stats) {
                const fileSizeInBytes = stats["size"];
                const fileSizeInMegabytes = fileSizeInBytes / 1000000.0;
                response.total += fileSizeInMegabytes;
                response.files[file] = fileSizeInMegabytes;
            })
        }
    }
    callback(response);
}

module.exports = {
    findDrives,
    driveSelected
}