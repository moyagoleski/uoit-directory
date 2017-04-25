// controller
app.controller('searchCtrls', function($scope, $http) {
    // gets JSON file
    $http.get("directory.json").then(function(response) {
        $scope.jsonData = response.data.query_info.person_info;
        // replaces '&' with 'and' in JSON file
        for(i in $scope.jsonData){
          $scope.jsonData[i]['dirschl_school_name'] = $scope.jsonData[i]['dirschl_school_name'].replace("&", "and");
        }
        // replaces '-UOIT' with '' in JSON file
        for(i in $scope.jsonData){
          $scope.jsonData[i]['dirschl_school_name'] = $scope.jsonData[i]['dirschl_school_name'].replace("-UOIT", "");
        }
        // replaces '- UOIT' with '' in JSON file
        for(i in $scope.jsonData){
          $scope.jsonData[i]['dirschl_school_name'] = $scope.jsonData[i]['dirschl_school_name'].replace("- UOIT", "");
        }
    });
});
