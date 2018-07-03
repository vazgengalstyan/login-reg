angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
    // home page
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'RegisterController'
        })
        .when('/user_list', {
            templateUrl: 'views/user_list.html',
            controller: 'UserLisController'
        })
        .when('/reset_password/:change_password_token', {
            templateUrl: 'views/chenge_password.html',
            controller: 'ChengePasswordController'
        });

    $locationProvider.html5Mode(true);

}]);
