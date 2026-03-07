app.controller("AppController", function ($scope, $location) {
  var landingRoutes = ["/landing", "/about", "/contact", "/login"];

  $scope.islandingPage = function () {
    return landingRoutes.indexOf($location.path()) !== -1;
  };
});
