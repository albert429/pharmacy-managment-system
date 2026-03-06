app.directive('userTable', function () {
  return {
    scope: {
      data: '=',
      title: '@',
      customer: '=',
    },
    template: `
  <div class="card border-0 shadow mt-5">
  <div class="card-body">
    <h5 class="card-title fw-bold mb-4">
      <i class="bi bi-person text-success me-3"></i>{{title}}
    </h5>

    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th class="d-none d-sm-table-cell">Email</th>
            <th>Phone Number</th>
            <th ng-if="customer===true">State</th>
            <th>Date Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr ng-repeat="user in data">
            <td class="text-muted fw-semibold">{{$index + 1}}</td>
            <td >{{user.name}}</td>
            <td >{{user.email}}</td>
            <td>{{user.phone}}</td>
            <td ng-class="{'text-danger': user.state === 'Unpaid', 'text-success': user.state === 'Paid'}" ng-if="customer===true">{{user.state}}</td>
            <td>{{user.date_registered | date:'yyyy-MM-dd'}}</td>
         <td>
            
  <div class="dropdown">
    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="settingsMenu" data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-gear"></i> 
    </button>
    
    <ul class="dropdown-menu" aria-labelledby="settingsMenu">
      <li><a class="dropdown-item text-secondary" href="#">Edit</a></li>
      <li><a class="dropdown-item text-danger" href="#">Delete</a></li>
    </ul>
  </div>
</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
        `,
  };
});
