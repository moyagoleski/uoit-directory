export const DirectorySearchComponent = {
  templateUrl: 'directory-search.component.html',
	controller: class DirectorySearch {
		constructor (
			$scope,
			$filter,
			$http,
			$element,
			$httpParamSerializerJQLike,
			DirectoryService,
			DIRECTORY_CONTACTS
		) {
			'ngInject';
			this.$scope = $scope;
			this.$filter = $filter;
			this.$http = $http;
			this.$element = $element;
			this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
			this.DirectoryService = DirectoryService;
			this.DIRECTORY_CONTACTS = DIRECTORY_CONTACTS;
		}
		
		$onInit() {
			this.$scope.contacts = this.DIRECTORY_CONTACTS;
			this.$scope.departments = null;
			this.$scope.users = null;
			this.$scope.usersCache = null;
			this.$scope.searchName = {};

			this.$scope.departmentError = null;
			this.$scope.userError = null;
			this.$scope.formStatus = {
				success: null,
				error: null
			};

			this.$scope.currentPage = 0;
			this.$scope.pageSize = 7;
			this.$scope.loadingResults = false;

			// Load departments on init
			this.DirectoryService.getDepts()
				.then(depts => {
					this.$scope.departments = depts;
				})
				.catch(err => {
					this.$scope.departmentError = err;
				});
		}

		getUser(person) {
			person.expert = {};
			this.DirectoryService.getExpert(person).then(expert => {
				person.expert = expert || false;
			});
		}

		removeSearchResult() {
			this.$scope.searchName = {};
		}

		// MODIFY SEARCH RESULT
		// RESET CURRENT PAGE
		// CLEAR DROPDOWN LIST
		modifyResultResetDropdown() {
			this.$scope.currentPage = 0;
			this.$scope.searchName.department = '';
			this.getSearchResults();
		}

		// RESET CURRENT PAGE
		// CLEAR INPUT FIELD
		modifyResultClearInput() {
			this.$scope.currentPage = 0;
			this.$scope.searchName.firstname = '';
			this.$scope.searchName.lastname = '';
			this.getSearchResults();
		}

		// PASS ORDERBY PARAMETER
		// AND CHANGE ACTIVE FILTER BUTTON
		sortBy(propertyName) {
			this.$scope.order = propertyName;
		}

		smoothScroll() {
			const scrollTop = $element.find('#search-results').offset().top;
			$('html,body').animate({ scrollTop }, 'slow');
		}

		changePageAndScroll(plusOrMinus) {
			this.$scope.currentPage = this.$scope.currentPage + plusOrMinus;
			this.smoothScroll()
		}

		gotoPageAndScroll(page) {
			this.$scope.currentPage = page - 1;
			this.smoothScroll()
		}

		// GET FILTERED DATA
		getSearchResults() {
			this.$scope.loadingResults = true;
			if (this.$scope.usersCache) {
				this.$scope.users = this.$filter('filter')(this.$scope.usersCache, this.$scope.searchName) || [];
				this.$scope.loadingResults = false;
			} else {
				this.DirectoryService.getUsers(this.$scope.searchName)
					.then(users => {
						this.$scope.users = this.$filter('filter')(users, this.$scope.searchName) || [];
						this.$scope.loadingResults = false;
						// Proactively load the whole list in the background as soon
						// as user makes their first query; early searches will be
						// handled by the `getSearchResults()` return, which provides a
						// quicker (albeit uncacheable) response and then immediately
						// kicks off a new request for the cache.
						return this.DirectoryService.getUsers()
					})
					.then(users => {
						this.$scope.usersCache = users;
					})
					.catch(err => {
						this.$scope.userError = err;
						this.$scope.loadingResults = false;
					})
			}
		}

		// GET NUMBER OF PAGES
		numberOfPages() {
			return this.$scope.users && this.$scope.users.length ?
				Math.ceil(this.$scope.users.length / this.$scope.pageSize) :
				0;
		}

		getPageNumbers() {
			if (this.$scope.users && this.$scope.users.length) {
				let numberOfPages = Math.ceil(this.$scope.users.length / this.$scope.pageSize);
				const pageNumArray = [];
				while (numberOfPages) {
					pageNumArray.push(numberOfPages);
					numberOfPages--;
				}
				return pageNumArray.reverse();
			} else {
				return [1];
			}
		}

		processForm() {
			// pass in data as strings
			const data = this.$httpParamSerializerJQLike(this.$scope.formData);
			// set the headers so angular passing info as form data (not request payload)
			const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
			// send http POST request
			this.$http({
				method: 'POST',
				url: 'mail.php',
				headers,
				data
			})
				.then(response => {
					if (response.data.success) {
						console.info(response);
						this.$scope.formStatus.error = false;
						this.$scope.formStatus.success = "Your update request was submitted successfully!";
						this.$scope.updateForm.$setUntouched();
						this.$scope.formData = {};
					} else {
						console.error(response);
						throw new Error(response.data.message || 'An unknown error has occurred. Please try again!');
					}
				})
				.catch(response => {
					console.error(response);
					this.$scope.formStatus.success = false;
					const message = response.data.message || 'Please try again!';
					this.$scope.formStatus.error = `There was an error submitting your update request. ${message}`;
				});
		}
	}
	// end controller
};
