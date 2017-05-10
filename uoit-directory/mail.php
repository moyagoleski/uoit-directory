<?php

// ini_set('memory_limit', '64M');

require 'PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

// UN COMMENT CODE WHEN LIVE?
//$mail->SMTPDebug = 3;                               // Enable verbose debug output
// $mail->isSMTP();                                      // Set mailer to use SMTP

// THIS DOES NOT SEND TO THE E-MAIL YET BECAUSE IT'S ON LOCALHOST
// CHANGE STRUCTURE OF THIS TO IMPLEMENT INFORMATION FROM FORM


// CHANGE TO OUTLOOK
// $mail->Host = 'smtp-mail.outlook.com';  // Specify main and backup SMTP servers
$mail->Host = 'smtp-gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'moyagoleski@gmail.com';                 // SMTP username
$mail->Password = '';                           // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom('moyagoleski@gmail.com', 'Your Name');
$mail->addAddress('moyagoleski@hotmail.com', 'Friend');     // Add a recipient
// $mail->addAddress('moyagoleski@hotmail.com');               // Name is optional
$mail->addReplyTo('moyagoleski@gmail.com', 'Information');
$mail->addCC('cc@example.com');
$mail->addBCC('bcc@example.com');

// $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
// $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
// $mail->isHTML(true);                                  // Set email format to HTML


// INPUT FIELDS FROM FORM
// $bannerId   = $_POST['bannerId'];   // required
// $firstName  = $_POST['firstName'];  // required
// $lastName   = $_POST['lastName'];   // required
// $department = $_POST['department']; // required
// $title      = $_POST['title'];      // required
// $building   = $_POST['building'];   // required
// $office     = $_POST['office'];     // required
// $extension  = $_POST['extension'];  // required
// $email      = $_POST['email'];      // required


$mail->Subject = 'Update Information in the UOIT Directory.';

$mail->Body  = "Hello, I would like to update my information in the UOIT Directory.



";

// MOVE ABOUT IN $mail->Body

// \n Banner Id:  $bannerId
// \n First Name: $firstName
// \n Last Name:  $lastName
// \n Department: $department
// \n Title:      $title
// \n Building:   $building
// \n Office:     $office
// \n Extension:  $extension
// \n E-mail:     $email
// \n Thank you and hope to hear from you soon,
//
// $firstName $lastName





// $mail->Subject = 'Update Information in the UOIT Directory.';
// $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
// $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';





if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent';
}

?>
