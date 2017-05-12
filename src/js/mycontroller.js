// controller
console.clear();

app.component('directorySearch', {
    controller: 'searchCtrl',
    // `templateUrl` IS FROM <script type="text/ng-template"> IN HTML
    // CAN ALSO BE THE URL TO A REGULAR OLD HTML FILE
    // OR gulp-angular-templatecache INJECTED
    templateUrl: '/dist/template/template.html'
});

app.controller('searchCtrl', function($scope, $filter, $http, usersService) {

    var ctrl = this; // ASSIGN `this` TO A VARIABLE FOR USE INSIDE FUNCTIONS

    ctrl.$onInit = function() { // MOVE INIT LOGIC INTO AN `$onInit` HOOK

        // QUICK HACK FOR GETTING TABS WORKING INSIDE INIT
        // NORMALLY THIS WOULD NOT BE DONE WITH JQUERY, BUT THERE'S NO TIME!
        var tabs = new Foundation.Tabs($('#tab1'));

        $scope.departments = [];
        $scope.users = [];

        $scope.currentPage = 0;
        $scope.pageSize = 7;

        // MAKE SURE THE LIST LOOKS THE WAY THE CONTROLLER NEEDS IT TO
        // BEFORE IT GETS THERE, I.E. DO FILTERING IN SERVICE AND RETURN `users`
        usersService.getUsers().then(function(users) {
            $scope.users = users;
        });
        // SAME WITH DEPARTMENTS
        usersService.getDepts().then(function(depts) {
            $scope.departments = depts;
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
        $scope.searchName.dirschl_school_name = '';
    }

    // RESET CURRENT PAGE
    // CLEAR INPUT FIELD
    ctrl.modifyResultClearInput = function() {
        $scope.currentPage = 0;
        $scope.searchName.dirpepl_first_name = '';
        $scope.searchName.dirpepl_last_name = '';
    }

    // PASS ORDERBY PARAMETER
    // AND CHANGE ACTIVE FILTER BUTTON
    ctrl.sortBy = function(propertyName) {
        $scope.propertyName = propertyName;
        $scope.order = propertyName;
    };


    ctrl.smoothScroll = function() {
        // alert("CLICK!");
        $('html,body').animate({ scrollTop: $("#angularSearch").offset().top }, 'slow');
    };

    // GIVE REUSABLE CHUNKS THEIR OWN METHODS
    // TRY TO AVOID `ng-click="page = 1; fun = true; etc"`
    ctrl.changePageAndScroll = function(plusOrMinus) {
        $scope.currentPage = $scope.currentPage + plusOrMinus;
        ctrl.smoothScroll()
    }

    // GET FILTERED DATA
    ctrl.getData = function() {
        return $filter('filter')($scope.users, $scope.searchName);
    };

    // GET PAGES NUMBER
    ctrl.numberOfPages = function() {
        return Math.ceil(ctrl.getData().length / $scope.pageSize);
    };

    // // process the form
    $scope.processForm = function() {

      alert("submited");

      $http({
      method  : 'POST',
      url     : 'mail.php',
      data    : $.param($scope.formData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
     })

     .then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        alert("success");
        console.log($scope.formData);

        $scope.message = "Your form was submited successfully.";

        // CLEARS FORM :D
        $scope.updateForm.$setUntouched();
        $scope.formData = {};


      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        alert("error");
        $scope.message = "Your form was NOT submited successfully.";

      });


    };

});

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
