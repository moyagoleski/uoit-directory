export const SearchService = function SearchService($http, $httpParamSerializer, $q) {
  'ngInject';

  // const API_URL = 'http://localhost:8080'; // dev
  const API_URL = 'https://api.ontariotechu.ca'; // prod
  // const API_URL = 'https://uoit-api.herokuapp.com'; // cloud
  const API_V2 = 2;
  const API_V3 = 3;

  const replaceText = item => item.replace(/-|UOIT|/g, '').replace(/&/g, 'and');
  const processList = items =>
    items.map(item => {
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
    throw new Error(
      listName ? `cannot load ${listName} data` : err.message || 'an unknown error occurred'
    );
  };

  return {
    get(endpoint = '', version = API_V2) {
      return $http
        .get(`${API_URL}/v${version}/${endpoint}`, {
          cache: true
        })
        .then(({ data }) => (data && data.success ? data : handleError('directory')(data)))
        .catch(err => {
          if (err.status !== -1) {
            throw err;
          }
        });
    },

    getUsers(params = {}) {
      return this.get(`directory?${$httpParamSerializer(params)}`)
        .then(extractData)
        .catch(handleError('person'));
    },
    getDepts() {
      return this.get('directory/departments')
        .then(extractData)
        .catch(handleError('department'));
    },
    getExpert(person) {
      const { firstname, lastname } = person;
      const params = $httpParamSerializer({
        firstname,
        lastname
      });
      return this.get(`experts?${params}`, API_V3).then(({ success = false, data = null } = {}) =>
        success && data && data.length ? data[0] : false
      );
    }
  };
};
