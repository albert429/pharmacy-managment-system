var app = angular.module('pharmacyApp', ['ngRoute']);

// Guard: user must be logged in
app.factory('AuthGuard', function (AuthService, $q, $location) {
  return function () {
    return AuthService.getSession().then(function (session) {
      if (!session) {
        $location.path('/login');
        return $q.reject('not-authenticated');
      }
      return session;
    });
  };
});

// Guard: user must be logged in AND have role === 'admin'
app.factory('AdminGuard', function (AuthService, $q, $location) {
  return function () {
    return AuthService.getSession().then(function (session) {
      if (!session) {
        $location.path('/login');
        return $q.reject('not-authenticated');
      }
      if (AuthService.getRole() !== 'admin') {
        $location.path('/dashboard');
        return $q.reject('not-authorized');
      }
      return session;
    });
  };
});

app.config(function ($routeProvider) {
  $routeProvider
    // Public routes
    .when('/', { redirectTo: '/landing' })
    .when('/landing', { templateUrl: 'views/landing.html' })
    .when('/about',   { templateUrl: 'views/about.html' })
    .when('/contact', { templateUrl: 'views/contact.html', controller: 'ContactController' })
    .when('/login',   { templateUrl: 'views/login.html',   controller: 'AuthController', 
    })


    // Protected routes (any authenticated user)
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
      resolve: { auth: function (AuthGuard) { return AuthGuard(); } },
    })
    .when('/medicines', {
      templateUrl: 'views/medicine.html',
      controller: 'MedicineController',
      resolve: { auth: function (AuthGuard) { return AuthGuard(); } },
    })
    .when('/customers', {
      templateUrl: 'views/customers.html',
      controller: 'CustomerController',
      resolve: { auth: function (AuthGuard) { return AuthGuard(); } },
    })
    .when('/invoices', {
      templateUrl: 'views/invoices.html',
      controller: 'InvoiceController',
      resolve: { auth: function (AuthGuard) { return AuthGuard(); } },
    })

    // Admin-only routes
    .when('/users', {
      templateUrl: 'views/users.html',
      controller: 'UserController',
      resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
    })
    .when('/add-user', {
      templateUrl: 'views/addUser.html',
      controller: 'AuthController',
      resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
    })
      .when('/edit-customer/:id', {
      templateUrl: 'views/editCustomer.html',
      controller: 'CustomerController',
         resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
    })
      .when('/view-customer/:id', {
      templateUrl: 'views/viewCustomer.html',
      controller: 'CustomerController',
         resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
  })
     .when('/add-customer', {
      templateUrl: 'views/addCustomer.html',
      controller: 'CustomerController',
      resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
    })
    .when('/admin_panel', {
      templateUrl: 'views/admin_panel.html',
      controller: 'AdminPanelController',
      resolve: { auth: function (AdminGuard) { return AdminGuard(); } },
    })

    .otherwise({ redirectTo: '/landing' });
});
