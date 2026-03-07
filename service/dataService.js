app.service('PharmacyService', function ($http) {
  var baseLink = 'https://mzrwptstmsewkwucwvlt.supabase.co/rest/v1';
  var apiKey = 'sb_publishable_3eyaMNOWfe9xnmLf08SHNg_WUQOfmBc';
  var headers = {
    apikey: apiKey,
    Authorization: 'Bearer ' + apiKey,
    'Content-Type': 'application/json',
  };

  // users management
  this.getUsers = function () {
    return $http.get(baseLink + '/users_metadata', { headers: headers });
  };

  this.deleteUser = function (userId) {
    return $http.delete(baseLink + '/users_metadata?id=eq.' + userId, { headers: headers });
  };

  // customers management
  this.getCustomers = function () {
    return $http.get(baseLink + '/customers', { headers: headers });
  };

  this.addCustomer = function (customerData) {
    return $http.post(baseLink + '/customers', customerData, {
      headers: headers,
    });
  };

  this.deleteCustomer = function (customerId) {
    return $http.delete(baseLink + '/customers?customer_id=eq.' + customerId, {
      headers: headers,
    });
  };

  this.editCustomer = function (customerId, customerData) {
    return $http.patch(
      baseLink + '/customers?customer_id=eq.' + customerId,
      customerData,
      { headers: headers }
    );
  };

  var customerToEdit = null;

  this.setCustomerToEdit = function (customer) {
    customerToEdit = customer;
  };

  this.getCustomerToEdit = function () {
    return customerToEdit;
  };

  this.getMedicines = function () {
    return $http.get(baseLink + '/medicines', { headers: headers });
  };
  this.addMedicine = function (medicineData) {
    return $http.post(baseLink + '/medicines', medicineData, {
      headers: headers,
    });
  };
  this.editMedicine = function (medicineId, medicineData) {
    return $http.patch(
      baseLink + '/medicines?medicine_id=eq.' + medicineId,
      medicineData,
      { headers: headers }
    );
  };

  // invoices management
  this.getInvoices = function () {
    return $http.get(baseLink + '/invoices', { headers: headers });
  };

  // POST invoice and return the created row (needed to get invoice_id)
  this.addInvoice = function (invoiceData) {
    var h = Object.assign({}, headers, { Prefer: 'return=representation' });
    return $http.post(baseLink + '/invoices', invoiceData, { headers: h });
  };

  this.editInvoice = function (invoiceId, invoiceData) {
    return $http.patch(
      baseLink + '/invoices?invoice_id=eq.' + invoiceId,
      invoiceData,
      { headers: headers }
    );
  };

  // invoice items
  this.getInvoiceItems = function () {
    return $http.get(baseLink + '/invoice_items', { headers: headers });
  };

  this.addInvoiceItems = function (itemsData) {
    return $http.post(baseLink + '/invoice_items', itemsData, {
      headers: headers,
    });
  };

  this.editInvoiceItem = function (itemId, itemData) {
    return $http.patch(baseLink + '/invoice_items?id=eq.' + itemId, itemData, {
      headers: headers,
    });
  };

  // get invoices with items and medicines for a specific customer
  this.getCustomerInvoicesItems = function (customerId) {
    var query =
      '?select=*,invoice_items(*,medicines(*))&customer_id=eq.' + customerId;
    return $http.get(baseLink + '/invoices' + query, { headers: headers });
  };

  // get invoices created by specific user
  this.getUserInvoices = function (userId) {
    var query =
      '?select=*,invoice_items(*,medicines(*))&created_by=eq.' + userId;
    return $http.get(baseLink + '/invoices' + query, { headers: headers });
  };
});
