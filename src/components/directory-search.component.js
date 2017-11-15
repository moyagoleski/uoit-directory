export const DirectorySearchComponent = {
  templateUrl: 'directory-search.component.html',
	controller: class DirectorySearch {
		constructor (
			$filter,
			$http,
			$element,
			$httpParamSerializerJQLike,
			DirectoryService,
			DIRECTORY_CONTACTS
		) {
			'ngInject';
			this.$filter = $filter;
			this.$http = $http;
			this.$element = $element;
			this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
			this.DirectoryService = DirectoryService;
			this.DIRECTORY_CONTACTS = DIRECTORY_CONTACTS;
		}
		
		$onInit() {
			this.$state = {
				contacts: this.DIRECTORY_CONTACTS,

				departments: null,
				users: null,
				usersCache: null,
				searchName: {},

				departmentError: null,
				userError: null,
				formStatus: {
					success: null,
					error: null
				},
				formData: {},

				currentPage: 0,
				pageSize: 7,
				order: 'lastname',

				loadingResults: false
			};

			// Load departments on init
			this.DirectoryService.getDepts()
				.then(depts => {
					this.$state.departments = depts;
				})
				.catch(err => {
					this.$state.departmentError = err;
				});
		}

		getUser(person) {
			person.expert = {};
			this.DirectoryService.getExpert(person).then(expert => {
				person.expert = expert || false;
			});
		}

		removeSearchResult() {
			this.$state.searchName = {};
		}

		// MODIFY SEARCH RESULT
		// RESET CURRENT PAGE
		// CLEAR DROPDOWN LIST
		modifyResultResetDropdown() {
			this.$state.currentPage = 0;
			this.$state.searchName.department = '';
			this.getSearchResults();
		}

		// RESET CURRENT PAGE
		// CLEAR INPUT FIELD
		modifyResultClearInput() {
			this.$state.currentPage = 0;
			this.$state.searchName.firstname = '';
			this.$state.searchName.lastname = '';
			this.getSearchResults();
		}

		// PASS ORDERBY PARAMETER
		// AND CHANGE ACTIVE FILTER BUTTON
		sortBy(propertyName) {
			this.$state.order = propertyName;
		}

		smoothScroll() {
			const scrollTop = this.$element.find('#search-results').offset().top;
			$('html,body').animate({ scrollTop }, 'slow');
		}

		changePageAndScroll(plusOrMinus) {
			this.$state.currentPage = this.$state.currentPage + plusOrMinus;
			this.smoothScroll()
		}

		gotoPageAndScroll(page) {
			this.$state.currentPage = page - 1;
			this.smoothScroll()
		}

		// GET FILTERED DATA
		getSearchResults() {
			this.$state.loadingResults = true;
			if (this.$state.usersCache) {
				this.$state.users = this.$filter('filter')(this.$state.usersCache, this.$state.searchName) || [];
				this.$state.loadingResults = false;
			} else {
				this.DirectoryService.getUsers(this.$state.searchName)
					.then(users => {
						this.$state.users = this.$filter('filter')(users, this.$state.searchName) || [];
						this.$state.loadingResults = false;
						// Proactively load the whole list in the background as soon
						// as user makes their first query; early searches will be
						// handled by the `getSearchResults()` return, which provides a
						// quicker (albeit uncacheable) response and then immediately
						// kicks off a new request for the cache.
						return this.DirectoryService.getUsers()
					})
					.then(users => {
						this.$state.usersCache = users;
					})
					.catch(err => {
						this.$state.userError = err;
						this.$state.loadingResults = false;
					})
			}
		}

		// GET NUMBER OF PAGES
		numberOfPages() {
			return this.$state.users && this.$state.users.length ?
				Math.ceil(this.$state.users.length / this.$state.pageSize) :
				0;
		}

		getPageNumbers() {
			if (this.$state.users && this.$state.users.length) {
				let numberOfPages = Math.ceil(this.$state.users.length / this.$state.pageSize);
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
			const data = this.$httpParamSerializerJQLike(this.$state.formData);
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
						this.$state.formStatus.error = false;
						this.$state.formStatus.success = "Your update request was submitted successfully!";
						this.updateForm.$setUntouched();
						this.$state.formData = {};
					} else {
						console.error(response);
						throw new Error(response.data.message || 'An unknown error has occurred. Please try again!');
					}
				})
				.catch(response => {
					console.error(response);
					this.$state.formStatus.success = false;
					const message = response.data.message || 'Please try again!';
					this.$state.formStatus.error = `There was an error submitting your update request. ${message}`;
				});
		}
	}
	// end controller
};
