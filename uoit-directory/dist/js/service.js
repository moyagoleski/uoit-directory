app.service('usersInfoService', function($http) {
	return {
		get: function() {
			return $http.get('../../../uoit-directory/data/directory.json'); // this will return a promise to controller
		}
	};
});
