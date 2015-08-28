(function () {
  'use strict';

  angular
    .module('company-insights')
    .factory('news', news);

  /** @ngInject */
  function news($q, $http) {

    var service = {
      get: function () {
        var deferred = $q.defer();
        var _this = this;
        $http
          .get('/news/@IBM')
          .then(function (res) {
            deferred.resolve(res.data);
          })
          .catch(function (err) {
            deferred.reject();
          });
        return deferred.promise;
      }
    };


    return service;
  }
})();
