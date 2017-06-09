<?php
date_default_timezone_set('EST/UTC');

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
// $mail->addAddress('updateInfo@example.com', 'Friend->Example');     // Add a recipient
$mail->isHTML(true);                                  // Set email format to HTML
$mail->Subject = 'Update Information in the UOIT Directory.';
$mail->Body  = "<p>Hello,
<br/>I would like to update my contact information in the <a href=\"https://uoit.ca/directory\">UOIT Directory</a>.</p>
<p>Please use the following information to update my entry:</p>
<table>
<tbody>
<tr>
<td><strong>Banner Id:</strong><td>
<td>$bannerId</td>
</tr>
<tr>
<td><strong>First Name:</strong><td>
<td>$firstName</td>
</tr>
<tr>
<td><strong>Last Name:</strong><td>
<td>$lastName</td>
</tr>
<tr>
<td><strong>Department:</strong><td>
<td>$department</td>
</tr>
<tr>
<td><strong>Title:</strong><td>
<td>$title</td>
</tr>
<tr>
<td><strong>Building:</strong><td>
<td>$building</td>
</tr>
<tr>
<td><strong>Office:</strong><td>
<td>$office</td>
</tr>
<tr>
<td><strong>Extension:</strong><td>
<td>$extension</td>
</tr>
<tr>
<td><strong>E-mail:</strong><td>
<td>$email</td>
</tr>
</tbody>
</table>
<p>Thank you for your assistance,<br/>
<strong>$firstName $lastName</strong></p>
";

if(!$mail->send()) {
    echo 'Message could not be sent, this did NOT work.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'Message has been sent, this should work!';
}
?>