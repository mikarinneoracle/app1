var app = angular.module('front', [])

.controller('userController', function($http, $scope) {

	$http.get('/users').success(function(response, err) {

		console.log(response['users']);
		$scope.users = response['users'];
	})
});
