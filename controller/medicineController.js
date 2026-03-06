app.controller("MedicineController", function ($scope, PharmacyService) {
  $scope.medicines = [];
  $scope.newMedicine = {};

  $scope.getMedicines = function () {
    PharmacyService.getMedicines().then(
      function (response) {
        $scope.medicines = response.data;
      },
      function (error) {
        console.error("Error fetching medicines:", error);
      },
    );
  };

  $scope.addMedicine = function () {
    PharmacyService.addMedicine($scope.newMedicine).then(
      function (response) {
        $scope.medicines.push(response.data);
        $scope.newMedicine = {};
      },
      function (error) {
        console.error("Error adding medicine:", error);
      },
    );
  };

  // Initialize by fetching medicines
  $scope.getMedicines();
});
