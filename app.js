var app = angular.module('pharmacyApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
    })
    .when('/medicines', {
      templateUrl: 'views/medicine.html',
      controller: 'MedicineController',
    })
    .otherwise({
      redirectTo: '/',
    });
});
