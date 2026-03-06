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
    .when('/customers', {
      templateUrl: 'views/customers.html',
      controller: 'CustomerController',
    })
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UserController',
    })
    .when('/add-user', {
      templateUrl: 'views/addUser.html',
      controller: 'AuthController',
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController',
    })

    .when('/admin_dashboard', {
      templateUrl: 'views/admin_dashboard.html',
    })
    .when('/cashier_dashboard', {
      templateUrl: 'views/cashier_dashboard.html',
    })
    .otherwise({
      redirectTo: '/',
    });
});
