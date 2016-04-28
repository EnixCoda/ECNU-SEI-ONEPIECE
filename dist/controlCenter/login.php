<?php

include "config.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$postData = file_get_contents("php://input");
$loginInfo = json_decode($postData);


$stuId = $loginInfo->id;
$password = $loginInfo->password;

// $stuId = $_GET['stuId'];
// $password = $_GET['password'];

$response = array(
	'res_code' => 0,
	'msg' => ''
);

$loginUrl = 'http://202.120.82.2:8081/ClientWeb/pro/ajax/login.aspx';
$data = array(
	'id' => $stuId,
	'pwd' => $password,
	'act' => 'login'
	);

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data),
    ),
);
$context  = stream_context_create($options);

$result = file_get_contents($loginUrl, false, $context);
if ($result === FALSE) {
	$response['res_code'] = 1;
	$response['msg'] = "无法连接到服务器";
} else {
	$data = json_decode($result);
	if ($data->ret == 0) {
		$response['res_code'] = 1;
		$response['msg'] = "用户名或密码错误";
	} else {
		$response['msg'] = "登陆成功";
		$response['data'] = array(
			'username'=>$data->data->name,
			'cademy'=>$data->data->cls
			);

		//save to user table
		$token = md5($stuId . $password);
		$response['token'] = $token;

		$tokens = json_decode(file_get_contents($tokensFile));
		$users = json_decode(file_get_contents($usersFile));

		if (isset($users->$stuId)){ // logged in
			if ($users->$stuId->token == $token) { //password not changed, so token not changed

			} else { // update token
				$oldToken = $users->$stuId->token;

				$users->$stuId->token = $token;
				$users->$stuId->password = $password;

				$oldTokenData = $tokens->$oldToken;
				unset($tokens->$oldToken);
				$tokens->$token = $oldTokenData;
			}
		} else { // first time login
			$users->$stuId = new stdClass();
			$users->$stuId->stuId = $stuId;
			$users->$stuId->password = $password;
			$users->$stuId->token = $token;
			$tokens->$token = $stuId;
		}

		file_put_contents($tokensFile, json_encode($tokens));
		file_put_contents($usersFile, json_encode($users));
	}
}
echo json_encode($response);

?>