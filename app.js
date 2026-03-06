var app = angular.module("pharmacyApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/landing", {
      templateUrl: "views/landing.html",
    })
    .when("/about", {
      templateUrl: "views/about.html",
    })
    .when("/contact", {
      templateUrl: "views/contact.html",
      controller: "ContactController",
    })
    .when("/dashboard", {
      templateUrl: "views/dashboard.html",
    })
    .when("/medicines", {
      templateUrl: "views/medicine.html",
      controller: "MedicineController",
    })
    .otherwise({
      redirectTo: "/landing",
    });
});
