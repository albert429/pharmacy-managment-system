app.directive('userTable',function ($location, PharmacyService) {
  return {
    scope: {
      data: '=',
      title: '@',
      customer: '=',
      onClick: '&',
      loading:'='

    },
    template: `
 <div class="row align-items-center mb-3 mt-4">

  <div class="col-md-4">
    <div class="input-group">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
      <input type="text"
             class="form-control"
             placeholder="Search by name..."
             ng-model="searchText">
    </div>
  </div>

  <div class="col-md-4">
<select class="form-select"  ng-model="sortBy">

  <option  value="name">Sort by Name</option>

  <option ng-if="customer===true" value="state">
    Sort by State
  </option>

  <option ng-if="customer!==true" value="role">
    Sort by Role
  </option>

</select>
  </div>

  <div class="col-md-4 text-end">
    <button class="btn btn-sm text-white" style="background: var(--teal)" ng-click="addPage()">
      <i class="bi bi-plus-lg me-1"></i> Add {{customer===true ? 'Customer' : 'User'}}
    </button>
  </div>

</div>

      <div  ng-if="loading" class="d-flex justify-content-center align-items-center ">
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading, please wait...</p>
    </div>
  </div>

  <div class="card border-0 shadow mt-2">
  <div class="card-body">
    <h5 class="card-title fw-bold mb-4">
      <i class="bi bi-person text-success me-3"></i>{{title}}
    </h5>

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead >
          <tr >
            <th >#</th>
            <th>Name</th>
            <th class="d-none d-sm-table-cell">Email</th>
            <th>Phone Number</th>
            <th ng-if="customer===true">State</th>
            <th ng-if="customer===false">Role</th>
            <th>Date Registered</th>
            <th ng-if="customer === true">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat="user in filteredusers = (data 
                                   | filter:{name:searchText} 
                                   | orderBy:sortBy)">
            <td class="text-muted fw-semibold">{{$index + 1}}</td>
            <td >{{user.name}}</td>
            <td >{{user.email}}</td>
            <td>{{user.phone}}</td>
            <td ng-class="{'text-danger': user.state === 'Unpaid', 'text-success': user.state === 'Paid','text-secondary': user.state === 'Partial'}" ng-if="customer===true">{{user.state}}</td>
            <td ng-if="customer===false">{{user.role}}</td>
            <td>{{user.date_registered | date:'yyyy-MM-dd'}}</td>
         <td ng-if="customer === true">
            
  <div class="dropdown">
    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="settingsMenu" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-gear"></i> 
    </button>
    
    <ul class="dropdown-menu" aria-labelledby="settingsMenu">
        <li ng-if="customer === true">
  <a class="dropdown-item text-success" href="" ng-click="viewPage(user)">View</a>
</li>
      <li><a class="dropdown-item text-secondary" href="" ng-click="editPage(user)">Edit</a></li>
        <li ng-if="customer === true">
    <a class="dropdown-item text-danger" href="" ng-click="onClick({user: user, index: $index}); $event.preventDefault();">Delete</a>
  </li>
      <li ng-if="customer !== true">
    <a class="dropdown-item text-danger" href="" ng-click="onClick({user: user, index: $index}); $event.preventDefault();">Delete</a></li>

    </ul>
  </div>
</td>
          </tr>
          <tr ng-if="filteredusers.length === 0">
            <td colspan="7" class="text-center text-secondary fw-bold py-3" ng-if="!loading" >
              No {{customer===true ? 'customer' : 'user'}} found
            </td>
        </tbody>
      </table>
    </div>
  </div>
</div>
        `,
link: function(scope) {
  scope.addPage = function() {
    if (scope.customer) {
      $location.path('/add-customer');
    }
    else{
       
      $location.path('/add-user');
    
    }
  };

  scope.editPage = function(user) {
    if (scope.customer) {
      PharmacyService.setCustomerToEdit(user); 
      $location.path('/edit-customer/' + user.customer_id);
    } 
  };
  scope.viewPage = function(user) {
    if (scope.customer === true) {
        PharmacyService.setCustomerToEdit(user); 
        $location.path('/view-customer/' + user.customer_id);
    }
};
}
  };
});