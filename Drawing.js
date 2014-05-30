/**
 * Created by John on 25/05/14.
 */
var width  = 1200;
var height = 800;
var padding = 30;
var svg;
var games;
var circles;
var yScale;
var xScale;
var rScale;
var xAxis;
var yAxis;

function initalise() {
    svg = d3.select("#svg_content")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
}

function testChart() {
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
Go through all the games and collect certain data. Store in an array of dataFormats for easy handling
 */
function getData(options) {
    var data = [];

    if(options[0] == "All teams") {
        //TODO: Draw all teams
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

function getHighScore(dataFormatCol) {
    var max = 0;

    for(var i = 0; i < dataFormatCol.length; i++) {
        if(dataFormatCol[i].score > max) {
            max = dataFormatCol[i].score;
        }
    }
    return max;
}


function update() {
    circles.transition()
        .attr("r", function(d) { return rScale(parseInt(d.round) + 5); })
        .attr("fill", function(d) {
            if(d.score[0] > d.score[1]) {
                return "rgba(0, 200, 0, "+1.0+")";
            }
            else if (d.score[0] < d.score[1]) {
                return "rgba(200, 0, 0, "+1.0+")";
            }
            else {
                return "rgba(0, 0, 200, "+1.0+")";
            }
        });
}

function main() {

}