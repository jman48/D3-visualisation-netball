
/**
 * Created by John on 24/05/14.
 */

/*
 Settings
 */
var domain = "http://johnarmstrong.co";
var address = "/SWEN303/";
var fileNames = ["2008-Table1.csv", "2009-Table1.csv", "2010-Table1.csv", "2011-Table1.csv", "2012-Table1.csv", "2013-Table1.csv"];
var fileName = [ "2010-Table1.csv"];
var years = ["2008", "2009", "2010", "2011", "2012", "2013"];
var countryTeamMapFile = "Teams.csv";
var fileLocations =  setFileLocations(domain, address, fileNames);

/*
Gets and sets all the data from the files. Must be called first to set data.
 */
function invoke(seasonYear) {
    getTeamCountrys(domain, address, countryTeamMapFile);

    //Loop through files then get and set all data
    for (var i = 0; i < fileLocations.length; i++) {
        setData(fileLocations[i], seasonYear, years[i]);
    }
}

function getTeamCountrys(domain, address, countryTeamMapFile) {
    var fileLocation = domain + address + countryTeamMapFile;
    $.ajax({
        url: fileLocation,
        async: false,
        success: function (data){
            teams = readTeamCountry(data);
        }
    });
}

/*
 Read team country data and create and store team object
 */
function readTeamCountry(data) {
    var teams = [];
    var lines = data.split(/\r\n|\n/);

    for (var i = 0; i < lines.length; i++) {
        var entries = lines[i].split(',');
        teams.push(new Team(entries[0], entries[1], entries[2], entries[3]));
    }
    return teams;
}

/*
 Use ajax to get data to create and store season
 */
function setData(fileLocation, seasonYear, year) {
    $.ajax({
        url: fileLocation,
        async: false,
        success: function (data){
            var file = parseData(data);
            var seasonTmp = [];
            for(var i = 0; i < file.length; i++) {
                seasonTmp.push(new Game(file[i], year));
            }
            seasonYear.push([year, seasonTmp]);
        }
    });
}

/*
 Get the file locations based on settings
 */
function setFileLocations(domain, address, fileNames) {
    var fileLocations = [];
    for (var i = 0; i < fileNames.length; i++) {
        fileLocations[i] = domain + address + fileNames[i];
    }
    return fileLocations;
}

/*
Read the data from a csv file and store it in an array
 */
function parseData(data) {
    var lines = data.split(/\r\n|\n/);
    var fileDataArray = [];

    //Remove headers
    lines.splice(0, 1);

    //Loop through each line and then through each element in that line and add to array
    for (var i = 0; i < lines.length; i++) {
        var dataParts = [];

        //Some tidy up. Remove all "
        var line = lines[i].replace(/"/g, "");

        var entries = line.split(',');
        if(lines[i]) {
            if(!checkBye(lines[i])) {
                for (var j = 0; j < entries.length; j++) {
                    dataParts.push(entries[j]);
                }
                fileDataArray.push(dataParts);
            } else {
                //BYES in data
            }
        }
    }
    return fileDataArray;
}

function checkBye(entry) {
    return (entry[1].indexOf('byes') >= 0 || entry[1].indexOf('BYES') >= 0);
}

//TODO: Change
function cleanData(games) {
    var valid = [];
    for (var i = 0; i <  games.length; i++) {
        if(games[i].score[1] > 0 && games[i].score[0] > 0 ) {
            valid.push(games[i]);
        }
    }
    return valid;
}