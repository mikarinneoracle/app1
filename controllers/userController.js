app.controller('userController', function($location, $http, $rootScope, $scope, $routeParams)
{

	$scope.add = function(user) {
		console.log("Adding " + user.name);
		$http.post('/users', user)
		.success(function(response, err) {
			console.log("Added user " + user.name);
			$scope.user = response['user'];
		})
		.error(function(response, err) {
			console.log("Could not add user " + user.name);
		})
	}

	$scope.update = function(user) {
		console.log("Updating " + user.name);
		$http.post('/users', user)
		.success(function(response, err) {
			console.log("Updated user " + user.name);
			$scope.user = response['user'];
		})
		.error(function(response, err) {
			console.log("Could not update user " + user.name);
		})
	}

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
