var App = angular.module("myApp", []);

App.controller("FirstCtrl", function($scope) {
	$scope.people = [{
			name: "abc",
			title: "Academic Affairs Specialist",
			Department: "Academic Affairs Specialist"
		},
		{
			name: "123",
			title: "Academic Affairs Specialist",
			Department: "Academic Affairs Specialist"
		}
	];
});
<<<<<<< HEAD

app.factory('usersInfoService', function($http) {
=======
App.directive("people", function() {
>>>>>>> parent of 09f08c0... added angular
	return {
		restrict: "A",
		scope: {
			info: "="
		},
		template: "{{info.name}} <ul class='accordion-title-desc'><li><span>Title:</span>{{info.title}}</li><li><span>Department:</span>{{info.Department}}</li></ul>"
	};
});
<<<<<<< HEAD

app.controller('getUserCtrl', function($scope, usersInfoService){
		usersInfoService.get().then(function(response) {
	  	$scope.users = response.data.query_info.person_info;
			console.log($scope.users);
		});
});


// PLAYGORUND

// app.directive("title", function() {
// 	return {
// 		restrict: "A",
// 		scope: {
// 			info: "="
// 		},
// 		template: "{{info.dirpepl_first_name + ' ' + info.dirpepl_last_name}}<ul class='accordion-title-desc'><li><span>Title:</span>{{info.dirrank_rank_name}}</li><li><span>Department:</span>{{info.dirschl_school_name}}</li></ul>"
// 	};
// });
//
// app.directive("content", function() {
// 	return {
// 		restrict: "A",
// 		scope: {
// 			info: "="
// 		},
// 		template: "<ul class='search-list-info'><li><span>Office:</span>{{info.dirpepl_office}}:</li><li><span>Building:</span>{{info.dirbuilding_building_name}}:</li><li><span>Extension:</span>{{info.dirpepl_extension}}</li><li><span>E-mail:</span>{{info.email}}</li></ul>"
// 	};
// });

// app.factory('getDataService', function($http) {
//   var getDataService = {
//     async: function() {
//       // $http returns a promise, which has a then function, which also returns a promise
//       var promise = $http.get('./directory.json').then(function (response) {
//         // The then function here is an opportunity to modify the response
//         console.log(response);
//         // The return value gets picked up by the then in the controller.
//         return response.data;
//       });
//       // Return the promise to the controller
//       return promise;
//     }
//   };
//   return getDataService;
// });
//
// app.controller('displayDataCtrl', function(getDataService, $scope) {
//   // Call the async method and then do stuff with what is returned inside our own then function
//   getDataService.async().then(function(data) {
//     $scope.users = data.query_info.person_info;
//   });
// });
//


//
// app.factory('getDataService', function($http) {
//   var getDataService = {
//     async: function() {
//       // $http returns a promise, which has a then function, which also returns a promise
//       var promise = $http.get('./directory.json').then(function (response) {
//         // The then function here is an opportunity to modify the response
//         console.log(response);
//         // The return value gets picked up by the then in the controller.
//         return response.data;
//       });
//       // Return the promise to the controller
//       return promise;
//     }
//   };
// 	console.log(getDataService);
//   return getDataService;
//
// });
// //
// app.controller('getUserCtrl', function(getDataService, $scope) {
//   // Call the async method and then do stuff with what is returned inside our own then function
//   getDataService.async().then(function(data) {
//     $scope.users = data;
//   });
//
// });
=======
>>>>>>> parent of 09f08c0... added angular
