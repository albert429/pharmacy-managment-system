app.controller('AuthController', function ($scope, $location, $rootScope, AuthService, PharmacyService) {

  // Redirect already-authenticated users away from login
  AuthService.getSession().then(function (session) {
    if (session) {
      $location.path('/dashboard');
    }
  });

  $scope.login = function () {
    $scope.loginError = null;

    AuthService.login($scope.user.email, $scope.user.password).then(
      function (result) {
        PharmacyService.getUsers().then(function (response) {
          var loggedInUser = response.data.find(function (u) {
            return u.id === result.user.id;
          });

          if (loggedInUser) {
            AuthService.setRole(loggedInUser.role);
            AuthService.setName(loggedInUser.name);
            $location.path('/dashboard');
          } else {
            $scope.loginError = 'User not found in system.';
          }
        });
      },
      function (error) {
        $scope.loginError = error.message;
      }
    );
  };

  $scope.addUser = function () {
    $scope.addUserError = null;
    $scope.addUserSuccess = false;

    var meta = {
      role: $scope.user.role,
      name: $scope.user.fullName,
      phone: $scope.user.phone,
    };

    AuthService.signup($scope.user.email, $scope.user.password, meta).then(
      function (result) {
        $scope.addUserSuccess = true;
        $rootScope.showToast('User created successfully!');
        console.log('User Added:', result.user);
      },
      function (error) {
        $scope.addUserError = error.message;
      }
    );
  };
});
