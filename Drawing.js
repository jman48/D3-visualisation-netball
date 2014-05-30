/**
 * Created by John on 25/05/14.
 */
var width  = 1600;
var height = 1000;
var padding = 30;
var svg;
var games;
var circles;
var yScale;
var xScale;
var rScale;
var xAxis;
var yAxis;


/*
Create an empty chart with x and y axis
 */
function initialize() {
    height = height - $("#selector").height();

    svg = d3.select("#svg_content_main")
        .append("svg")
        .attr("width", width-100)
        .attr("height", height);

    yScale = d3.scale.linear()
        .domain([30, findMaxHomeScore(games)])
        .range([height - padding, padding]);
    xScale = d3.scale.linear()
        .domain([0, 17])
        .range([padding, width - padding]);
    rScale = d3.scale.linear()
        .domain([0, 17])
        .range([2, 20]);

    //Axis
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues([0, 5, 10, 15, 17]);
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    //Add axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 170)
        .text("Early Season");

    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 520)
        .text("Mid Season");

    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 860)
        .text("End Season");

    svg.append("text")
        .attr("y", height)
        .attr("x", 1100)
        .text("Finals");

    circles = svg.selectAll("circle")
        .data(cleanData(games))
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.round); })
        .attr("cy", function(d) { return yScale(d.score[0]); })
        .attr("r", 0)
        .attr("fill", "red");
}

/*
Get data foreach team and then draw chart
 */
function drawMain(options) {

    var data = getData(options);
    updateLegend(options);
    svg.text("");

    yScale = d3.scale.linear()
        .domain([30, getHighScore(data)])
        .range([height - padding, padding]);
    xScale = d3.scale.linear()
        .domain([0, 17])
        .range([padding, width - padding]);
    /*
    rScale = d3.scale.linear()
        .domain([0, 17])
        .range([2, 20]);
    */

    //Axis
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues([0, 5, 10, 15, 17]);
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    //Add axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    //Add some text to show season part
    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 170)
        .text("Early Season");

    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 520)
        .text("Mid Season");

    svg.append("text")
        .attr("y", height - 5)
        .attr("x", 860)
        .text("End Season");

    svg.append("text")
        .attr("y", height)
        .attr("x", 1100)
        .text("Finals");

    //Draw!
    circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.round); })
        .attr("cy", function(d) { return yScale(d.score); })
        .attr("r", function(d) {
            //Sized based on whether home game or not
            if(d.location == "Home") {
                return 15;
            }
            else {
                return 7;
            }
        })
        .attr("fill",  function(d) {
            //Color based on whether team wins or not
            if(d.result) {
                return d.team.colorWin;
            }
            else {
                return d.team.colorLose;
            }
        });


}

/*
Update the legend associated with the first chart. Add colors and team names
 */
function updateLegend(options) {
    var list = $("#legend_list").empty();
    for(var i = 0; i < options.length; i++) {
        var li = $('<li/>').text(options[i]);
        var divWin = $("<div>", { class: "legend_div"}).css('background-color',findTeam(options[i]).colorWin);;
        var divLose = $("<div>", { class: "legend_div"}).css('background-color',findTeam(options[i]).colorLose);
        li.append(divWin);
        li.append(divLose);
        $("#legend_list").append(li);
    }
}

/*
Go through all the games and collect certain data. Store in an array of dataFormat objects for easy handling
 */
function getData(options) {
    var data = [];

    if(options == null ||options[0] == "All teams") {
        for(var i = 0; i < games.length; i++) {
            for(var j = 0; j < teams.length; j ++) {
                if(games[i].homeTeam.name == teams[j].name) {
                    //collect for home team
                    data.push(new dataFormat(games[i], true))
                }
                else if(games[i].awayTeam.name == teams[j].name) {
                    //collect for away team
                    data.push(new dataFormat(games[i], false))
                }
            }
        }
    }
    else {
        for(var gameNo = 0; gameNo < games.length; gameNo++) {
            for(var team = 0; team < options.length; team++) {
                if(games[gameNo].homeTeam.name == options[team]) {
                    //collect for home team
                    data.push(new dataFormat(games[gameNo], true))
                }
                else if(games[gameNo].awayTeam.name == options[team]) {
                    //collect for away team
                    data.push(new dataFormat(games[gameNo], false))
                }
            }
        }
    }
    return data;
}

/*
A class to make handling of data easier.
 */
function dataFormat(game, home) {
    this.round = game.round;
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
Get high score from a collection of dataFormat objects
 */
function getHighScore(dataFormatCol) {
    var max = 0;

    for(var i = 0; i < dataFormatCol.length; i++) {
        if(dataFormatCol[i].score > max) {
            max = dataFormatCol[i].score;
        }
    }
    return max;
}


//----------------- Pie chart related stuff ---------------------------------//
function drawPie(teams, svg, radius) {
    //Exit recursive function if on more teams left to display
    if(teams.length < 1) {
        return;
    }

    var svgDonut = svg;
    var team = teams.pop();

    if (svgDonut == null) {
        svgDonut = d3.select("#svg_content_donut")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    var data = getBetterData(team);

    var color = d3.scale.ordinal()
        .range([team.colorWin, team.colorLose]);

    var group = svgDonut.append("g")
      .attr("transform", "translate(" + width/2 + ", " + height/2 + ")");

    var arc = d3.svg.arc()
      .innerRadius(radius - 45)
      .outerRadius(radius)

    var pie = d3.layout.pie()
        .value(function(d) {
            return d[1];
        });

    var arcs = group.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function(d){
            //Get spelling right!
            var text = " games";
            if(d.data[1] == 1) {
                text = " game";
            }

            d3.select("#tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .select("#value")
                .text(d.data + text);
            d3.select("#tooltip")
                .select("#title")
                .text(team.name);
        })
        .on("mouseout", function() {
            // Hide the tooltip
            d3.select("#tooltip")
                .style("opacity", 0);
        });

    arcs.append("path")
        .attr("d", arc)
        .attr("id", function(d,i){return "s"+teams.length+i;})
        .attr("fill", function(d) {
            return color(d.data[1]);
        });

    /*
    arcs.append("text")
        .style("font-size",18)
        .attr("dy",function(d,i){return 20;})
        .attr("alignment-baseline","middle")
        .append("textPath")
        //.attr("textLength",function(d,i){return 90-i*5 ;})
        .attr("xlink:href",function(d,i){return "#s"+teams.length+i;})
        //.attr("startOffset",function(d,i){return 3/20;})
        .text(function(d){return team.name;})


    arcs.append("text")
        .attr("transform", function (d) {
            return "translate( " + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(function(d) {
            return d.data;
        })
*/
    //Recursively make a call to this method to draw all inner circles until no teams left
    drawPie(teams, svgDonut, (radius - 45));
 }

function getBetterData(team) {
    var data = getData()
    var home = 0;
    var away = 0;

    for(var gameNo = 0; gameNo < games.length; gameNo++) {
            if(games[gameNo].homeTeam.name == team.name) {
                //collect for home team
                if(games[gameNo].score[0] > games[gameNo].score[1])
                    home += 1;
            }
            else if(games[gameNo].awayTeam.name == team.name) {
                //collect for away team
                if(games[gameNo].score[1] > games[gameNo].score[0])
                    away += 1;
            }
    }
    return [["Home", home], ["Away", away]];
}