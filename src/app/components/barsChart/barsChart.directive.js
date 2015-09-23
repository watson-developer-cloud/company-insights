(function() {
  'use strict';

  angular
    .module('company-insights')
    .directive('barsChart', barsChart);

  /** @ngInject */
  function barsChart() {
    var directive = {
      restrict: 'E',
      link: BarsChart,
      scope: {data: '=chartData'}
    };

    return directive;

    /** @ngInject */
    function BarsChart(scope, element, attrs) {
      scope.$watch('data', function(){
        angular.element(element[0]).empty();
        var chart = d3.select(element[0]);
        chart.append("div").attr("class", "chart")
          .selectAll('div')
          .data(scope.data).enter().append("div")
          .transition().ease("elastic")
          .attr("class", function(d, index) {
            if(index < 1 * (scope.data.length / 5)) {
              return 'open';
            }else if(index < 2 * (scope.data.length / 5)) {
              return 'cons';
            }else if(index < 3 * (scope.data.length / 5)) {
              return 'extr';
            }else if(index < 4 * (scope.data.length / 5)) {
              return 'agre';
            }else {
              return 'emot';
            }
          })
          .style("width", function(d) { return d + "%"; })
          .text(function(d) { return d + "%"; });
        chart.attr("class", "compare-" + scope.data.companies);
      });
    }
  }

})();
