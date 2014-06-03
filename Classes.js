
/*
 Define a class type for easy access
 */
function Game(data, year) {
    this.round = data[0];
    this.date = new Date(data[1] + " " + year);
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

Game.prototype.getTeamScore = function(team) {
    var score = 0;
    if(this.homeTeam.name == team.name) {
        score = this.score[0];
    }
    else if(this.awayTeam.name == team.name) {
        score = this.score[1];
    }
    return parseInt(score);
}

Game.prototype.teamPlaying = function(team) {
    return (this.homeTeam.name == team.name || this.awayTeam.name == team.name);
}

function Team(name, country, colorWin, colorLose) {
    this.name = name;
    this.country = country;
    this.colorWin = colorWin;
    this.colorLose = colorLose;
}

//------------------------------------ Useful functions for classes above --------------------------------

/*
 Find the maximum home team score in a collection of season
 */
function findMaxHomeScore(seasons) {
    var max = 0;
    for(var j = 0; j < seasons.length; j++) {
        var games = seasons[j];
        for (var i = 0; i <  games.length; i++) {
            if(games[i].score[0] > max) {
                max = games[i].score[0];
            }
        }
    }
    return max;
}

/*
 Find the maximum away team score in a collection of season
 */
function findMaxAwayScore(seasons) {
    var max = 0;
    for(var j = 0; j < seasons.length; j++) {
        var games = seasons[j];
        for (var i = 0; i <  games.length; i++) {
            if(games[i].score[1] > max) {
                max = games[i].score[1];
            }
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