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

// app.controller('AccordionDemoCtrl', ['$scope', '$sce', function($scope, $sce) {
//   var jsonData = [];
//   for(var i=0;i<10;i++){
//     var dirpepl_first_name = "<div>TEST "+ i +"</div>";
//
//     // Set html content as trusted
//     dirpepl_first_name = $sce.trustAsHtml(dirpepl_first_name);
//
//     // Push trusted html content to items array
//     jsonData.push({index:i,dirpepl_first_name:dirpepl_first_name});
//   }
//   $scope.jsonData = jsonData;
// }]);
