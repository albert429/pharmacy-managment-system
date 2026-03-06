app.controller("AppController", function ($scope, $location) {
  var landingRoutes = ["/landing", "/about", "/contact"];

  $scope.islandingPage = function () {
    return landingRoutes.indexOf($location.path()) !== -1;
  };
});
