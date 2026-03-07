app.controller('CustomerController', function ($scope, PharmacyService) {


    $scope.customers = [];
   $scope.allCustomers = 0;
   $scope.newCustomersThisMonth = 0;
   $scope.unpaidCustomers = 0;
   $scope.loading = true;

   // Fetch customers and calculate statistics for all customers, new customers this month and unpaid customers.
    PharmacyService.getCustomers().then(
        function (response) {
            $scope.customers = response.data;
            $scope.loading = false;
            $scope.allCustomers = $scope.customers.length;
            let currentMonth = new Date().getMonth();
            let currentYear = new Date().getFullYear();
            $scope.newCustomersThisMonth = $scope.customers.filter(customer => {
                let createdAt = new Date(customer.date_registered);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            }).length;

               // handle state
                  PharmacyService.getInvoices().then(function (response) {
                let invoices = response.data;

                //unpaid customers
                $scope.unpaidCustomers = invoices.filter(invoice => invoice.payment_status === 'unpaid').length;

                // state property
                $scope.customers.forEach(customer => {
                    let customerInvoices = invoices.filter(inv => inv.customer_id === customer.customer_id);
                    customer.state = customerInvoices.some(inv => inv.payment_status === 'unpaid') ? 'Unpaid' : 'Paid';
                });

            }, function (error) {
                console.error('Error fetching invoices:', error);
            });
        },
        function (error) {
            console.error('Error fetching customers:', error);
        });

      
                

});