$("#searchResult").hide();

$('#searchButton').click(function () {
  $("#searchResult").show();
});

// show and hide Directoy Search Result when you go to another tab
$('#searchTab').on("click", function (event) {
  // alert("search tab clicked!");
   $("#angularSearch").show();
});

$('#contactsTab').on("click", function (event) {
  // alert("contacts tab clicked!");
   $("#angularSearch").hide();
});

$('#updateTab').on("click", function (event) {
  // alert("update tab clicked!");
   $("#angularSearch").hide();
});
