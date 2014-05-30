
/**
 * Created by John on 24/05/14.
 */

/*
 Settings
 */
var domain = "http://johnarmstrong.co";
var address = "/SWEN303/";
var fileNames = ["2008-Table1.csv", "2009-Table1.csv", "2010-Table1.csv", "2011-Table1.csv", "2012-Table1.csv", "2013-Table1.csv"];
var fileName = ["2010-Table1.csv", "2009-Table1.csv"];
var countryTeamMapFile = "Teams.csv";
var fileLocations =  setFileLocations(domain, address, fileName);

var teams = [];
var games = [];

/*
Gets and sets all the data from the files. Must be called first to set data.
 */
function invoke() {
    getTeamCountrys(domain, address, countryTeamMapFile);

    //Loop through files then get and set all data
    for (var i = 0; i < fileLocations.length; i++) {
        setData(fileLocations[i], games);
    }
    return cleanData(games);
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
 Use ajax to get data to create and store games
 */
function setData(fileLocation, games) {
    $.ajax({
        url: fileLocation,
        async: false,
        success: function (data){
            var file = parseData(data);
            for(var i = 0; i < file.length; i++) {
                games.push(new Game(file[i]));
            }
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
            } else {
                //BYES in data
            }
            fileDataArray.push(dataParts);
        }
    }
    return fileDataArray;
}

function checkBye(entry) {
    return entry[1].indexOf('byes') >= 0;
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


//--------------------------------- Class and Class functions ----------------------------

/*
 Define a class type for easy access
 */
function Game(data) {
    this.round = data[0];
    this.date = new Date(data[1]);
    this.homeTeam = findTeam(data[2]);
    this.score = data[3].replace(/ /g, '').split("–");
    this.awayTeam = findTeam(data[4]);
    this.venue = data[5];

    //Special case if venue contains a , in it. Happens because we split by ,
    if( data[6] ) {
        this.venue += data[6];
    }
}

Game.prototype.toString = function() {
    return "Round: " + this.round + " | Date: " + this.date + " | Home Team: " + this.homeTeam + " | Score " + this.score
        + " | Away Team: " + this.awayTeam + " | Venue: " + this.venue;
}

function Team(name, country, colorWin, colorLose) {
    this.name = name;
    this.country = country;
    this.colorWin = colorWin;
    this.colorLose = colorLose;
}

//------------------------------------ Useful functions for classes above --------------------------------

/*
Find the maximum home team score in a collection of games
 */
function findMaxHomeScore(games) {
    var max = 0;
    for (var i = 0; i <  games.length; i++) {
        if(games[i].score[0] > max) {
            max = games[i].score[0];
        }
    }
    return max;
}

/*
 Find the maximum away team score in a collection of games
 */
function findMaxAwayScore(games) {
    var max = 0;
    for (var i = 0; i <  games.length; i++) {
        if(games[i].score[1] > max) {
            max = games[i].score[1];
        }
    }
    return max;
}

/*
 Find team object by string 'name'
 */
function findTeam(teamName) {
    for(var i = 0; i < teams.length; i++) {
        if(teams[i].name == teamName) {
            return teams[i];
        }
    }
    return false;
}

/*
Get all teams
 */
function getTeams() {
    return teams;
}
