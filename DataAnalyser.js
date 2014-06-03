//Find teams that are within a certain percent score of each other
var diffPercent = 0.025;

/*
 * Find all games that have a percentage difference between scores that is less than the var diffPercent
 */
function analyse(seasonYear) {
    var closeGames = [];
    for(var i = 0; i < seasonYear.length; i ++) {
        var season = seasonYear[i][1];
        for(var j = 0; j < season.length; j ++) {
            var game = season[j];
            var diff = Math.min(game.score[0], game.score[1]) / Math.max(game.score[0], game.score[1]);
            if((diff) > (1 - diffPercent)) {
                closeGames.push(game);
            }
        }
    }
    return findRivals(closeGames);
}

/*
Find all rival teams with each team winning at least 25% of games between them
 */
function findRivals(closeGames) {
    var teamPairs = findPairs(closeGames);
    var stats = [];
    for(var i = 0; i < teamPairs.length; i++) {
          var teamGames = [];
          for(var season = 0; season < seasonYear.length; season++) {
              var seasonTmp = seasonYear[season][1];
              for(var game = 0; game < seasonTmp.length; game++) {
                  if(seasonTmp[game].teamPlaying(teamPairs[i][0]) && seasonTmp[game].teamPlaying(teamPairs[i][1])) {
                    teamGames.push(seasonTmp[game]);
                  }
              }
          }
        //Some analyses on games
        var analysis = analyseGames(teamGames);
        if(checkThreshold(analysis)) {
            stats.push(analysis);
        }
    }
    return stats;
}

function analyseGames(games) {
    var team1 = games[0].homeTeam;
    var team2 = games[0].awayTeam;
    var stats = {total: 0, team1: {team: team1, wins: 0, loses: 0, totalScore: 0}, team2: {team: team2, wins: 0, loses: 0, totalScore: 0}};

    for(var i = 0; i < games.length; i++) {
        var team1Score = games[i].getTeamScore(team1);
        var team2Score = games[i].getTeamScore(team2);
        if(team1Score > team2Score) {
            stats.team1.wins++;
            stats.total++;
            stats.team1.totalScore += team1Score;
            stats.team2.loses++;
        }
        else if(team2Score > team1Score) {
            stats.team2.wins++;
            stats.total++;
            stats.team2.totalScore += team1Score;
            stats.team1.loses++;
        }
    }
    return stats;
}

function checkThreshold(stats) {
    var valid = true;
    if(stats.total < 1 || stats.team1.wins < 1 || stats.team2.wins < 1) {
        return false;
    }
    if((stats.team1.wins / stats.total) < 0.25) {
        valid = false;
    }
    else if((stats.team2.wins / stats.total) < 0.25) {
        valid = false;
    }
    return valid;
}

function findPairs(closeGames) {
    var teamPairs = [[closeGames[0].homeTeam, closeGames[0].awayTeam]];

    for(var i = 0; i < closeGames.length; i++) {
        var game = closeGames[i];
        if(!contains(game.homeTeam, game.awayTeam, teamPairs)) {
            teamPairs.push([game.homeTeam, game.awayTeam]);
        }
    }
    return teamPairs;
}

function contains(team1, team2,  array){
    var result = false;
    for(var i = 0; i < array.length; i++) {
         if(array[i][0].name == team1.name  || array[i][1].name == team1.name) {
             if(array[i][0].name == team2.name  || array[i][1].name == team2.name) {
                 result = true;
             }
         }
    }
    return result;
}


//find all team pairs
    //go through all close games and find all unique pairs
    //
//Check 25% won