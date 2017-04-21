
$(document).foundation();

$("#searchResult").hide();

$('#searchButton').click(function () {
  $("#searchResult").show();
});

$('.tabs').on("click", "li", function (event) {
  $("#searchResult").hide();
});
