app.controller('DashboardController', function ($scope, PharmacyService) {
  $scope.today = new Date();
  $scope.stats = {
    medicines: 0,
    customers: 0,
    invoices: 0,
    revenue: 0,
  };
  $scope.recentInvoices = [];
  $scope.lowStockMedicines = [];
  $scope.allMedicines = [];
  $scope.loading = true;

  // Load all dashboard data
  PharmacyService.getMedicines().then(
    function (res) {
      $scope.allMedicines = res.data || [];
      $scope.stats.medicines = $scope.allMedicines.length;

      // Sort by quantity for low stock (simulate with price as fallback)
      $scope.lowStockMedicines = $scope.allMedicines
        .filter(function (m) {
          return m.quantity !== undefined ? m.quantity < 50 : true;
        })
        .slice(0, 5);
    },
    function () {
      $scope.allMedicines = [];
    }
  );

  PharmacyService.getCustomers().then(
    function (res) {
      $scope.stats.customers = (res.data || []).length;
    },
    function () {
      $scope.stats.customers = 0;
    }
  );

  PharmacyService.getInvoices().then(
    function (res) {
      var invoices = res.data || [];
      $scope.stats.invoices = invoices.length;
      $scope.stats.revenue = invoices.reduce(function (sum, inv) {
        return sum + (parseFloat(inv.total_amount) || 0);
      }, 0);

      // Get 5 most recent invoices
      $scope.recentInvoices = invoices
        .sort(function (a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        })
        .slice(0, 5);

      $scope.loading = false;
    },
    function () {
      $scope.stats.invoices = 0;
      $scope.loading = false;
    }
  );
});
