var seasonYear = [];
var teams = [];
var selectedYear = [ ];

/*
Clears selected years and add just the parameter 'year'
 */
function setSelectedYear(year) {
    selectedYear = [year];
}

/*
Adds the year to selected years
 */
function addSelectedYear(year) {
    if(selectedYear.indexOf(year) < 0) {
        selectedYear.push(year);
    }
}

function removeSelectedYear(year) {
    var index = selectedYear.indexOf(year);
    if(index >= 0) {
        selectedYear.slice(index, 1);
    }
}


/*
 A class to make handling of data easier.
 */
function dataFormat(game, home) {
    this.round = game.round;
    this.year = game.date.getFullYear();
    if(home) {
        this.team = game.homeTeam;
        this.score = game.score[0];
        this.result = game.score[0] > game.score[1];
        this.location = "Home";
    }
    else {
        this.team = game.awayTeam;
        this.score = game.score[1];
        this.result = game.score[1] > game.score[0];
        this.location = "Away";
    }
}

/*
 Go through all the season and collect certain data. Store in an array of dataFormat objects for easy handling
 */
function getData(options) {
    var data = [];
    var seasons = getSeason();
    if(options == null ||options[0] == "All teams") {
        for(var j = 0; j < seasons.length; j++) {
            var season = seasons[j];
            for(var i = 0; i < season.length; i++) {
                for(var j = 0; j < teams.length; j ++) {
                    if(season[i].homeTeam.name == teams[j].name) {
                        //collect for home team
                        data.push(new dataFormat(season[i], true))
                    }
                    else if(season[i].awayTeam.name == teams[j].name) {
                        //collect for away team
                        data.push(new dataFormat(season[i], false))
                    }
                }
            }
        }
    }
    else {
        for(var i = 0; i < seasons.length; i++) {
            var season = seasons[i];
            for(var gameNo = 0; gameNo < season.length; gameNo++) {
                for(var team = 0; team < options.length; team++) {
                    if(season[gameNo].homeTeam.name == options[team]) {
                        //collect for home team
                        data.push(new dataFormat(season[gameNo], true))
                    }
                    else if(season[gameNo].awayTeam.name == options[team]) {
                        //collect for away team
                        data.push(new dataFormat(season[gameNo], false))
                    }
                }
            }
        }
    }
    return data;
}

/*
 Get high score from a collection of dataFormat objects
 */
function getHighScore(seasons) {
    var max = 0;
    for(var j = 0; j < seasons.length; j++) {
        var dataFormatCollection = seasons[j];
        for(var i = 0; i < dataFormatCollection.length; i++) {
            if(dataFormatCollection[i].score > max) {
                max = dataFormatCollection[i].score;
            }
        }
    }
    return max;
}

function getHighScoreDF(dataFormatCol) {
    var max = 0;
    for(var j = 0; j < dataFormatCol.length; j++) {
        var dataFormatCollection = dataFormatCol[j];
        if(dataFormatCollection.score > max) {
            max = dataFormatCollection.score;
        }
    }
    return parseInt(max) + 5;
}

function getLowScoreDF(dataFormatCol) {
    var low = getHighScoreDF(dataFormatCol);
    for(var j = 0; j < dataFormatCol.length; j++) {
        var dataFormatCollection = dataFormatCol[j];
        if(dataFormatCollection.score < low) {
            low = dataFormatCollection.score;
        }
    }
    return parseInt(low) - 5;
}

function getPieData(team) {
    var home = 0;
    var away = 0;

    for(var i = 0; i < seasonYear.length; i++) {
        if(selectedYear.indexOf(seasonYear[i][0]) > -1) {
            var season = seasonYear[i][1];
            for(var gameNo = 0; gameNo < season.length; gameNo++) {
                if(season[gameNo].homeTeam.name == team.name) {
                    //collect for home team
                    if(season[gameNo].score[0] > season[gameNo].score[1])
                        home += 1;
                }
                else if(season[gameNo].awayTeam.name == team.name) {
                    //collect for away team
                    if(season[gameNo].score[1] > season[gameNo].score[0])
                        away += 1;
                }
            }
        }
    }
    return [["Home", home], ["Away", away]];
}

function getSeason() {
    var seasonsTmp = [];
    for(var i = 0; i < seasonYear.length; i++) {
        if(selectedYear.indexOf(seasonYear[i][0]) > -1) {
            seasonsTmp.push(seasonYear[i][1]);
        }
    }
    return seasonsTmp.slice(0);
}

function getBubbleData(team) {
    var seasons = getSeason();
    var venueData = [];
    var venues = [];
    for(var i = 0; i < seasons.length; i++) {
        var season = seasons[i];
        for(var j = 0; j < season.length; j++) {
            var game = season[j];
            if(game.teamPlaying(team)) {
                if(venues.indexOf(game.venue) < 0) {
                    venues.push(game.venue);
                    venueData.push({venue: game.venue, value: game.getTeamScore(team)});
                }
                else {
                    var index = venues.indexOf(game.venue);
                    venueData[index].value += game.getTeamScore(team);
                }
            }
        }
    }
    return venueData;
}

function highBubbleData(data) {
    var max = 0;
    for(var i = 0; i < data.length; i++) {
        if(data[i].value > max) {
            max = data[i].value;
        }
    }
    return max;
}