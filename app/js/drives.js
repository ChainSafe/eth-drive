const $ = require('jQuery');
const drivelist = require('drivelist');

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
            console.log(drives);
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
    callback(result);
}

module.exports = {
    findDrives,
    driveSelected
}