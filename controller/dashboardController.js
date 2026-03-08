app.controller('DashboardController', function ($scope, $q, PharmacyService) {
  var LOW_STOCK_THRESHOLD = 10;
  var today = new Date();
  var expiryLimit = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  $scope.stats = {
    totalMedicines: 0,
    lowStock: 0,
    expiringSoon: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  };
  $scope.topMedicines = [];
  $scope.recentInvoices = [];
  $scope.customersMap = {};
  $scope.loading = true;

  $q.all([
    PharmacyService.getMedicines(),
    PharmacyService.getInvoiceItems(),
    PharmacyService.getCustomers(),
    PharmacyService.getInvoices(),
  ])
    .then(function (results) {
      var medicines = results[0].data || [];
      var items = results[1].data || [];
      var customers = results[2].data || [];
      var invoices = results[3].data || [];

      // --- Stats ---
      $scope.stats.totalMedicines = medicines.length;
      $scope.stats.totalCustomers = customers.length;

      $scope.stats.lowStock = medicines.filter(function (m) {
        return m.quantity <= LOW_STOCK_THRESHOLD;
      }).length;

      $scope.stats.expiringSoon = medicines.filter(function (m) {
        if (!m.expiry_date) return false;
        var d = new Date(m.expiry_date);
        return d >= today && d <= expiryLimit;
      }).length;

      $scope.stats.totalRevenue = invoices.reduce(function (sum, inv) {
        return sum + (parseFloat(inv.total_amount) || 0);
      }, 0);

      // --- Customer map (for recent invoices display) ---
      customers.forEach(function (c) {
        $scope.customersMap[c.customer_id] = c;
      });

      // --- Recent invoices (latest 5) ---
      $scope.recentInvoices = invoices
        .slice()
        .sort(function (a, b) {
          return new Date(b.invoice_date) - new Date(a.invoice_date);
        })
        .slice(0, 5);

      // --- Top selling medicines ---
      var medMap = {};
      medicines.forEach(function (m) {
        medMap[m.medicine_id] = m;
      });

      var sold = {};
      items.forEach(function (item) {
        sold[item.medicine_id] =
          (sold[item.medicine_id] || 0) + (item.quantity || 0);
      });

      $scope.topMedicines = Object.keys(sold)
        .map(function (id) {
          return {
            medicine: medMap[id] || { name: 'Unknown', type: '—' },
            unitsSold: sold[id],
          };
        })
        .sort(function (a, b) {
          return b.unitsSold - a.unitsSold;
        })
        .slice(0, 5);

      $scope.maxSold =
        $scope.topMedicines.length > 0 ? $scope.topMedicines[0].unitsSold : 1;

      $scope.loading = false;
    })
    .catch(function () {
      $scope.loading = false;
    });


    // Fetch customers and calculate statistics for all customers, new customers this month and unpaid customers.

   $scope.allCustomers = 0;
   $scope.newCustomersThisMonth = 0;
   $scope.unpaidCustomers = 0;
   
    PharmacyService.getAllCustomers().then(
        function (response) {
            $scope.customers = response.data;
            $scope.allCustomers = $scope.customers.length;
            let currentMonth = new Date().getMonth();
            let currentYear = new Date().getFullYear();
            $scope.newCustomersThisMonth = $scope.customers.filter(customer => {
                let createdAt = new Date(customer.date_registered);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            }).length;

               // handle state
                  PharmacyService.getInvoices().then(function (response) {
                let invoices = response.data;

           // unpaid + partial customers count
  $scope.unpaidCustomers =
  invoices.filter(invoice => invoice.payment_status === 'unpaid').length +
  invoices.filter(invoice => invoice.payment_status === 'partial').length;




            }, function (error) {
                console.error('Error fetching invoices:', error);
            });
       }).catch(function(error) {
    console.error('Error fetching customers:', error);
}).finally(function() {
    $scope.loading = false;
});

});
