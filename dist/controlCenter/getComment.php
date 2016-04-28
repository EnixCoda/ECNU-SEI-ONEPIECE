<?php

include "config.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$postData = file_get_contents("php://input");
$rateInfo = json_decode($postData);

if (!isset($rateInfo->fileId)) {
	die();
}
$fileId = $rateInfo->fileId;

$rateList = json_decode(file_get_contents($ratesAndCommentsFile));

include "config.php";

if (!isset($rateList->$fileId)) {
	echo json_encode(array(
		'res_code' => 0,
		'comments' => array()
		));
} else {
	$fileSlot = $rateList->$fileId;
	echo json_encode(array(
		'res_code' => 0,
		'comments' => $fileSlot->comments
		));
}

?>