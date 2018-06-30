angular.module('RegisterCtrl', []).controller('RegisterController', function ($scope, $http, $timeout, $window) {

    if (document.cookie) {

        $scope.loading = true;

        $http.get('/api/authorization_with_session')
            .then(function (res) {

                if (res.data.success) {

                    $window.location.href = '/user_list';

                } else {

                    $scope.loading = false;

                }

            });

    }

    $scope.model = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        b_date: ''
    };

    $scope.registration = function () {

        for (var i in $scope.model) {

            if ($scope.model[i] == undefined || $scope.model[i] == '') {

                $scope.regDanger = 'Fill in the ' + i;

                $timeout(function () {

                    $scope.regDanger = '';

                }, 3000);

                return;
            }

        }

        if ($scope.model.password != $scope.model.confirmPassword) {

            $scope.regDanger = 'Confirm password not equal password.';

            $timeout(function () {

                $scope.regDanger = '';

            }, 3000);

            return;

        }

        var req = {
            method: 'POST',
            url: '/api/user-registration',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.model
        };

        $http(req).then(function (res) {

            if (res.data.success) {

                $scope.regSuccess = 'Please check your email.';

                $timeout(function () {

                    $scope.regSuccess = '';

                }, 3000);

            } else {

                $scope.regDanger = res.data;

                $timeout(function () {

                    $scope.regDanger = '';

                }, 3000);

            }

        }, function () {

        });

    };

});