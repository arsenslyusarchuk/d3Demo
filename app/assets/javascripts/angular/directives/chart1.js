'use strict';

angular.module('d3Demo').directive('chart1', ["_", function (_) {
  return {
    restrict: "E",
    scope: {
      'chartData': "="
    },
    link: function (scope, element, attrs) {
      var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 2000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
      var svg = d3.select(element[0]).append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      var formatNumber = d3.format("");

      var y = d3.scale.linear()
          .range([height, 0]);

      var x1 = d3.scale.ordinal();

      var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(formatNumber);

      var color = d3.scale.ordinal()
        .range(["#6BB545", "#D85454"]);

      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Quantity:</strong> <span style='color:red'>" + d.value + "</span>";
        })
      svg.call(tip);
      scope.$watch('chartData', function(nV, oV){
        if(nV){
          var filteredData = [];
          var abnormalDays = [];
          angular.forEach(_.groupBy(nV, function(n) { return moment(n.created_at).format('DD-MM-YYYY') }), function(value, key){
            var obj = {created_at: key, passed: 0, failed: 0};
            for(var i=0;i<value.length;i++){
              if(value[i].summary_status == "passed"){
                obj.passed += 1;
              }else{
                obj.failed += 1;
              }
            }
            this.push(obj);
          }, filteredData);

          var buildResults = d3.keys(filteredData[0]).filter(function(key) { return key !== "created_at"; })

          filteredData.forEach(function(d) {
            //the way how abnormal days are calculated
            if(d.passed/d.failed <= 1){
              abnormalDays.push(d.created_at)
            }
            d.results = buildResults.map(function(name) { return {name: name, value: +d[name]}; });
          });

          x0.domain(filteredData.map(function(d) { return d.created_at; }));
          x1.domain(buildResults).rangeRoundBands([0, x0.rangeBand()]);
          y.domain([0, d3.max(filteredData, function(d) { return d3.max(d.results, function(d) { return d.value; }); })]);
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Quantity");


          var day = svg.selectAll(".day")
              .data(filteredData)
            .enter().append("g")
              .attr("class", "g")
              .attr("transform", function(d) {
                return "translate(" + x0(d.created_at) + ",0)";
              });

          d3.selectAll('g.tick')
            .filter(function(d){ 
              return _.include(abnormalDays, d);
            })
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '3px'})

          day.selectAll("rect")
              .data(function(d) { return d.results; })
            .enter().append("rect")
              .attr("width", x1.rangeBand())
              .attr("x", function(d) { return x1(d.name); })
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return d.value ? height - y(d.value) : 1;})
              .style("fill", function(d) { return color(d.name); })
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);

          var legend = svg.selectAll(".legend")
              .data(buildResults.slice().reverse())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });
        }
      });
    }
  };
}]);
