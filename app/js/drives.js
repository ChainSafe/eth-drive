const $ = require('jQuery');
const drivelist = require('drivelist');
const fs = require('fs');

// FIND DEVICES ON THE LOCAL MACHINE
function findDrives(){
    $('.drive-list-container').html('<p>Searching for drives...</p>')
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
            var item = `<p id='${drives[i].device}' className='listItem'>` + drives[i].mountpoints[0].path + "</p>";
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
    $('.drive-list-container p').removeClass('selected');
    item.addClass('selected');
    calculateFileSize(result.drive);
    callback(result);
}

function calculateFileSize(path) {
    const files = fs.readdirSync(path, 'utf8');
    const response = [];
    for (let file of files) {
        if(file.charAt(0) !== '.') {
            console.log(path + file)
            fs.stat(path + file, (err, stats) => {
                console.log(stats);
                // var fileSizeInBytes = stats["size"]
                //Convert the file size to megabytes (optional)
                // var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
                // console.log('mg', fileSizeInMegabytes);
            })
        }
    }
}

module.exports = {
    findDrives,
    driveSelected
}