app.controller('UserController', function ($scope, PharmacyService) {
    $scope.users = [];
    $scope.loading=true;

    
      // pagination
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.sortBy = 'name';
  $scope.sortOrder = 'asc';
  $scope.searchText = '';
  $scope.totalPages = 1;


  // fetch users
  $scope.fetchUsers = function () {
    $scope.loading = true;

    PharmacyService.getUsers(
      $scope.currentPage,
      $scope.pageSize,
      $scope.sortBy,
      $scope.sortOrder,
      $scope.searchText
    ).then(function (response) {

      $scope.users = response.data;

    }).catch(function (error) {

      console.error('Error fetching users:', error);

    }).finally(function () {

      $scope.loading = false;

    });
  };


  // Pagination
  $scope.nextPage = function () {
    $scope.currentPage++;
    $scope.fetchUsers();
  };

  $scope.prevPage = function () {
    if ($scope.currentPage > 1) {
      $scope.currentPage--;
      $scope.fetchUsers();
    }
  };


  // sorting
  $scope.changeSort = function (sortBy) {

    if ($scope.sortBy === sortBy) {
      $scope.sortOrder = $scope.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      $scope.sortBy = sortBy;
      $scope.sortOrder = 'asc';
    }

    $scope.fetchUsers();
  };


  // search
  $scope.$watch('searchText', function () {
    $scope.currentPage = 1;
    $scope.fetchUsers();
  });

  $scope.fetchUsers();

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



