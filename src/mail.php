<?php
error_reporting(0);
date_default_timezone_set('EST/UTC');

require 'PHPMailer/PHPMailerAutoload.php';

$mail = new PHPMailer;

// INPUT FIELDS FROM UPDATE FORM
$sendCopy    = $_POST['sendCopy'];
$bannerId   = $_POST['bannerId'];   // required
$firstName  = $_POST['firstname'];  // required
$lastName   = $_POST['lastname'];   // required
$department = $_POST['department']; // required
$position      = $_POST['position'];      // required
$building   = $_POST['building'];   // required
$office     = $_POST['office'];     // required
$extension  = $_POST['extension'];  // required
$email      = $_POST['email'];      // required
$phone      = $_POST['phone'];      // required
$subject      = $_POST['subject'];      // required
$message      = $_POST['message'];      // required
$recipient    = $_POST['recipient'];      // required

//ADD EMAIL VARIABLES DEFINITIONS
$errorMessages = "";
$sendToAddress = $recipient ? $recipient : "directory@ontariotechu.ca";
$emailSubject = $recipient ? "Email Message Sent From Directory Site" : "Update Information in the Ontario Tech Directory";
$emailMessage = $recipient ? "" : "<p>Hello, <br/>I would like to update my contact information in the <a href=\"https://ontariotechu.ca/directory\">Ontario Directory</a>.</p><p>Please use the following information to update my entry:</p>";
$signOff = $recipient ? "" : "<p>Thank you for your assistance,<br/><strong>$firstName $lastName</strong></p>";

//DEFINE SANITIZATION FILTERS
$sanitize_filterss = array(
  "email" => FILTER_SANITIZE_EMAIL,
  "bannerId" => FILTER_SANITIZE_NUMBER_INT,
  "extension" => FILTER_SANITIZE_NUMBER_INT,
  "phone" => FILTER_SANITIZE_NUMBER_INT,
  "office" => FILTER_SANITIZE_STRING,
  "firstName" => FILTER_SANITIZE_STRING,
  "lastName" => FILTER_SANITIZE_STRING,
  "department" => FILTER_SANITIZE_STRING,
  "position" => FILTER_SANITIZE_STRING,
  "building" => FILTER_SANITIZE_STRING,
  "subject" => FILTER_SANITIZE_STRING,
  "message" => FILTER_SANITIZE_STRING
);

//SANITIZE EACH INPUT FIELDS
foreach ($_POST as $key => $value) {
  $value = filter_var($value, $sanitize_filters[$key]);
}

//VALIDATE EMAIL, PHONE, EXTENSION AND BANNERID FIELD
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $errorMessages .= "Invalid email format. ";
}

if (isset($phone) && !preg_match('/^[0-9]{10}+$/', $phone)) {
  $errorMessages .= "Invalid phone format. ";
}

if (isset($extension) && !preg_match('/^[0-9]{4}+$/', $extension)) {
  $errorMessages .= "Invalid extension format. ";
}

if (isset($bannerId) && !preg_match('/^[0-9]{9}+$/', $bannerId)) {
  $errorMessages .= "Invalid bannerId format. ";
}

// AFTER PASSING THE VALIDATION TEST, SENT OUT THE EMAIL
foreach ($_POST as $key => $value) {
  $tbody .= $value ? "<tr><td><strong>$key:</strong></td><td>$value</td></tr>" : "";
}

if (!empty($errorMessages)) {
  die(json_encode(array('success' => false, 'message' => $errorMessages)));
} else {
  $mail->Host = 'smtp-mail.outlook.com';                // Specify main and backup SMTP servers
  $mail->SMTPAuth = true;                               // Enable SMTP authentic
  $mail->Username = '';                                 // SMTP username
  $mail->Password = '';                                 // SMTP password
  $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
  $mail->Port = 587;                                     // TCP port to connect to

  $mail->setFrom($email);
  $mail->isHTML(true);                                  // Set email format to HTML

  if ($sendCopy) $mail->addAddress($email);             // Copy sender if requested
  $mail->addAddress($sendToAddress);
  $mail->Subject = $emailSubject;
  $mail->Body  = "$emailMessage<table><tbody>$tbody</tbody></table>$signOff";

  if (!$mail->send()) {
    header('HTTP/1.1 400 Bad Request');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(array('success' => false, 'message' => $mail->ErrorInfo)));
  } else {
    $result = array('success' => true, 'message' => "Message sent successfully!");
    header('Content-Type: application/json');
    print json_encode($result);
  }
}
