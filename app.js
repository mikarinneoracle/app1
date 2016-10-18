var app = angular
  .module('app1', [
    'ngRoute',
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'users.html',
        controller: 'userController'
      })
      .when('/:id', {
        templateUrl: 'user.html',
        controller: 'userController'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
