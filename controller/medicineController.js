app.controller('MedicineController', function ($scope, PharmacyService) {
  $scope.medicines = [];
  $scope.newMedicine = {};
  $scope.editingMedicine = {};
  $scope.isEditing = false;
  $scope.search = '';

  // Load all medicines
  $scope.getMedicines = function () {
    PharmacyService.getMedicines().then(function (response) {
      $scope.medicines = response.data;
    });
  };

  // Add a new medicine
  $scope.addMedicine = function () {
    PharmacyService.addMedicine($scope.newMedicine).then(function () {
      $scope.newMedicine = {};
      $scope.getMedicines();
      bootstrap.Modal.getInstance(
        document.getElementById('medicineModal')
      ).hide();
    });
  };

  // Open modal to add
  $scope.openAdd = function () {
    $scope.isEditing = false;
    $scope.newMedicine = {};
    new bootstrap.Modal(document.getElementById('medicineModal')).show();
  };

  // Open modal to edit
  $scope.openEdit = function (med) {
    $scope.isEditing = true;
    $scope.editingMedicine = angular.copy(med);
    new bootstrap.Modal(document.getElementById('medicineModal')).show();
  };

  // Save edit
  $scope.saveEdit = function () {
    var id = $scope.editingMedicine.medicine_id;
    var data = angular.copy($scope.editingMedicine);
    delete data.medicine_id;

    PharmacyService.editMedicine(id, data).then(function () {
      $scope.getMedicines();
      bootstrap.Modal.getInstance(
        document.getElementById('medicineModal')
      ).hide();
    });
  };

  $scope.getMedicines();
});
