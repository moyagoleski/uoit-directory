// get JSON file controller
app.controller('searchCtrls', function($scope, $http) {
    $http.get("directory.json").then(function(response) {
        $scope.jsonData = response.data.query_info.person_info;
    });
});
