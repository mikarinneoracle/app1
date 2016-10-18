app.controller('userController', function($location, $http, $rootScope, $scope, $routeParams)
{

	if ($routeParams.id) {
		$http.get('/users/' + $routeParams.id)
		.success(function(response, err) {
			console.log("Selected user " + $routeParams.id);
			console.log(response['user']);
			$scope.user = response['user'];
		})
		.error(function(response, err) {
			console.log("User not found with id " + $routeParams.id);
		})
	}

	$http.get('/users').success(function(response, err) {
		console.log(response['users']);
		$scope.users = response['users'];
	})
	
});
