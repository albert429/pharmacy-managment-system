var app = angular.module('pharmacyApp', ['ngRoute']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/landing',
    })
    .when('/landing', {
      templateUrl: 'views/landing.html',
    })
    .when('/about', {
      templateUrl: 'views/about.html',
    })
    .when('/contact', {
      templateUrl: 'views/contact.html',
      controller: 'ContactController',
    })
    .when('/dashboard', {
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
    .when('/admin_panel', {
      templateUrl: 'views/admin_panel.html',
    })
    .otherwise({
      redirectTo: '/landing',
    });
});
