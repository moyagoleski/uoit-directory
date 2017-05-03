var app = angular.module("myApp", []);

app.service('usersInfoService', function($http) {
	return {
		get: function() {
			return $http.get('../../../uoit-directory/data/directory.json'); // this will return a promise to controller
		}
	};
});

app.controller('getUsersCtrl', ['$scope', '$filter', 'usersInfoService', function($scope, $filter, usersInfoService) {
	$scope.search = function() {
		$scope.name = $scope.searchInput;
	};

	$scope.select = function() {
		// clear input field
		$scope.searchInput = "";
		$scope.name = name.dirschl_school_name;
	};

	var regex = /&|-|UOIT|/g;

	$scope.departments = [];

	usersInfoService.get().then(function(response) {
		$scope.users = response.data.query_info.person_info;
		for (var i in $scope.users) {
			$scope.users[i].dirschl_school_name = $scope.users[i].dirschl_school_name.replace(regex, "");
			$scope.departments[i] = response.data.query_info.person_info[i].dirschl_school_name;
		}
		// remove departments duplicates from json data  (dirschl_school_name)
		$scope.departments = $scope.departments.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
		// sort departments array
		$scope.departments.sort();

			$scope.currentPage = 0;
			$scope.pageSize = 10;
			$scope.name = '';


		$scope.getData = function() {
			return $filter('filter')($scope.users, $scope.name);
		};

		$scope.numberOfPages = function() {
			return Math.ceil($scope.getData().length / $scope.pageSize);
		};
	});
}]);

// return arr
app.filter('startFrom', function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	};
});
