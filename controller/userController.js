app.controller('UserController', function ($scope, PharmacyService) {
    $scope.users = [];
    $scope.loading=true;

    
    // Fetch users and separate them into admins and regular users
    $scope.render = function () {
    PharmacyService.getUsers().then(
        function (response) {
            $scope.users = response.data;
   }
    ).catch(function(error) {
    console.error('Error fetching users:', error);
}).finally(function() {
    $scope.loading = false; // hide spinner after everything is done
});
    ;

};

    $scope.render();

    $scope.deleteUser = function (userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    PharmacyService.deleteUser(userId).then(
      function (response) {
        console.log('User deleted successfully:', response.data);

        // Refresh user list
        $scope.render();
      }
    ).catch(function (error) {
      console.error('Error deleting user:', error);
    });
  }  ;
});



