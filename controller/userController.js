app.controller("UserController", function ($scope, PharmacyService) {
  $scope.users = [];
  $scope.loading = true;

  $scope.render = function () {
    PharmacyService.getUsers()
      .then(function (response) {
        $scope.users = response.data;
      })
      .catch(function (error) {
        console.error("Error fetching users:", error);
      })
      .finally(function () {
        $scope.loading = false;
      });
  };

  $scope.render();

  $scope.deleteUser = function (userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    PharmacyService.deleteUser(userId)
      .then(function (response) {
        console.log("User deleted successfully:", response.data);

        $scope.render();
      })
      .catch(function (error) {
        console.error("Error deleting user:", error);
      });
  };
});
