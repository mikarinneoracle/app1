app.controller('userController', function($location, $http, $rootScope, $scope, $routeParams)
{

	$scope.add = function(user) {
		$http.post('/users', user)
		.success(function(response, err) {
			$scope.user = response['user'];
			var location = '/' + $scope.user.id;
			$location.path(location).search('o=new');
			return;
		})
		.error(function(response, err) {
			console.log("Could not add user " + user.name);
			return;
		})
	}

	$scope.update = function(user) {
		$http.post('/users', user)
		.success(function(response, err) {
			$scope.user = response['user'];
			var location = '/';
			$location.path(location);
			return;
		})
		.error(function(response, err) {
			console.log("Could not update user " + user.name);
			return;
		})
	}

	$scope.removePhoto = function(user) {
		$http.delete('/photos/' + user.id)
		.success(function(response, err) {
			console.log("removed photo");
			var location = '/';
			$location.path(location);
			return;
		})
		.error(function(response, err) {
			console.log("Could not remove photo " + user.name);
			return;
		})
	}

	if ($routeParams.id) {
		$http.get('/users/' + $routeParams.id)
		.success(function(response, err) {
			$scope.user = response['user'];
			return;
		})
		.error(function(response, err) {
			console.log("User not found with id " + $routeParams.id);
			return;
		})
	}

	if ($routeParams.o) {
		$scope.message = "Please upload a user photo.";
	}

	$http.get('/users').success(function(response, err) {
		console.log(response['users']);
		$scope.users = response['users'];
	})

});
