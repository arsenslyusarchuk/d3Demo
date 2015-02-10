'use strict';

angular.module('d3Demo')
  .factory('Main', ['$resource', function ($resource) {
    return $resource(
      '/api/v1/main/:id/:action',
      {
        id: '@id'
      },
      {
        'update': { method: 'PUT' }
      }
    );
  }
]);