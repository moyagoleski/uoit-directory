app.controller('searchCtrl', ['$scope', '$filter', 'usersInfoService', function($scope, $filter, usersInfoService) {
	// get users info data from json file
	usersInfoService.get().then(function(response) {
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


		//pagining

		$scope.currentPage = 0;
		$scope.pageSize = 10;

		// get filtered data
		$scope.getData = function() {
			return $filter('filter')($scope.users, $scope.search);
		};

		$scope.numberOfPages = function() {
			return Math.ceil($scope.getData().length / $scope.pageSize);
		};

		// search function binding to search button
		$scope.searchBy = function() {
			// get keyword from input field binding to accordion filter
			$scope.search = $scope.searchInput;
			//clear dropdown list
			$scope.searchDepartment = '';
			// set current page
			$currentPage = 1;
		};

		// search result display below search tab content
		// by clicking other tabs remove search result
		$scope.removeSearchResult = function() {
			$scope.searchInput = '';
		};

		// dropdown function
		// if using $scope.search = $scope.searchSelect;
		// filter is going to filter department but also filtering
		// other names has same string like selecting campus ice centre in dropdownlist
		// will select "dirschl_school_name": "Office of Student Life - Varsity",
		// because in this subject building name has exact same string as selecetd department from dropdown 'Campus Ice Centre'
		// like dirschl_school_name, "dirbuilding_building_name": "Campus Ice Centre",

		// if using $scope.search = search.dirschl_school_name;
		// when name or keyword is typed and search button cliked,
		// dropdown list is not functional causing error cannot create property '' on string ''
		$scope.searchSelect = function() {
			$scope.search = $scope.searchDepartment;
			$scope.searchInput = '';
			$currentPage = 1;
		};
	});
}]);


app.filter('startFrom', function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	};
});
