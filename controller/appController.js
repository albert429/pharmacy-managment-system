app.controller(
  'AppController',
  function ($scope, $location, $timeout, AuthService) {
    var landingRoutes = ['/landing', '/about', '/contact', '/login', '/404'];

    $scope.islandingPage = function () {
      return landingRoutes.indexOf($location.path()) !== -1;
    };

    $scope.currentRole = AuthService.getRole();
    $scope.currentUserName = AuthService.getName();
    $scope.currentDate = new Date();

    // Refresh role/name, fix scroll, and highlight active sidebar link on every route change
    $scope.$on('$routeChangeSuccess', function () {
      $scope.currentRole = AuthService.getRole();
      $scope.currentUserName = AuthService.getName();

      // Scroll to top
      window.scrollTo(0, 0);

      // Bootstrap offcanvas leaves overflow:hidden + a backdrop element on the body
      // when the user navigates via a sidebar link before the close animation finishes.
      // Force-clean those leftovers so the page is always scrollable.
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.querySelectorAll('.offcanvas-backdrop').forEach(function (el) { el.remove(); });

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
        $location.path('/landing');
      });
    };
  }
);
