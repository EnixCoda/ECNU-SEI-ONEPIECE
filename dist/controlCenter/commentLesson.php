<?php

include "config.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$postData = file_get_contents("php://input");
$commentInfo = json_decode($postData);
$lessonName = $commentInfo->lessonName;
$token = $commentInfo->token;
$comment = $commentInfo->comment;
$stuId = getIDfromToken($token);

$lessons = json_decode(file_get_contents($lessonsFile));
if (isset($lessons->$lessonName)) {
	$lesson = $lessons->$lessonName;
	$lesson->$stuId = $comment;
} else {
	die();
}

?>

// lessonName -> {
//	   'stuId': 'comment',
//     ...
// }