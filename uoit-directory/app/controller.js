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
App.directive("people", function() {
	return {
		restrict: "A",
		scope: {
			info: "="
		},
		template: "{{info.name}} <ul class='accordion-title-desc'><li><span>Title:</span>{{info.title}}</li><li><span>Department:</span>{{info.Department}}</li></ul>"
	};
});
