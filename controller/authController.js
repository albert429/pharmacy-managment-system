app.controller('AuthController', function ($scope, $location, AuthService, PharmacyService, $timeout) {

  $scope.login = function () {

    $scope.loginError = null;

    AuthService.login($scope.user.email, $scope.user.password)
      .then(function (result) {

        PharmacyService.getUsers().then(function (response) {

          var loggedInUser = response.data.find(function (u) {
            return u.id === result.user.id;
          });

          if (loggedInUser) {
            AuthService.setRole(loggedInUser.role);
            AuthService.setName(loggedInUser.name);
            $location.path('/dashboard').replace();
          } else {
            $scope.loginError = "User not found in system.";
          }

        });

      })
      .catch(function (error) {

        console.log(error);

        $timeout(function () {
          $scope.loginError = "Invalid email or password.";
        });

      });

  };



    $scope.addUser = function () {
      $scope.addUserError = null;
      $scope.addUserSuccess = false;

      var meta = {
        role: $scope.user.role,
        name: $scope.user.fullName,
        phone: $scope.user.phone,
      };

      $q.when(AuthService.signup($scope.user.email, $scope.user.password, meta)).then(
        function (result) {
          $scope.addUserSuccess = true;
          $scope.user = {};
          console.log('User Added:', result.user);
        },
        function (error) {
          $scope.addUserError = error.message;
        }
      );
    };
  }
);
