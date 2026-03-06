app.controller("ContactController", function ($scope) {
  $scope.formData = {
    name: "",
    email: "",
    message: "",
  };

  $scope.submitted = false;

  $scope.submitForm = function () {
    $scope.submitted = true;
  };
});
