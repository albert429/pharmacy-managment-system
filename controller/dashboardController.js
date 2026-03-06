app.controller('DashboardController', function ($scope, PharmacyService) {
  $scope.stats = { medicines: 0, customers: 0, invoices: 0 };
  $scope.recentMedicines = [];

  // Load medicine count + recent medicines
  PharmacyService.getMedicines().then(function (res) {
    var medicines = res.data || [];
    $scope.stats.medicines = medicines.length;
    $scope.recentMedicines = medicines.slice(0, 5);
  });

  // Load customer count
  PharmacyService.getCustomers().then(function (res) {
    $scope.stats.customers = (res.data || []).length;
  });

  // Load invoice count
  PharmacyService.getInvoices().then(function (res) {
    $scope.stats.invoices = (res.data || []).length;
  });
});
