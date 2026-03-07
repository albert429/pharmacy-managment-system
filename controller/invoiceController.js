app.controller(
  'InvoiceController',
  function ($scope, $q, PharmacyService, AuthService) {
    $scope.invoices = [];
    $scope.customers = [];
    $scope.medicines = [];
    $scope.medicinesMap = {};
    $scope.customersMap = {};
    $scope.search = '';
    $scope.filterStatus = '';
    $scope.loading = true;
    $scope.submitting = false;
    $scope.submitError = null;

    // ── Form state ─────────────────────────────────────────────────────────────
    $scope.newInvoice = {
      customer_id: null,
      discount: 0,
      payment_status: 'unpaid',
      items: [],
    };
    $scope.newItem = {
      medicine_id: null,
      quantity: 1,
      unit_price: 0,
      maxQty: 0,
    };

    // ── Load data ───────────────────────────────────────────────────────────────
    $scope.loadInvoices = function () {
      PharmacyService.getInvoices().then(function (res) {
        $scope.invoices = (res.data || []).sort(function (a, b) {
          return new Date(b.invoice_date) - new Date(a.invoice_date);
        });
        $scope.loading = false;
      });
    };

    $q.all([
      PharmacyService.getCustomers(),
      PharmacyService.getMedicines(),
    ]).then(function (results) {
      $scope.customers = results[0].data || [];
      $scope.medicines = results[1].data || [];

      $scope.customers.forEach(function (c) {
        $scope.customersMap[c.customer_id] = c;
      });
      $scope.medicines.forEach(function (m) {
        $scope.medicinesMap[m.medicine_id] = m;
      });
    });

    $scope.loadInvoices();

    // Get current user id for created_by
    AuthService.getCurrentUser().then(function (user) {
      $scope.currentUserId = user ? user.id : null;
    });

    // ── Item helpers ────────────────────────────────────────────────────────────
    $scope.onMedicineSelect = function () {
      var med = $scope.medicinesMap[$scope.newItem.medicine_id];
      if (med) {
        $scope.newItem.unit_price = med.unit_price;
        $scope.newItem.maxQty = med.quantity;
      }
    };

    $scope.addItem = function () {
      var med = $scope.medicinesMap[$scope.newItem.medicine_id];
      if (!med || !$scope.newItem.quantity || $scope.newItem.quantity <= 0)
        return;
      if ($scope.newItem.quantity > med.quantity) {
        $scope.itemError =
          'Quantity exceeds available stock (' + med.quantity + ')';
        return;
      }
      $scope.itemError = null;

      // Merge if medicine already in list
      var existing = $scope.newInvoice.items.find(function (i) {
        return i.medicine_id === med.medicine_id;
      });
      if (existing) {
        existing.quantity += parseInt($scope.newItem.quantity);
      } else {
        $scope.newInvoice.items.push({
          medicine_id: med.medicine_id,
          name: med.name,
          unit_price: med.unit_price,
          quantity: parseInt($scope.newItem.quantity),
        });
      }
      $scope.newItem = {
        medicine_id: null,
        quantity: 1,
        unit_price: 0,
        maxQty: 0,
      };
    };

    $scope.removeItem = function (index) {
      $scope.newInvoice.items.splice(index, 1);
    };

    // ── Totals ──────────────────────────────────────────────────────────────────
    $scope.lineTotal = function (item) {
      return (item.unit_price || 0) * (item.quantity || 0);
    };

    $scope.subtotal = function () {
      return $scope.newInvoice.items.reduce(function (sum, item) {
        return sum + $scope.lineTotal(item);
      }, 0);
    };

    $scope.grandTotal = function () {
      return Math.max(
        0,
        $scope.subtotal() - (parseFloat($scope.newInvoice.discount) || 0)
      );
    };

    // ── Submit invoice ──────────────────────────────────────────────────────────
    $scope.submitInvoice = function () {
      if (
        !$scope.newInvoice.customer_id ||
        $scope.newInvoice.items.length === 0
      )
        return;

      $scope.submitting = true;
      $scope.submitError = null;

      var invoicePayload = {
        customer_id: parseInt($scope.newInvoice.customer_id),
        created_by: $scope.currentUserId,
        invoice_date: new Date().toISOString(),
        total_amount: $scope.grandTotal(),
        discount: parseFloat($scope.newInvoice.discount) || 0,
        payment_status: $scope.newInvoice.payment_status,
      };

      var savedItems = angular.copy($scope.newInvoice.items);

      PharmacyService.addInvoice(invoicePayload)
        .then(function (res) {
          var invoiceId = res.data[0].invoice_id;

          var itemsPayload = savedItems.map(function (item) {
            return {
              invoice_id: invoiceId,
              medicine_id: item.medicine_id,
              quantity: item.quantity,
              unit_price: item.unit_price,
            };
          });
          return PharmacyService.addInvoiceItems(itemsPayload);
        })
        .then(function () {
          // Deduct stock
          var updates = savedItems.map(function (item) {
            var med = $scope.medicinesMap[item.medicine_id];
            var newQty = (med ? med.quantity : 0) - item.quantity;
            return PharmacyService.editMedicine(item.medicine_id, {
              quantity: Math.max(0, newQty),
            });
          });
          return $q.all(updates);
        })
        .then(function () {
          // Refresh medicines map after stock deduction
          return PharmacyService.getMedicines();
        })
        .then(function (res) {
          $scope.medicinesMap = {};
          (res.data || []).forEach(function (m) {
            $scope.medicinesMap[m.medicine_id] = m;
          });

          $scope.submitting = false;
          $scope.resetForm();
          bootstrap.Modal.getInstance(
            document.getElementById('invoiceModal')
          ).hide();
          $scope.loadInvoices();
        })
        .catch(function (err) {
          $scope.submitting = false;
          $scope.submitError = 'Failed to create invoice. Please try again.';
          console.error(err);
        });
    };

    // ── Update payment status ───────────────────────────────────────────────────
    $scope.markPaid = function (inv) {
      PharmacyService.editInvoice(inv.invoice_id, {
        payment_status: 'paid',
      }).then(function () {
        inv.payment_status = 'paid';
      });
    };

    // ── Modal helpers ───────────────────────────────────────────────────────────
    $scope.resetForm = function () {
      $scope.newInvoice = {
        customer_id: null,
        discount: 0,
        payment_status: 'unpaid',
        items: [],
      };
      $scope.newItem = {
        medicine_id: null,
        quantity: 1,
        unit_price: 0,
        maxQty: 0,
      };
      $scope.itemError = null;
      $scope.submitError = null;
    };

    $scope.openCreate = function () {
      $scope.resetForm();
      new bootstrap.Modal(document.getElementById('invoiceModal')).show();
    };
  }
);
