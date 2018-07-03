angular.module('UserListCtrl', []).controller('UserLisController', function ($scope, $http, $window) {

    if (!document.cookie) {

        $window.location.href = '/';

    } else {

        $http.get('/api/authorization_with_session')
            .then(function (res) {

                if (!res.data.success) {

                    $window.location.href = '/';

                } else {

                    $scope.loading = true;

                }

            });

    }

    $scope.logout = function () {

        $http.get('/api/logout')
            .then(function (res) {

                if (res.data.logout) {

                    $window.location.href = '/';

                }

            });

    };

    $http.get('/api/user-me')
        .then(function (res) {

            console.log(res.data);

        });


});