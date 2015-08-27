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
      scope.$watch('data', function(){
        var chart = d3.select(element[0]);
        chart.append("div").attr("class", "chart")
          .selectAll('div')
          .data(scope.data).enter().append("div")
          .transition().ease("elastic")
          .style("width", function(d) { return d + "%"; })
          .text(function(d) { return d + "%"; });
      });
    }
  }

})();
