angular.module('LoginCtrl', []).controller('LoginController', function ($scope, $http, $window, $timeout) {

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

    $scope.loginModel = {
        email: '',
        password: ''
    };
    $scope.resetPasswordEmail = '';
    $scope.rememberMe = false;

    $scope.login = function () {

        for (var i in $scope.loginModel) {

            if ($scope.loginModel[i] == undefined || $scope.loginModel[i] == '') {

                $scope.loginErr = 'Fill in the ' + i;

                $timeout(function () {

                    $scope.loginErr = '';

                }, 3000);

                return;
            }

        }

        var req = {
            method: 'POST',
            url: '/api/user-login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.loginModel
        };

        $http(req).then(function (res) {

            if (res.data.success) {

                $window.location.href = '/user_list';

                if ($scope.rememberMe) {

                    var date = new Date(new Date().getTime() + 604800 * 1000);
                    document.cookie = "session_id=" + res.data.session_id + "; path=/; expires=" + date.toUTCString();
                    document.cookie = "user_token=" + res.data.user_token + "; path=/; expires=" + date.toUTCString();

                } else {

                    document.cookie = "session_id=" + res.data.session_id;
                    document.cookie = "user_token=" + res.data.user_token;

                }

            } else {

                $scope.loginErr = res.data;

                $timeout(function () {

                    $scope.loginErr = '';

                }, 3000);
            }

        }, function () {
        });

    };

    $scope.resetPassword = function () {

        if ($scope.resetPasswordEmail == '') {

            $scope.loginErr = 'Enter your email for reset password.';

            $timeout(function () {

                $scope.loginErr = '';

            }, 3000);

        } else {

            var req = {
                method: 'POST',
                url: '/api/reset_password_invitation',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {resetPasswordEmail: $scope.resetPasswordEmail}
            };

            $http(req).then(function (res) {

                if (res.data.mailSend) {

                    $scope.loginSuccess = 'Please check your email.';

                    $timeout(function () {

                        $scope.loginSuccess = '';

                    }, 3000);

                } else {

                    $scope.loginErr = res.data;

                    $timeout(function () {

                        $scope.loginErr = '';

                    }, 3000);

                }

            }, function () {
            });

        }

    };

});