<?php

include "config.php";
include "security_check.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$postData = file_get_contents("php://input");
$commentInfo = json_decode($postData);

$username = $commentInfo->username;
$fileId = $commentInfo->fileId;
$comment = $commentInfo->comment;
$token = $commentInfo->token;

if (!securityCheck($token)) {
	die();
} else {
	$stuId = getIDfromToken($token);
}

$COMMENTS = json_decode(file_get_contents($ratesAndCommentsFile));

if (!isset($COMMENTS->$fileId)) {
	$COMMENTS->$fileId = new stdClass();
	$COMMENTS->$fileId->totalScore = 0;
	$COMMENTS->$fileId->scores = new stdClass();
	$COMMENTS->$fileId->comments = array();
}

$fileSlot = $COMMENTS->$fileId;

array_push($fileSlot->comments, array(
	"comment" => $comment,
	"username" => $username,
	"stuId" => $stuId));
file_put_contents($ratesAndCommentsFile, json_encode($COMMENTS));

?>