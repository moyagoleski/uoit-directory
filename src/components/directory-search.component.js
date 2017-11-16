export const DirectorySearchComponent = {
  templateUrl: 'directory-search.component.html',
	controller: class DirectorySearch {
		/**
		 * Inject and bind dependencies.
		 */
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
		
		/**
		 * Initialize component.
		 */
		$onInit() {
			/**
			 * A component-local store to encapsulate application state.
			 */
			this.$state = {
				// common contacts tab data
				contacts: this.DIRECTORY_CONTACTS,

				// directory API data
				departments: null,
				users: null,
				usersCache: null,

				// user's current search query 
				searchQuery: {},

				// data and status of contact update form
				formData: {
					sendCopy: null,
					bannerId: null,
					firstname: null,
					lastname: null,
					department: null,
					position: null,
					building: null,
					office: null,
					extension: null,
					email: null
				},
				formStatus: {
					success: null,
					error: null
				},
				departmentError: null,
				userError: null,

				// pagination and sorting
				currentPage: 0,
				pageSize: 7,
				order: 'lastname',

				// whether results are currently loading
				loadingResults: false
			};

			/**
			 * A map of DOM element IDs as string constants.
			 */
			this.ID = {
				SEARCH_RESULTS: 'search-results',
				DIRECTORY_TABS: 'directory-tabs',
				DIRECTORY_TABS_CONTENT: 'directory-tabs-content'
			};

			// Load all departments on app initialization
			this.DirectoryService.getDepts()
				.then(depts => this.$state.departments = depts)
				.catch(err => this.$state.departmentError = err);
		}

		/**
		 * Checks a directory entry against the experts list and
		 * populates expert data on entry if found.
		 * 
		 * @param {object} person Full directory entry object
		 */
		getUser(person) {
			person.expert = {};
			this.DirectoryService.getExpert(person)
				.then(expert => person.expert = expert || false)
				.catch(err => {
					console.error(err);
					person.expert = false;
				});
		}

		/**
		 * Clears the search query fields.
		 */
		removeSearchResult() {
			this.$state.searchQuery = {};
		}

		/**
		 * Sets the current page back to the first and clears the
		 * department query before getting new results, i.e. after
		 * the user types a new query.
		 */
		modifyResultResetDropdown() {
			this.$state.currentPage = 0;
			this.$state.searchQuery.department = '';
			this.getSearchResults();
		}

		/**
		 * Sets the current page back to the first and clears the
		 * name query before getting new results, i.e. after
		 * the user selects a new department.
		 */
		modifyResultClearInput() {
			this.$state.currentPage = 0;
			this.$state.searchQuery.firstname = '';
			this.$state.searchQuery.lastname = '';
			this.getSearchResults();
		}

		/**
		 * Sets the sort order of search results to a given property.
		 * 
		 * @param {string} propertyName Name of prop to sort by
		 */
		sortBy(propertyName) {
			this.$state.order = propertyName;
		}

		/**
		 * Smoothly scrolls the page to the top of a given element by ID.
		 * 
		 * @param {string} id The ID of the element to scroll to
		 */
		smoothScrollTo(id) {
			const scrollTop = this.$element.find(`#${id}`).offset().top;
			$('html, body').animate({ scrollTop }, 'slow');
		}

		/**
		 * Changes the current page and re-scrolls the results into view.
		 * 
		 * @param {number} plusOrMinus Number of pages to change (pos. or neg.)
		 */
		changePageAndScroll(plusOrMinus) {
			this.$state.currentPage = this.$state.currentPage + plusOrMinus;
			this.smoothScroll(this.ID.SEARCH_RESULTS)
		}

		/**
		 * Sets the current page and re-scrolls the results into view.
		 * 
		 * @param {number} page The page to skip to
		 */
		gotoPageAndScroll(page) {
			this.$state.currentPage = page - 1;
			this.smoothScroll(this.ID.SEARCH_RESULTS)
		}

		/**
		 * Sets the active tab by the `#hash` of a clicked link.
		 * 
		 * @param {Event} event DOM event that call originated from
		 */
		gotoTab(event) {
			event.preventDefault();
			const $tabs = $(event.target.hash);
			$(`#${this.ID.DIRECTORY_TABS}`).foundation('selectTab', $tabs);
		}

		/**
		 * Sets the active tab to the "update contact" tab, pre-fills
		 * the form with a directory entry's data, and smooth scrolls to it.
		 * 
		 * @param {Event} event DOM event that call originated from
		 * @param {object} data Entry data to populate form with
		 */
		gotoFormAndPopulate(event, data) {
			this.gotoTab(event);
			this.$state.formData = data;
			this.smoothScrollTo(this.ID.DIRECTORY_TABS_CONTENT);
		}

		/**
		 * Performs a search against the directory. Keeps an internal cache
		 * of results, and uses client filtering if results already cached.
		 */
		getSearchResults() {
			this.$state.loadingResults = true;
			if (this.$state.usersCache) {
				this.$state.users = this.$filter('filter')(this.$state.usersCache, this.$state.searchQuery) || [];
				this.$state.loadingResults = false;
			} else {
				this.DirectoryService.getUsers(this.$state.searchQuery)
					.then(users => {
						this.$state.users = this.$filter('filter')(users, this.$state.searchQuery) || [];
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

		/**
		 * Get a count of available pages to paginate through.
		 * @return {number} Count of pages available
		 */
		numberOfPages() {
			return this.$state.users && this.$state.users.length ?
				Math.ceil(this.$state.users.length / this.$state.pageSize) :
				0;
		}

		/**
		 * Get an list of page numbers available to paginate through.
		 * @return {number[]} Array of page numbers available
		 */
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

		/**
		 * Send a filled-out update request form to the mailer script.
		 */
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
