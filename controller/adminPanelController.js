app.controller('AdminPanelController', function ($scope, $q, $rootScope, PharmacyService) {
  var LOW_STOCK    = 10;
  var today        = new Date();
  var expiryLimit  = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  $scope.loading       = true;
  $scope.stats         = { users: 0, admins: 0, cashiers: 0, revenue: 0, paid: 0, unpaid: 0 };
  $scope.staff         = [];
  $scope.lowStock      = [];
  $scope.expiring      = [];
  $scope.unpaidInvoices = [];
  $scope.customersMap  = {};

  $q.all([
    PharmacyService.getUsers(),
    PharmacyService.getMedicines(),
    PharmacyService.getInvoices(),
    PharmacyService.getCustomers(),
  ]).then(function (results) {
    var users     = results[0].data || [];
    var medicines = results[1].data || [];
    var invoices  = results[2].data || [];
    var customers = results[3].data || [];

    // Customer lookup for unpaid invoice display
    customers.forEach(function (c) { $scope.customersMap[c.customer_id] = c; });

    // User stats
    $scope.stats.users    = users.length;
    $scope.stats.admins   = users.filter(function (u) { return u.role === 'admin';   }).length;
    $scope.stats.cashiers = users.filter(function (u) { return u.role === 'cashier'; }).length;

    // Invoice stats
    $scope.stats.revenue = invoices.reduce(function (sum, inv) {
      return sum + (parseFloat(inv.total_amount) || 0);
    }, 0);
    $scope.stats.paid   = invoices.filter(function (inv) { return inv.payment_status === 'paid';   }).length;
    $scope.stats.unpaid = invoices.filter(function (inv) { return inv.payment_status === 'unpaid'; }).length;

    // Staff performance — one row per user, joined to their invoices via created_by
    $scope.staff = users.map(function (user) {
      var mine = invoices.filter(function (inv) { return inv.created_by === user.id; });
      return {
        name:         user.name,
        email:        user.email,
        role:         user.role,
        invoiceCount: mine.length,
        revenue:      mine.reduce(function (s, inv) { return s + (parseFloat(inv.total_amount) || 0); }, 0),
      };
    }).sort(function (a, b) { return b.revenue - a.revenue; });

    // System alerts
    $scope.lowStock = medicines
      .filter(function (m) { return m.quantity <= LOW_STOCK; })
      .sort(function (a, b) { return a.quantity - b.quantity; });

    $scope.expiring = medicines
      .filter(function (m) {
        if (!m.expiry_date) return false;
        var d = new Date(m.expiry_date);
        return d >= today && d <= expiryLimit;
      })
      .sort(function (a, b) { return new Date(a.expiry_date) - new Date(b.expiry_date); });

    $scope.unpaidInvoices = invoices
      .filter(function (inv) { return inv.payment_status === 'unpaid'; })
      .sort(function (a, b) { return new Date(b.invoice_date) - new Date(a.invoice_date); });

    $scope.loading = false;
  }).catch(function () {
    $scope.loading = false;
  });

  $scope.markPaid = function (inv) {
    PharmacyService.editInvoice(inv.invoice_id, { payment_status: 'paid' }).then(function () {
      inv.payment_status = 'paid';
      $scope.unpaidInvoices = $scope.unpaidInvoices.filter(function (i) {
        return i.invoice_id !== inv.invoice_id;
      });
      $scope.stats.unpaid = Math.max(0, $scope.stats.unpaid - 1);
      $scope.stats.paid  += 1;
      $rootScope.showToast('Marked as paid');
    });
  };
});
