export const DirectoryService = function($http) {
	'ngInject';

	const replaceText = item => item.replace(/-|UOIT|/g, "").replace(/&/g, "and");

	const processList = items => items.map(item => {
		if (item.department) {
			item.department = replaceText(item.department);
		} else {
			item = replaceText(item);
		}
		return item;
	});

	let users = null;
	let departments = null;

	return {
		get(endpoint = '') {
			return $http.get(`https://api.uoit.ca/v2/directory${endpoint}`) // API
				.then(({ data }) => {
					if (data.success) {
						return data;
					} else {
						console.error('Directory error:', data);
						throw new Error(data.message || 'an unknown error occurred')
					}
				});
		},
		getUser(person) {
			let fullname;
			if (person.firstname && person.lastname) {
				fullname = [person.firstname, person.lastname].join('.')
			}
			return this.get(`/people/${fullname}`)
				.then(({ data }) => {
					return data.expert || false;
				});
		},
		getUsers() {
			return users || this.get()
				.then(({ data = [] } = {}) => {
					users = processList(data);
					return users;
				})
				.catch(err => {
					console.error('Error loading people:', err);
					throw new Error('cannot load person list');
				});
		},
		getDepts() {
			return departments || this.get('/departments')
				.then(({ data = [] } = {}) => {
					departments = processList(data);
					return departments;
				})
				.catch(err => {
					console.error('Error loading departments:', err);
					throw new Error('cannot load department list');
				});
		}
	};
};