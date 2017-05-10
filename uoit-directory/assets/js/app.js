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
  // $.ajax({
  //      type: "POST",
  //      url:"mail.php", //runs the php code
  //      data: dataString, //stores the data to be passed
  //      success: function(data){ // if success then generate the div and append the the following
  //       alert("This works");
  //     },
  //      error: function(error){ //this is to check if there is any error
  //        alert("This does not works");
  //      }
  //    }); //End Ajax call });
});
