export const UsersService = function($http) {
	'ngInject';
	// regex replace '&','UOIT','g'
	var regex = /-|UOIT|/g;
	var regex2 = /&/g;

	// MOVED FROM CONTROLLER
	var processUsers = function(items) {
		for (var i in items) {
			items[i].department = items[i].department.replace(regex, "");
			items[i].department = items[i].department.replace(regex2, "and");
		}
		return items;
	}
	var processDepts = function(items) {
		for (var i in items) {
			// store department in departments array
			// replace '&','UOIT','g'
			items[i] = items[i].department;

			items[i] = items[i].replace(regex, "");
			items[i] = items[i].replace(regex2, "and");

		}
		// remove departments duplicates from departments array (dirschl_school_name) 64 left
		items = items.filter(function(elem, index, self) {
			return index == self.indexOf(elem);
		});
		// sort departments array
		items.sort();
		return items;
	}

	var users = null;

	return {
		get: function() {
			return users ? users : $http.get('https://api.uoit.ca/v2/directory') // API
				.then(function(response) {
					users = response.data.data;
					return users;
				});
		},
		getUsers: function() {
			return this.get()
				.then(function(data) {
					return processUsers(data);
				})
				.catch(function(err) {
					console.log('Error loading people:', err);
					throw new Error('cannot load person list');
				});
		},
		getDepts: function() {
			return this.get()
				.then(function(data) {
					return processDepts(data);
				})
				.catch(function(err) {
					console.log('Error loading departments:', err);
					throw new Error('cannot load department list');
				});
		}
	};
};