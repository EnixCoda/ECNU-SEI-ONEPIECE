<?php

if (!isset($_GET) || !isset($_GET["fileId"])) {
	die();
}
$fileId = $_GET["fileId"];
$getDownloadLinkUrl = "http://api.189.cn/ChinaTelecom/getFileDownloadUrl.action";
$app_id = "916348060000251305";
$access_token = "67c0a79a63d5d3f6e9d631ef15c1d0f41461034732687";
$getShortLink = false;

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'method'  => 'GET'
    ),
);
$context  = stream_context_create($options);
$result = file_get_contents($getDownloadLinkUrl . "?app_id=" . $app_id . "&access_token=" . $access_token . "&fileId=" . $fileId . "&short=" . $getShortLink, false, $context);
if ($result === FALSE) {
	die(json_encode(array(
		'res_code' => 1,
		'msg' => "CONNECTION_ERROR"
		)));
} else {
	$data = json_decode($result, true);
	if ($data["res_code"] != 0) {
		die(json_encode(array(
			'res_code' => 1,
			'msg' => "EXCEPTION_OCCURRED"
			)));
	} else {
		echo json_encode(array(
			'res_code' => 0,
			'msg' => 'success',
			'downloadLink' => $data["fileDownloadUrl"]
			));
	}
}
?>