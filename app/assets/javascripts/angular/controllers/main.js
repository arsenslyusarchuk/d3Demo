'use strict';

angular.module('d3Demo')
  .controller('MainCtrl', ['$scope', '$rootScope', 'Main', '$filter', function ($scope, $routeParams, Main, $filter) {
    Main.query(function(data) {
    	$scope.data = $filter('orderBy')(data, 'created_at', true);
    })
  }]);
