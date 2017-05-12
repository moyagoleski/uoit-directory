// app.service('usersService', ['$http', function($http) { // DON'T FORGET ANNOTATION ['$http', function()...]
app.service('usersService', function($http) {
    // regex replace '&','UOIT','g'
    var regex = /-|UOIT|/g;
    var regex2 = /&/g;

    // MOVED FROM CONTROLLER
    var processUsers = function(items) {
        for (var i in items) {
            items[i].dirschl_school_name = items[i].dirschl_school_name.replace(regex, "");
            items[i].dirschl_school_name = items[i].dirschl_school_name.replace(regex2, "and");
        }
        return items;
    }
    var processDepts = function(items) {
        for (var i in items) {
            // store department in departments array
            // replace '&','UOIT','g'
            items[i] = items[i].dirschl_school_name;

            items[i] = items[i].replace(regex, "");
            items[i] = items[i].replace(regex2, "and");

        }
        // remove departments duplicates from departments array (dirschl_school_name) 64 left
        items = items.filter(function(elem, index, self) {
            return index == self.indexOf(elem);
        });
        // sort departments array
        items.sort();
        return items;
    }

    return {
        get: function() {
            return $http.get('https://communications.uoit.ca/apps/signature-generator/lib/directory.php') // API
                .then(function(response) {
                    return response.data.data;
                })
                .catch(function(err) {
                    console.log(err)
                }); // ERROR HANDLING!
        },
        getUsers: function() {
            return this.get()
                .then(function(data) {
                    return processUsers(data);
                });
        },
        getDepts: function() {
            return this.get()
                .then(function(data) {
                    return processDepts(data);
                });
        }
    };
});