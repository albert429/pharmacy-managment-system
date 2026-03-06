app.controller('MedicineController', function ($scope, PharmacyService) {
  $scope.medicines = [];
  $scope.categories = [];
  $scope.formMedicine = {};
  $scope.deletingMedicine = {};
  $scope.isEditing = false;
  $scope.saving = false;
  $scope.loading = true;

  // Search & filter
  $scope.searchQuery = '';
  $scope.filterCategory = '';
  $scope.filterStock = '';

  // Sorting
  $scope.sortField = 'id';
  $scope.sortReverse = false;

  // ── Data Loading ────────────────────────────────

  $scope.getMedicines = function () {
    $scope.loading = true;
    PharmacyService.getMedicines().then(
      function (response) {
        $scope.medicines = response.data || [];
        $scope.extractCategories();
        $scope.loading = false;
      },
      function (error) {
        console.error('Error fetching medicines:', error);
        $scope.loading = false;
      }
    );
  };

  $scope.extractCategories = function () {
    var catMap = {};
    $scope.medicines.forEach(function (m) {
      if (m.category) catMap[m.category] = true;
    });
    $scope.categories = Object.keys(catMap).sort();
  };

  // ── Sorting ─────────────────────────────────────

  $scope.sortBy = function (field) {
    if ($scope.sortField === field) {
      $scope.sortReverse = !$scope.sortReverse;
    } else {
      $scope.sortField = field;
      $scope.sortReverse = false;
    }
  };

  $scope.getSortIcon = function (field) {
    if ($scope.sortField !== field) return 'bi-chevron-expand';
    return $scope.sortReverse ? 'bi-chevron-up' : 'bi-chevron-down';
  };

  // ── Filtering ───────────────────────────────────

  $scope.searchFilter = function (med) {
    // Text search
    if ($scope.searchQuery) {
      var q = $scope.searchQuery.toLowerCase();
      var match =
        (med.name && med.name.toLowerCase().indexOf(q) !== -1) ||
        (med.category && med.category.toLowerCase().indexOf(q) !== -1) ||
        (med.manufacturer && med.manufacturer.toLowerCase().indexOf(q) !== -1) ||
        (med.dosage && med.dosage.toLowerCase().indexOf(q) !== -1);
      if (!match) return false;
    }

    // Category filter
    if ($scope.filterCategory && med.category !== $scope.filterCategory) {
      return false;
    }

    // Stock filter
    if ($scope.filterStock) {
      var qty = med.quantity || 0;
      if ($scope.filterStock === 'in' && qty <= 50) return false;
      if ($scope.filterStock === 'low' && (qty > 50 || qty <= 0)) return false;
      if ($scope.filterStock === 'out' && qty > 0) return false;
    }

    return true;
  };

  // ── Stat Helpers ────────────────────────────────

  $scope.getInStockCount = function () {
    return $scope.medicines.filter(function (m) {
      return (m.quantity || 0) > 50;
    }).length;
  };

  $scope.getLowStockCount = function () {
    return $scope.medicines.filter(function (m) {
      var q = m.quantity || 0;
      return q > 0 && q <= 50;
    }).length;
  };

  $scope.getCategoryCount = function () {
    return $scope.categories.length;
  };

  $scope.isExpiringSoon = function (date) {
    if (!date) return false;
    var diff = new Date(date) - new Date();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000; // 90 days
  };

  // ── Modal Helpers ───────────────────────────────

  function getModal(id) {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
  }

  $scope.openAddModal = function () {
    $scope.isEditing = false;
    $scope.formMedicine = {};
    getModal('medicineModal').show();
  };

  $scope.openEditModal = function (med) {
    $scope.isEditing = true;
    $scope.formMedicine = angular.copy(med);
    getModal('medicineModal').show();
  };

  $scope.confirmDelete = function (med) {
    $scope.deletingMedicine = med;
    getModal('deleteModal').show();
  };

  // ── CRUD Operations ─────────────────────────────

  $scope.saveMedicine = function () {
    $scope.saving = true;

    if ($scope.isEditing) {
      var id = $scope.formMedicine.id;
      var data = angular.copy($scope.formMedicine);
      delete data.id;

      PharmacyService.editMedicine(id, data).then(
        function () {
          // Update local list
          for (var i = 0; i < $scope.medicines.length; i++) {
            if ($scope.medicines[i].id === id) {
              angular.extend($scope.medicines[i], $scope.formMedicine);
              break;
            }
          }
          $scope.extractCategories();
          $scope.saving = false;
          getModal('medicineModal').hide();
        },
        function (error) {
          console.error('Error updating medicine:', error);
          $scope.saving = false;
        }
      );
    } else {
      PharmacyService.addMedicine($scope.formMedicine).then(
        function (response) {
          var added = response.data;
          if (Array.isArray(added)) {
            $scope.medicines = $scope.medicines.concat(added);
          } else if (added) {
            $scope.medicines.push(added);
          }
          $scope.extractCategories();
          $scope.saving = false;
          $scope.formMedicine = {};
          getModal('medicineModal').hide();
          // Refresh to get server-assigned IDs
          $scope.getMedicines();
        },
        function (error) {
          console.error('Error adding medicine:', error);
          $scope.saving = false;
        }
      );
    }
  };

  $scope.deleteMedicine = function () {
    var med = $scope.deletingMedicine;
    // Use editMedicine to soft-delete or call a delete endpoint
    // For now, remove from local list and close modal
    $scope.medicines = $scope.medicines.filter(function (m) {
      return m.id !== med.id;
    });
    $scope.extractCategories();
    getModal('deleteModal').hide();
  };

  // ── Init ────────────────────────────────────────
  $scope.getMedicines();
});
