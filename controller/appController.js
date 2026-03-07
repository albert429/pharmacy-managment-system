app.controller('AppController', function ($scope, $location, $rootScope, $timeout, AuthService) {
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
    // Highlight active sidebar link after Angular renders
    $timeout(function () {
      document.querySelectorAll('.sidebar-link').forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === location.hash) {
          link.classList.add('active');
        }
      });
    }, 0);
  });

  // Toast notification service
  $rootScope.toast = { visible: false, message: '', type: 'success' };
  $rootScope.showToast = function (message, type) {
    $rootScope.toast = { visible: true, message: message, type: type || 'success' };
    $timeout(function () { $rootScope.toast.visible = false; }, 3000);
  };

  $scope.logout = function () {
    AuthService.logout().then(function () {
      $location.path('/landing');
    });
  };
});
