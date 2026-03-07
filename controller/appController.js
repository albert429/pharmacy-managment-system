app.controller('AppController', function ($scope, $location, $timeout, AuthService) {
  var landingRoutes = ['/landing', '/about', '/contact', '/login'];

  $scope.islandingPage = function () {
    return landingRoutes.indexOf($location.path()) !== -1;
  };

  $scope.currentRole = AuthService.getRole();
  $scope.currentUserName = AuthService.getName();

  // Refresh role/name and highlight active sidebar link on every route change
  $scope.$on('$routeChangeSuccess', function () {
    $scope.currentRole = AuthService.getRole();
    $scope.currentUserName = AuthService.getName();
    $timeout(function () {
      document.querySelectorAll('.sidebar-link').forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === location.hash) {
          link.classList.add('active');
        }
      });
    }, 0);
  });

  $scope.logout = function () {
    AuthService.logout().then(function () {
      $location.path('/login').replace();
    });
  };
});
