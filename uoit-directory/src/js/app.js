// FOUNDATION FORM SUBMISSION
// for custom error message on invalid field
$(document).bind('invalid.zf.abide',function(e) {
  // alert("Sorry, not valid");
});
// to submit via ajax, add the 2 bindings below.
$(document)
.bind("submit", function(e) {
  // e.preventDefault();
  // message to show that is was been sent
  alert("Your update request has been sent! Note: Your request will not be changed right away.");
  // deletes/resests all text within input fields
  var form = document.getElementById("updateForm");
  form.reset();
})

.bind("formvalid.zf.abide", function(e,$form) {
  // ajax submit
});

// smooth scroll to top of ‘Directory Search Results’
$(".scrollTop").click(function() {
    $('html,body').animate({
        scrollTop: $("#angularSearch").offset().top},
        'slow');
});
