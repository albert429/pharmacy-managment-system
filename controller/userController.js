app.controller('UserController', function ($scope, PharmacyService) {
    $scope.users = [];
    $scope.admins = [];

    // Fetch users and separate them into admins and regular users
    PharmacyService.getUsers().then(
        function (response) {
            $scope.users = response.data;
            $scope.admins = $scope.users.filter(user => user.role === "admin");
            $scope.users = $scope.users.filter(user => user.role !== "admin");
        }
    );
});

