(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('news', news);

  /** @ngInject */
  function news($q, $http) {

    var service = {
      get: function (id) {
        var deferred = $q.defer();
        $http
          .get('/api/news/' + id)
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
