app.controller(
  "CustomerController",
  function ($scope, PharmacyService, $routeParams, $location) {
    $scope.customers = [];
   $scope.allCustomers = 0;
   $scope.newCustomersThisMonth = 0;
   $scope.unpaidCustomers = 0;
   $scope.loading = true;
    // Pagination & sorting state
  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.sortBy = 'name';
  $scope.sortOrder = 'asc';
  $scope.searchText = '';
  $scope.totalPages = 1;

   //get customers and calculate statistics for all customers, new customers this month and unpaid customers.
$scope.fetchCustomers = function() {
  $scope.loading = true;
  PharmacyService.getCustomers($scope.currentPage, $scope.pageSize, $scope.sortBy, $scope.sortOrder, $scope.searchText).then(
       function (response) {
            $scope.customers = response.data;
            $scope.loading = false;

        PharmacyService.getInvoices().then(
          function (response) {
            let invoices = response.data;

           // unpaid + partial customers count
$scope.unpaidCustomers =
  invoices.filter(invoice => invoice.payment_status === 'unpaid').length +
  invoices.filter(invoice => invoice.payment_status === 'partial').length;


// set state property
$scope.customers.forEach(customer => {

  let customerInvoices = invoices.filter(inv => inv.customer_id === customer.customer_id);

  if (customerInvoices.some(inv => inv.payment_status === 'unpaid')) {
    customer.state = 'Unpaid';
  } 
  else if (customerInvoices.some(inv => inv.payment_status === 'partial')) {
    customer.state = 'Partial';
  } 
  else {
    customer.state = 'Paid';
  }

});

            }, function (error) {
                console.error('Error fetching invoices:', error);
            });
       }).catch(function(error) {
    console.error('Error fetching customers:', error);
}).finally(function() {
    $scope.loading = false; // hide spinner after everything is done
});

 $scope.render=function(){

            PharmacyService.getCustomers().then(
               
                function (response) {
                    $scope.customers = response.data;

        });
    
    };

    $scope.addCustomer = function () {
      if ($scope.addCustomerForm.$invalid) return;

      const customerData = {
        name: $scope.customer.fullName,
        email: $scope.customer.email,
        phone: $scope.customer.phone,
      };
      PharmacyService.addCustomer(customerData).then(function (response) {
        console.log("Customer added successfully:", response.data);

        PharmacyService.getCustomers().then(
          function (response) {
            $scope.customers = response.data;

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
          },
        );
      });
    };

    $scope.deleteCustomer = function (customerId) {
      if (!confirm("Are you sure you want to delete this customer?")) return;

      PharmacyService.deleteCustomer(customerId).then(
        function (response) {
          console.log("Customer deleted successfully:", response.data);
          $scope.render();
        },
        function (error) {
          console.error("Error deleting customer:", error);
        },
      );
    };

    let customer = PharmacyService.getCustomerToEdit();

    if (customer) {
      $scope.customer = angular.copy(customer);
    } else {
      PharmacyService.getCustomers().then(function (response) {
        $scope.customer = response.data.find(
          (c) => c.customer_id == $routeParams.id,
        );
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
        customerData,
      ).then(
        function () {
          $location.path("/customers");
        },
        function (error) {
          console.error("Error updating customer:", error);
          $scope.editError = "Failed to update customer. Please try again.";
        },
      );
    };

    $scope.goToCustomers = function () {
      $location.path("/customers");
    };
  },
);
