// controller
app.controller('searchCtrls', function($scope, $http, $filter) {

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

    // show and hide Directoy Search Result when you go to another tab
    $scope.searchTabFunction = function() {
      $("#angularSearch").show();
      // $scope.searchName.dirpepl_first_name.searchName.dirpepl_last_name.searchName.dirschl_school_name = true;
    };

    $scope.contactsTabFunction = function() {
      $("#angularSearch").hide();
      // $scope.searchName.dirpepl_first_name.searchName.dirpepl_last_name.searchName.dirschl_school_name = false;
    };

    $scope.updateTabFunction = function() {
      $("#angularSearch").hide();
    };

    // // order by buttons that filter when you click
    $scope.orderByFunction = function(order) {

      if (order == '0') {
        // alert("order by first name!");
        $scope.jsonData = $filter('orderBy')($scope.jsonData, 'dirpepl_first_name');
        // colour change to know what button you clicked
        $('#orderFirstName').css('background-color', '#003C71');
        $('#orderLastName').css('background-color', '#0077CA');
        $('#orderDepartment').css('background-color', '#0077CA');
      }

      if (order == '1') {
        // alert("order by last name!");
        $scope.jsonData = $filter('orderBy')($scope.jsonData, 'dirpepl_last_name');
        // colour change to know what button you clicked
        $('#orderFirstName').css('background-color', '#0077CA');
        $('#orderLastName').css('background-color', '#003C71');
        $('#orderDepartment').css('background-color', '#0077CA');
      }

      if (order == '2') {
        // alert("order by department!");
        $scope.jsonData = $filter('orderBy')($scope.jsonData, 'dirschl_school_name');
        // colour change to know what button you clicked
        $('#orderFirstName').css('background-color', '#0077CA');
        $('#orderLastName').css('background-color', '#0077CA');
        $('#orderDepartment').css('background-color', '#003C71');
      }

    };

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
