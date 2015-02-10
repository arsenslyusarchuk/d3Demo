// 'use strict';

angular.module('d3Demo').directive('chart2', ["_", function (_) {
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
          var x = d3.time.scale()
          .range([0, width]);

      var bisectDate = d3.bisector(function(d) { return d.created_at;}).left;

      var y = d3.scale.linear()
        .range([height, 0]);

      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(25).tickFormat(d3.time.format("%d-%m-%y"));

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var line = d3.svg.line()
        .x(function(d) { return x(d.created_at);})
        .y(function(d) { return y(d.duration); });

      scope.$watch('chartData', function(nV, oV){

        if(nV){
          var filteredData = [];
          angular.forEach(nV, function(value, key){
            var obj = {created_at: new Date(value.created_at), duration: +value.duration/60 };
            this.push(obj);
          }, filteredData);

          filteredData.sort(function(a, b) {
            return a.created_at - b.created_at;
          });

          function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(filteredData, x0, 1),
                d0 = filteredData[i - 1],
                d1 = filteredData[i],
                d = x0 - d0.created_at > d1.created_at - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.created_at) + "," + y(d.duration) + ")");
            focus.select("text").text(d.duration);
          }

          x.domain(d3.extent(filteredData, function(d) { return d.created_at }));
          y.domain(d3.extent(filteredData, function(d) { return d.duration; }));

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
              .text("Build Time (minutes)");

          svg.append("path")
              .datum(filteredData)
              .attr("class", "line")
              .attr("d", line)

          var focus = svg.append("g")
              .attr("class", "focus")
              .style("display", "none");

          focus.append("circle")
              .attr("r", 4.5);

          focus.append("text")
              .attr("x", 9)
              .attr("dy", ".35em");

          svg.append("rect")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove);
        }
      });
    }
  };
}]);
