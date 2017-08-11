export const DirectoryService = function($http, $httpParamSerializer, $q) {
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
	const extractData = ({ data = [] } = {}) => processList(data);
	const handleError = listName => err => {
		console.error(`Error loading ${listName} data:`, err);
		throw new Error(listName ? `cannot load ${listName} data` : err.message || 'an unknown error occurred');
	};

	const PROMISE_INDEX = {
		getUsers: 0,
		getDepts: 1,
		getExpert: 2
	};
	const cancelPromises = [];
	const newCancelPromise = index => {
		const cancelPromise = $q.defer();
		cancelPromises[index] = cancelPromise;
		return cancelPromise.promise;
	}
	const cancel = index => {
		if (cancelPromises[index]) {
			cancelPromises[index].resolve();
		}
	}

	return {
		get(endpoint = '', timeout) {
			return $http.get(`https://api.uoit.ca/v2${endpoint}`, {
				cache: true,
				timeout
			})
			.then(({ data }) => (data && data.success) ? data : handleError('directory')(data))
			.catch(err => {
				if (err.status !== -1) {
					throw err;
				}
			});
		},
		getUsers(params = {}) {
			cancel(PROMISE_INDEX.getUsers);
			return this.get(`/directory?${$httpParamSerializer(params)}`, newCancelPromise(PROMISE_INDEX.getUsers))
				.then(extractData)
				.catch(handleError('person'));
		},
		getDepts() {
			cancel(PROMISE_INDEX.getDepts);
			return this.get('/directory/departments', newCancelPromise(PROMISE_INDEX.getDepts))
				.then(extractData)
				.catch(handleError('department'));
		},
		getExpert(person) {
			cancel(PROMISE_INDEX.getExpert);
			return this.get(`/experts?${$httpParamSerializer({ keyword: person.firstname })}`, newCancelPromise(PROMISE_INDEX.getExpert))
				.then(({ data = [] }) => (data && data.length) ? data.find(expert => {
					const pattern = new RegExp(`(dr)?[\ \.]?${person.lastname.toLowerCase()}[\ \,]?\ ?(ph[\ \.]?\ ?d)?`, 'ig');
					return pattern.test(expert.lastname);
				}) : false);
		}
	};
};