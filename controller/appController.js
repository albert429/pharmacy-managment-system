app.controller('AppController', function ($scope, $location, $rootScope, AuthService) {
  var landingRoutes = ['/landing', '/about', '/contact', '/login'];

  $scope.islandingPage = function () {
    return landingRoutes.indexOf($location.path()) !== -1;
  };

  $scope.currentRole = AuthService.getRole();
  $scope.currentUserName = AuthService.getName();

  // Refresh on every route change (picks up values set during login)
  $rootScope.$on('$routeChangeSuccess', function () {
    $scope.currentRole = AuthService.getRole();
    $scope.currentUserName = AuthService.getName();
  });

  $scope.logout = function () {
    AuthService.logout().then(function () {
      $location.path('/login').replace();
    });
  };
});
