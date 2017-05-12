<?php

require 'PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

// INPUT FIELDS FROM UPDATE FORM
$bannerId   = $_POST['bannerId'];   // required
$firstName  = $_POST['firstName'];  // required
$lastName   = $_POST['lastName'];   // required
$department = $_POST['department']; // required
$title      = $_POST['title'];      // required
$building   = $_POST['building'];   // required
$office     = $_POST['office'];     // required
$extension  = $_POST['extension'];  // required
$email      = $_POST['email'];      // required

// UN COMMENT CODE WHEN LIVE -> DOESN'T WORK ON LOCALHOST -> NO STMP
// $mail->SMTPDebug = 3;                                 // Enable verbose debug output
// $mail->isSMTP();                                      // Set mailer to use SMTP

// THIS DOES NOT SEND TO THE E-MAIL YET BECAUSE IT'S ON LOCALHOST
$mail->Host = 'smtp-mail.outlook.com';                // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
// CHANGE TO THIS WHEN LIVE
// $mail->Username = 'directory@uoit.ca.';            // SMTP username
$mail->Username = '';                                 // SMTP username
$mail->Password = '';                                 // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom($email);
$mail->addAddress($email);                                 // Add a recipient
$mail->addAddress('updateInfo@example.com', 'Friend->Example');     // Add a recipient

$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Update Information in the UOIT Directory.';

$mail->Body  = "Hello, I would like to update my information in the UOIT Directory.

\n Banner Id:  $bannerId
\n First Name: $firstName
\n Last Name:  $lastName
\n Department: $department
\n Title:      $title
\n Building:   $building
\n Office:     $office
\n Extension:  $extension
\n E-mail:     $email
\n Thank you and hope to hear from you soon,

$firstName $lastName

";

$mail->send();

if(!$mail->send()) {
    echo 'Message could not be sent, this did NOT work.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent, this should work!';
}

?>
