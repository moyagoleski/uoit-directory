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
			return $http.get(`https://api.uoit.ca/v2${endpoint}`) // API
				.then(({ data }) => {
					if (data.success) {
						return data;
					} else {
						console.error('Directory error:', data);
						throw new Error(data.message || 'an unknown error occurred')
					}
				});
		},
		getUsers() {
			return users || this.get('/directory')
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
			return departments || this.get('/directory/departments')
				.then(({ data = [] } = {}) => {
					departments = processList(data);
					return departments;
				})
				.catch(err => {
					console.error('Error loading departments:', err);
					throw new Error('cannot load department list');
				});
		},
		getExpert(person) {
			return this.get(`/experts?keyword=${encodeURIComponent(person.firstname)}`)
				.then(({ data }) => {
					return data && data.length ? data.find(expert => {
            const pattern = new RegExp(`(dr)?[\ \.]?${person.lastname.toLowerCase()}[\ \,]?\ ?(ph[\ \.]?\ ?d)?`, 'ig');
            return pattern.test(expert.lastname);
          }) : false;
				});
		}
	};
};