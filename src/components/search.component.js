export const SearchComponent = {
  templateUrl: 'search.component.html',
	controller: class Search {
		/**
		 * Inject and bind dependencies.
		 */
		constructor (
			$filter,
			$http,
			$element,
			$httpParamSerializerJQLike,
			SearchService,
			SORT_OPTIONS,
			CONTACTS_LIST
		) {
			'ngInject';
			this.$filter = $filter;
			this.$http = $http;
			this.$element = $element;
			this.$httpParamSerializerJQLike = $httpParamSerializerJQLike;
			this.SearchService = SearchService;
			this.SORT_OPTIONS = SORT_OPTIONS;
			this.CONTACTS_LIST = CONTACTS_LIST;
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
				contacts: this.CONTACTS_LIST,

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

				// pagination
				currentPage: 0,
				pageSize: 7,

				//sorting
				sortOptions: this.SORT_OPTIONS,
				sortOrder: 'lastname',

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
			this.SearchService.getDepts()
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
			this.SearchService.getExpert(person)
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
		 * @param {string} sort Name of property to sort by
		 */
		sortBy(sort) {
			this.$state.sortOrder = sort;
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
			this.smoothScrollTo(this.ID.SEARCH_RESULTS)
		}

		/**
		 * Sets the current page and re-scrolls the results into view.
		 * 
		 * @param {number} page The page to skip to
		 */
		gotoPageAndScroll(page) {
			this.$state.currentPage = page - 1;
			this.smoothScrollTo(this.ID.SEARCH_RESULTS)
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
		gotoFormAndPopulate(result) {
			console.log(result)
			this.gotoTab(result.originalEvent);
			this.$state.formData = result.data;
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
				this.SearchService.getUsers(this.$state.searchQuery)
					.then(users => {
						this.$state.users = this.$filter('filter')(users, this.$state.searchQuery) || [];
						this.$state.loadingResults = false;
						// Proactively load the whole list in the background as soon
						// as user makes their first query; early searches will be
						// handled by the `getSearchResults()` return, which provides a
						// quicker (albeit uncacheable) response and then immediately
						// kicks off a new request for the cache.
						return this.SearchService.getUsers()
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
		 * Send a filled-out update request form to the mailer script.
		 */
		onUpdateFormSubmit({ formData, form }) {
			const data = this.$httpParamSerializerJQLike(formData);
			const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
			this.$http({
				method: 'POST',
				url: 'mail.php',
				headers,
				data
			})
				.then(response => {
					if (response.data && response.data.success) {
						console.info(response);
						this.$state.formStatus.error = false;
						this.$state.formStatus.success = "Your update request was submitted successfully!";
						form.$setUntouched();
						this.$state.formData = {};
					} else {
						const error = response.data && response.data.message
							? response.data.message
							: 'Please refresh the page and try again!';
						throw new Error(error);
					}
				})
				.catch(error => {
					console.info(error);
					const errorMessage = error.status
						? `${error.status} (${error.statusText})`
						: error.message || error;
					this.$state.formStatus.success = false;
					this.$state.formStatus.error = `There was an error submitting your update request. ${errorMessage}`;
				})
				.finally(() => this.smoothScrollTo(this.ID.DIRECTORY_TABS_CONTENT));
		}
	}
	// end controller
};
