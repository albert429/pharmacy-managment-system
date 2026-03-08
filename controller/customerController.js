app.controller(
  "CustomerController",
  function ($scope, PharmacyService, $routeParams, $location) {
    $scope.customers = [];
    $scope.loading = true;

    // Pagination & sorting state
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.sortBy = 'name';
    $scope.sortOrder = 'asc';
    $scope.searchText = '';
    $scope.totalPages = 1;

    $scope.fetchCustomers = function () {
      $scope.loading = true;
      PharmacyService.getCustomers(
        $scope.currentPage,
        $scope.pageSize,
        $scope.sortBy,
        $scope.sortOrder,
        $scope.searchText
      )
        .then(function (response) {
          $scope.customers = response.data;
          $scope.loading = false;

          PharmacyService.getInvoices().then(
            function (response) {
              var invoices = response.data;

              $scope.customers.forEach(function (customer) {
                var customerInvoices = invoices.filter(function (inv) {
                  return inv.customer_id === customer.customer_id;
                });

                if (customerInvoices.some(function (inv) { return inv.payment_status === 'unpaid'; })) {
                  customer.state = 'Unpaid';
                } else if (customerInvoices.some(function (inv) { return inv.payment_status === 'partial'; })) {
                  customer.state = 'Partial';
                } else {
                  customer.state = 'Paid';
                }
              });
            },
            function (error) {
              console.error('Error fetching invoices:', error);
            }
          );
        })
        .catch(function (error) {
          console.error('Error fetching customers:', error);
        })
        .finally(function () {
          $scope.loading = false;
        });
    };

    // Pagination
    $scope.nextPage = function () {
      $scope.currentPage++;
      $scope.fetchCustomers();
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.fetchCustomers();
      }
    };

    // Sorting
    $scope.changeSort = function (sortBy) {
      if ($scope.sortBy === sortBy) {
        $scope.sortOrder = $scope.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        $scope.sortBy = sortBy;
        $scope.sortOrder = 'asc';
      }
      $scope.fetchCustomers();
    };

    // Search
    $scope.$watch('searchText', function () {
      $scope.currentPage = 1;
      $scope.fetchCustomers();
    });

    $scope.addCustomer = function () {
      if ($scope.addCustomerForm.$invalid) return;

      var customerData = {
        name: $scope.customer.fullName,
        email: $scope.customer.email,
        phone: $scope.customer.phone,
      };

      PharmacyService.addCustomer(customerData).then(
        function () {
          $scope.statusMessage = "Customer added successfully!";
          $scope.statusType = "success";
          $scope.customer = {};
          $scope.addCustomerForm.$setPristine();
          $scope.addCustomerForm.$setUntouched();
          $location.path("/customers");
        },
        function (error) {
          $scope.statusMessage = "Failed to add customer. Please try again.";
          $scope.statusType = "error";
          console.error("Error adding customer:", error);
        }
      );
    };

    $scope.deleteCustomer = function (customerId) {
      if (!confirm("Are you sure you want to delete this customer?")) return;

      PharmacyService.deleteCustomer(customerId).then(
        function () {
          $scope.fetchCustomers();
        },
        function (error) {
          console.error("Error deleting customer:", error);
        }
      );
    };

    var customer = PharmacyService.getCustomerToEdit();

    if (customer) {
      $scope.customer = angular.copy(customer);
    } else {
      PharmacyService.getAllCustomers().then(function (response) {
        $scope.customer = response.data.find(function (c) {
          return c.customer_id == $routeParams.id;
        });
      });
    }

    $scope.editCustomer = function () {
      if ($scope.editCustomerForm.$invalid) return;

      var customerData = {
        name: $scope.customer.name,
        email: $scope.customer.email,
        phone: $scope.customer.phone,
      };

      PharmacyService.editCustomer(
        $scope.customer.customer_id,
        customerData
      ).then(
        function () {
          $location.path("/customers");
        },
        function (error) {
          console.error("Error updating customer:", error);
          $scope.editError = "Failed to update customer. Please try again.";
        }
      );
    };

    $scope.goToCustomers = function () {
      $location.path("/customers");
    };

    $scope.fetchCustomers();
  }
);
