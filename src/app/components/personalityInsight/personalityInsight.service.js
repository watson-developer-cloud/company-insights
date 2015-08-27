(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('personalityInsight', personalityInsight);

  /** @ngInject */
  function personalityInsight($q, $http) {

    var service = {
      analyze: function (name) {
        var deferred = $q.defer();
        var _this = this;
        $http
          .get('/personality_insights/' + name)
          .then(function (res) {
            deferred.resolve(_this.toCharArray(res.data));
          })
          .catch(function (err) {
            deferred.reject();
          });
        return deferred.promise;
      },

      toCharArray: function (data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
          switch (data[i].name) {
            case 'Openness':
              result[0] = Math.floor(data[i].value * 100);
              break;
            case 'Conscientiousness':
              result[1] = Math.floor(data[i].value * 100);
              break;
            case 'Extraversion':
              result[2] = Math.floor(data[i].value * 100);
              break;
            case 'Agreeableness':
              result[3] = Math.floor(data[i].value * 100);
              break;
            case 'Emotional range':
              result[4] = Math.floor(data[i].value * 100);
              break;
          }
        }
        return result;
      }

    };

    return service;
  }
})();
