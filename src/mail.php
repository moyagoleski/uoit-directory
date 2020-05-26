<?php
error_reporting(0);
date_default_timezone_set('EST/UTC');

require 'PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

// INPUT FIELDS FROM UPDATE FORM
$sendCopy		= $_POST['sendCopy'];
$bannerId   = $_POST['bannerId'];   // required
$firstName  = $_POST['firstname'];  // required
$lastName   = $_POST['lastname'];   // required
$department = $_POST['department']; // required
$title      = $_POST['position'];      // required
$building   = $_POST['building'];   // required
$office     = $_POST['office'];     // required
$extension  = $_POST['extension'];  // required
$email      = $_POST['email'];      // required

$mail->Host = 'smtp-mail.outlook.com';                // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentic
$mail->Username = '';                                 // SMTP username
$mail->Password = '';                                 // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 587;   																	// TCP port to connect to

$mail->setFrom($email);
if ($sendCopy) $mail->addAddress($email);             // Copy sender if requested
$mail->addAddress('directory@ontariotechu.ca');
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Update Information in the Ontario Tech Directory.';
$mail->Body  = "<p>Hello,
<br/>I would like to update my contact information in the <a href=\"https://ontariotechu.ca/directory\">Ontario Directory</a>.</p>
<p>Please use the following information to update my entry:</p>
<table>
<tbody>
<tr>
<td><strong>Banner ID:</strong></td>
<td>$bannerId</td>
</tr>
<tr>
<td><strong>First Name:</strong></td>
<td>$firstName</td>
</tr>
<tr>
<td><strong>Last Name:</strong></td>
<td>$lastName</td>
</tr>
<tr>
<td><strong>Department:</strong></td>
<td>$department</td>
</tr>
<tr>
<td><strong>Title:</strong></td>
<td>$title</td>
</tr>
<tr>
<td><strong>Building:</strong></td>
<td>$building</td>
</tr>
<tr>
<td><strong>Office:</strong></td>
<td>$office</td>
</tr>
<tr>
<td><strong>Extension:</strong></td>
<td>$extension</td>
</tr>
<tr>
<td><strong>E-mail:</strong></td>
<td>$email</td>
</tr>
</tbody>
</table>
<p>Thank you for your assistance,<br/>
<strong>$firstName $lastName</strong></p>
";

if(!$mail->send()) {
  header('HTTP/1.1 400 Bad Request');
  header('Content-Type: application/json; charset=UTF-8');
  die(json_encode(array('success' => false, 'message' => $mail->ErrorInfo)));
} else {
	$result = array('success' => true, 'message' => "Message sent successfully!");
  header('Content-Type: application/json');
  print json_encode($result);
}
?>