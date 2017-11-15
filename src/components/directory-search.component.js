export const DirectorySearchComponent = {
  templateUrl: 'directory-search.component.html',
  controller: function(
		$scope,
		$filter,
		$http,
		$element,
		$httpParamSerializerJQLike,
		DirectoryService,
		DIRECTORY_CONTACTS
	) {
		'ngInject';
		var ctrl = this; // ASSIGN `this` TO A VARIABLE FOR USE INSIDE FUNCTIONS

		ctrl.$onInit = function() {

			$scope.contacts = DIRECTORY_CONTACTS;
			$scope.departments = null;
			$scope.users = null;
			$scope.usersCache = null;
			$scope.searchName = {};

			$scope.departmentError = null;
			$scope.userError = null;
			$scope.formStatus = {
				success: null,
				error: null
			};

			$scope.currentPage = 0;
			$scope.pageSize = 7;
			$scope.loadingResults = false;

			// Load departments on init
			DirectoryService.getDepts()
				.then(function(depts) {
					$scope.departments = depts;
				})
				.catch(function(err) {
					$scope.departmentError = err;
				});

		}
		
		ctrl.getUser = function(person) {
			person.expert = {};
			DirectoryService.getExpert(person).then(function(expert) {
				person.expert = expert || false;
    	});
		}

		// MAKE `$scope` METHODS INTO CONTROLLER METHODS
		// ASSIGN THEM TO OUR `ctrl` VARIABLE INSTEAD OF `$scope`, I.E. `this`
		// USE THEM IN HTML WITH `ng-click="$ctrl.removeSearchResult()"`
		// TRY TO COMPLETELY REMOVE `$scope` FROM CONTROLLER AND HTML
		ctrl.removeSearchResult = function() {
			$scope.searchName = {};
		};

		// MODIFY SEARCH RESULT
		// RESET CURRENT PAGE
		// CLEAR DROPDOWN LIST
		ctrl.modifyResultResetDropdown = function() {
			$scope.currentPage = 0;
			$scope.searchName.department = '';
			ctrl.getSearchResults();
		}

		// RESET CURRENT PAGE
		// CLEAR INPUT FIELD
		ctrl.modifyResultClearInput = function() {
			$scope.currentPage = 0;
			$scope.searchName.firstname = '';
			$scope.searchName.lastname = '';
			ctrl.getSearchResults();
		}

		// PASS ORDERBY PARAMETER
		// AND CHANGE ACTIVE FILTER BUTTON
		ctrl.sortBy = function(propertyName) {
			$scope.order = propertyName;
		};


		ctrl.smoothScroll = function() {
			const scrollTop = $element.find('#search-results').offset().top;
			$('html,body').animate({ scrollTop }, 'slow');
		};

		// GIVE REUSABLE CHUNKS THEIR OWN METHODS
		// TRY TO AVOID `ng-click="page = 1; fun = true; etc"`
		ctrl.changePageAndScroll = function(plusOrMinus) {
			$scope.currentPage = $scope.currentPage + plusOrMinus;
			ctrl.smoothScroll()
		}

		ctrl.gotoPageAndScroll = function(page) {
			$scope.currentPage = page - 1;
			ctrl.smoothScroll()
		}

		// GET FILTERED DATA
		ctrl.getSearchResults = function() {
			$scope.loadingResults = true;
			if ($scope.usersCache) {
				$scope.users = $filter('filter')($scope.usersCache, $scope.searchName) || [];
				$scope.loadingResults = false;
			} else {
				DirectoryService.getUsers($scope.searchName)
					.then(function(users) {
						$scope.users = $filter('filter')(users, $scope.searchName) || [];
						$scope.loadingResults = false;
						// Proactively load the whole list in the background as soon
						// as user makes their first query; early searches will be
						// handled by the `getSearchResults()` return, which provides a
						// quicker (albeit uncacheable) response and then immediately
						// kicks off a new request for the cache.
						return DirectoryService.getUsers()
					})
					.then(function(users) {
						$scope.usersCache = users;
					})
					.catch(function(err) {
						$scope.userError = err;
						$scope.loadingResults = false;
					})
			}
		};

		// GET PAGES NUMBER
		ctrl.numberOfPages = function() {
			return $scope.users && $scope.users.length ?
				Math.ceil($scope.users.length / $scope.pageSize) :
				0;
		};

		ctrl.getPageNumbers = function() {
			if ($scope.users && $scope.users.length) {
				let numberOfPages = Math.ceil($scope.users.length / $scope.pageSize);
				const pageNumArray = [];
				while (numberOfPages) {
					pageNumArray.push(numberOfPages);
					numberOfPages--;
				}
				return pageNumArray.reverse();
			} else {
				return [1];
			}
		};

		// // process the form
		$scope.processForm = function() {
			$http({
				method:  'POST',
				url:     'mail.php',
				data:    $httpParamSerializerJQLike($scope.formData), //$.param($scope.formData),  // pass in data as strings
			  // paramSerializer: '$httpParamSerializerJQLike',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}  // set the headers so angular passing info as form data (not request payload)
			})
			.then(response => {
				if (response.data.success) {
					console.info(response);
					$scope.formStatus.error = false;
					$scope.formStatus.success = "Your update request was submitted successfully!";
					$scope.updateForm.$setUntouched();
					$scope.formData = {};
				} else {
					console.error(response);
					throw new Error(response.data.message || 'An unknown error has occurred. Please try again!');
				}
			})
			.catch(response => {
				console.error(response);
				$scope.formStatus.success = false;
				const message = response.data.message || 'Please try again!';
				$scope.formStatus.error = `There was an error submitting your update request. ${message}`;
			});
		};

	}
};
