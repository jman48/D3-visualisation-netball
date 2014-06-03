

function printVenue(seasonYear) {
    var venues = [];
    for(var i = 0; i < seasonYear.length; i++) {
        var season = seasonYear[i][1];
        for(var j = 0; j < season.length; j ++) {
            if(venues.indexOf(season[j].venue) < 0) {
                venues.push(season[j].venue);
            }
        }
    }

    for( var i = 0; i < venues.length; i++) {
        document.write(venues[i] + "   |    ");
    }

}
