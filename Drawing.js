var width  = 1200;
var height = 800;
var padding = 30;
var svg;
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
    //Set hieght of chart
    height = height - $("#main_head").height();

    svg = d3.select("#svg_content_main")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    emptyChart();

}

function emptyChart() {

    yScale = d3.scale.linear()
        .domain([30, findMaxHomeScore(getSeason())])
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
}

function clear() {
    svg.text("");
    $('#legend_list').empty();
    emptyChart();
}

/*
Get data foreach team and then draw chart
 */
function drawMain(options) {

    var data = getData(options);

    updateLegend(options);
    svg.text("");

    yScale = d3.scale.linear()
        .domain([getLowScoreDF(data), getHighScoreDF(data)])
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
        })
        .attr("opacity", 0.6)
        .on("mouseover", function(d) {
            d3.select("#tooltip_d3")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1);
            d3.select("#tooltip_d3")
                .select("#title")
                .text(d.team.name);
            d3.select("#tooltip_d3")
                .select("#round")
                .text("Round: " + d.round);
            d3.select("#tooltip_d3")
                .select("#value")
                .text("Score: " + d.score);
            d3.select("#tooltip_d3")
                .select("#result")
                .text(function() {
                    if(d.result) {
                        return "Result: Won";
                    }
                    else {
                        return "Result: Lost";
                    }
            });
            d3.select("#tooltip_d3")
                .select("#country")
                .text(d.team.country);
            d3.select("#tooltip_d3")
                .select("#year")
                .text(d.year);
        })
        .on("mouseout", function() {
            d3.select("#tooltip_d3")
                .style("opacity", 0);
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

function drawPie(teams, svg, radius) {
    //Exit recursive function if no more teams left to display
    if(teams.length < 1) {
        return;
    }

    var thickness = 30;
    var svgDonut = svg;
    var team = teams.pop();

    if (svgDonut == null) {
        svgDonut = d3.select("#svg_content_donut")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
    }

    var data = getPieData(team);

    var color = d3.scale.ordinal()
        .range([team.colorWin, team.colorLose]);

    var group = svgDonut.append("g")
      .attr("transform", "translate(" + width/2 + ", " + (height - 100)/2 + ")");

    var arc = d3.svg.arc()
      .innerRadius(radius - thickness)
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
                .on("mouseover", function(d) {
                    //Get spelling right
                    var text = " games";
                    if(d.data[1] == 1) {
                        text = " game";
                    }

                    d3.select("#tooltip_d3")
                        .style("left", d3.event.pageX + "px")
                        .style("top", d3.event.pageY + "px")
                        .style("opacity", 1)
                        .select("#value")
                        .text(d.data + text);
                    d3.select("#tooltip_d3")
                        .select("#title")
                        .text(team.name);
                    d3.select("#tooltip_d3")
                        .select("#country")
                        .text(team.country);
        })
                .on("mouseout", function() {
            // Hide the tooltip
            d3.select("#tooltip_d3")
                .style("opacity", 0);
        });

    arcs.append("path")
        .attr("d", arc)
        .attr("id", function(d,i){return "s"+teams.length+i;})
        .attr("fill", function(d, i) {
            return color(d.data[i]);
        });
    

    //Recursively make a call to this method to draw all inner circles until no teams left
    drawPie(teams, svgDonut, (radius - thickness));
 }

function reDrawPie(teams, svg, radius) {
    var svg = d3.select("svg").text("");
    drawPie(teams, svg, radius);
}

function drawBubbleChart(team, svg) {
    var data = getBubbleData(team);
    var svg = svg;

    var scale = d3.scale.linear();
    scale.domain([0, highBubbleData(data)])
        .range([0, 30]);


    var diameter = 750,
        format = d3.format(",d"),
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    if(svg == null) {
        svg = d3.select("#bubble_chart_svg").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .attr("class", "bubble");
    }

    var node = svg.selectAll(".node")
        .data(bubble.nodes({children: data})
            .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on("mouseover", function(d) {
            d3.select("#tooltip_d3")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .select("#value")
                .text("Total Points: " + d.value);
            d3.select("#tooltip_d3")
                .select("#title")
                .text(d.venue);
            d3.select("#tooltip_d3")
                .select("#country")
                .text(d.team);
        })
        .on("mouseout", function() {
            // Hide the tooltip
            d3.select("#tooltip_d3")
                .style("opacity", 0);
        });



    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d) { return color("red"); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            var sub = d.venue.substring(0, d.r / 5);
            if(sub.length < d.venue.length) {
                sub += "...";
            }
            return sub;
        });
}

function reDrawBubble(team) {
    var svg = d3.select("svg").text("");
    drawBubbleChart(team, svg);
}

function drawStackedBar() {
    var data = analyse(seasonYear);
    var labels = [];
    for(var i = 0; i < data.length; i++) {
        labels.push(data[i].team1.name + " vs " + data[i].team2.name);
    }

    var margin = { top: 30, right: 20, bottom: 10, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var z = d3.scale.ordinal().range(["darkblue", "lightblue"]);

    data = data.map(function (d,i) {
        var columnTotal = d.total;
        var dn = [];
        dn[0] = { x: i, y: (d.team1.wins / d.total), y0: 0, label: d.team1.team.name,
            value: "Wins: " + d.team1.wins, country: d.team1.team.country, color: d.team1.team.colorWin};
        dn[1] = { x: i, y: (d.team2.wins / d.total), y0: (d.team1.wins / d.total), label: d.team2.team.name,
            value: "Wins: " + d.team2.wins, country: d.team2.team.country, color: d.team2.team.colorWin}
        return dn;
    });

    var y = d3.scale.linear()
        .domain([0,1])
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".0%"));

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .05)
        .domain(data.map(function(d) {
            return d[0].x}));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svgSt = d3.select("#bar_chart_svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var valgroup = svgSt.selectAll("g.valgroup")
        .data(data)
        .enter().append("svg:g")
        .attr("class", "valgroup");

    var rectSt = valgroup.selectAll("rect")
        .data(function (d) {
            return d; })
        .enter()
        .append("rect")
        .on("mouseover", function(d) {
            d3.select("#tooltip_d3")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                .style("opacity", 1)
                .select("#value")
                .text(
                    d.value);
            d3.select("#tooltip_d3")
                .select("#title")
                .text(d.label);
          d3.select("#tooltip_d3")
                .select("#country")
                .text(github

                    d.country);
        })
        .on("mouseout", function() {
            d3.select("#tooltip_d3")
                .style("opacity", 0);
        })
        .attr("x", function (d) {
            return x(d.x); })
        .attr("width",
            x.rangeBand())
        .attr("y", function (d) {
            return y(d.y0 + d.y); })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y0 + d.y); })
        .style("fill", function (d) {
            return d.color; });
    //TODO: maybe change color

    svgSt.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svgSt.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em");
}