(function() {
  'use strict';

  angular
    .module('company-insights')
    .directive('barsChart', barsChart);

  /** @ngInject */
  function barsChart($log) {
    var directive = {
      restrict: 'E',
      link: BarsChart,
      scope: {data: '=chartData'}
    };

    return directive;

    /** @ngInject */
    function BarsChart(scope, element, attrs) {
      var chart = d3.select(element[0]);
      //to our original directive markup bars-chart
      //we add a div with out chart stling and bind each
      //data entry to the chart
      chart.append("div").attr("class", "chart")
        .selectAll('div')
        .data(scope.data).enter().append("div")
        .transition().ease("elastic")
        .style("width", function(d) { return d + "%"; })
        .text(function(d) { return d + "%"; });
    }
  }

})();
