<?php

include "config.php";
include "security_check.php";

$postData = file_get_contents("php://input");
$rateInfo = json_decode($postData);

$fileId = $rateInfo->fileId;
$score = $rateInfo->score;
$token = $rateInfo->token;

if (!securityCheck($token)) {
	die();
} else {
	$stuId = getIDfromToken($token);
}

if (is_numeric($score)) {
	if (intval($score) > 0) {
		$score = 1;
	}
	if (intval($score) < 0) {
		$score = -2;
	}
}

$COMMENTS = json_decode(file_get_contents($ratesAndCommentsFile));

if (!isset($COMMENTS->$fileId)) {
	$COMMENTS->$fileId = new stdClass();
	$COMMENTS->$fileId->totalScore = 0;
	$COMMENTS->$fileId->scores = new stdClass();
	$COMMENTS->$fileId->comments = array();
}
$fileSlot = $COMMENTS->$fileId;
if (isset($fileSlot->scores->$stuId)) {
	$lastScore = $fileSlot->scores->$stuId;
	$fileSlot->totalScore -= $lastScore;
}
$fileSlot->totalScore += $score;
$fileSlot->scores->$stuId = $score;

file_put_contents($ratesAndCommentsFile, json_encode($COMMENTS));

?>