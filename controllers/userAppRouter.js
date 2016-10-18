var app = angular
  .module('usersApp', [
    'ngRoute',
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/users.html',
        controller: 'userController'
      })
      .when('/:id', {
        templateUrl: '../views/user.html',
        controller: 'userController'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
