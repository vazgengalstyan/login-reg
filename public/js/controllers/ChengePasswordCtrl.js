angular.module('ChengePasswordCtrl', []).controller('ChengePasswordController', function ($scope, $http, $window, $timeout) {

    $scope.chengeModel = {
        password: '',
        confirmPassword: '',
        change_password_token: $window.location.pathname.split('/')[2]
    };

    $scope.chenge = function () {

        for (var i in $scope.chengeModel) {

            if ($scope.chengeModel[i] == undefined || $scope.chengeModel[i] == '') {

                $scope.chengeDanger = 'Fill in the ' + i;

                $timeout(function () {

                    $scope.chengeDanger = '';

                }, 3000);

                return
            }

        }

        if ($scope.chengeModel.password != $scope.chengeModel.confirmPassword) {

            $scope.chengeDanger = 'Confirm password not equal password.';

            $timeout(function () {

                $scope.chengeDanger = '';

            }, 3000);

            return

        }

        var req = {
            method: 'POST',
            url: '/api/chenge_password',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.chengeModel
        };

        $http(req).then(function (res) {

            if (res.data.chenged) {

                $window.location.href = '/'

            } else {

                $scope.chengeDanger = res.data;

                $timeout(function () {

                    $scope.chengeDanger = '';

                }, 3000);

            }

        }, function () {
        });

    };

});