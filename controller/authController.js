app.controller('AuthController', function ($scope,AuthService,PharmacyService) {

    $scope.login = function () {
        AuthService.login($scope.user.email, $scope.user.password).then(
            function (result) {
                console.log('Logged in user:', result.user.id);
                // Redirect to dashboard hereee.
                PharmacyService.getUsers().then(
                    function (response) {
                        const users = response.data;
                        $scope.users = users;
                        const loggedInUser = users.find(user => user.id === result.user.id);
                        if (loggedInUser) {
                            if (loggedInUser.role === 'admin') {
                                console.log(loggedInUser.role);
                                window.location.href = '#!/admin-dashboard';
                            } else if (loggedInUser.role === 'cashier') {
                                console.log(loggedInUser.role);
                                window.location.href = '#!/cashier-dashboard';
                            }
                        } else {
                            console.error('Logged in user not found in database');
                        }
                    }
                );
            },
            function (error) {
                alert('Login failed! ' + error.message);
                console.log('Login error:', error);
            }
        );

    };


    $scope.addUser = function () {
        var meta = {
            role: $scope.user.role,
            name: $scope.user.fullName,
            phone: $scope.user.phone
        };
        console.log('Signup data:', $scope.user, meta);
        AuthService.signup($scope.user.email, $scope.user.password, meta).then(
            function (result) {
                alert('User created successfully!');
                console.log('User Added:', result.user);
            },
            function (error) {
                alert('Failed!' + error.message);
                console.log('Error:', error);
            }
        );
    };
});