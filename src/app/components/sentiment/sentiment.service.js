(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('sentiment', sentiment);

  /** @ngInject */
  function sentiment($q, $http) {

    var service = {
      get: function (id) {
        var deferred = $q.defer();
        $http
          .get('/api/mentions_sentiment/' + id)
          .then(function (res) {
            deferred.resolve(res.data);
          })
          .catch(function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      }
    };


    return service;
  }
})();
