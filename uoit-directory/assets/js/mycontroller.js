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

    // orders automatically by last name
    $('#orderLastName').css('background-color', '#003C71');

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

    // pagination function
    $scope.currentPage = 0;
    $scope.pageSize    = 7;
    $scope.jsonData    = [];

    // pagination changes based on searchName results AND searchDepartment results
    $scope.numberOfPages=function(){
      var myFilteredData;
      
      myFilteredData = $filter('filter')(myFilteredData,$scope.searchDepartment.dirschl_school_name);

      //Filter the data
      return Math.ceil(myFilteredData.length/$scope.pageSize);
        // return Math.ceil($scope.jsonData.length/$scope.pageSize);
    }

    for (var i=0; i<45; i++) {
        $scope.jsonData.push("Item "+i);
    }

});

// pagination function
app.filter('startFrom', function() {
  return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
  }
});


// does not repeat in departments in dropdown
app.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
