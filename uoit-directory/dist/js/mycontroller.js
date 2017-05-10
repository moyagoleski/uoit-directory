// controller
app.controller('searchCtrl', ['$scope', '$filter', 'usersService', function($scope, $filter, usersService) {
    usersService.get().then(function(response) {
        // push person info to users array;
        $scope.users = response.data.query_info.person_info;

        // departments array
        $scope.departments = [];

        // regex replace '&','UOIT','g'
        var regex = /-|UOIT|/g;
        var regex2 = /&/g;

        for (var i in $scope.users) {

            // replace '&','UOIT','g'
            $scope.users[i].dirschl_school_name = $scope.users[i].dirschl_school_name.replace(regex, "");
            $scope.users[i].dirschl_school_name = $scope.users[i].dirschl_school_name.replace(regex2, "and");

            // store department in departments array
            $scope.departments[i] = response.data.query_info.person_info[i].dirschl_school_name;
        }

        // remove departments duplicates from departments array (dirschl_school_name) 64 left
        $scope.departments = $scope.departments.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
        // sort departments array
        $scope.departments.sort();

        $scope.currentPage = 0;
        $scope.pageSize = 7;

        // get filtered data
        $scope.getData = function() {
            return $filter('filter')($scope.users, $scope.searchName);
        };

        $scope.numberOfPages = function() {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        };

    });

    $scope.removeSearchResult = function() {
        $scope.searchName = {};
    };

}]);

// pagination function
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


// does not repeat in departments in dropdown
// app.filter('unique', function () {
//
//     return function (items, filterOn) {
//
//         if (filterOn === false) {
//             return items;
//         }
//
//         if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
//             var hashCheck = {}, newItems = [];
//
//             var extractValueToCompare = function (item) {
//                 if (angular.isObject(item) && angular.isString(filterOn)) {
//                     return item[filterOn];
//                 } else {
//                     return item;
//                 }
//             };
//
//             angular.forEach(items, function (item) {
//                 var valueToCheck, isDuplicate = false;
//
//                 for (var i = 0; i < newItems.length; i++) {
//                     if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
//                         isDuplicate = true;
//                         break;
//                     }
//                 }
//                 if (!isDuplicate) {
//                     newItems.push(item);
//                 }
//
//             });
//             items = newItems;
//         }
//         return items;
//     };
// });