<?php

include "config.php";

function securityCheck($token) {
	$tokens = json_decode(file_get_contents("../storage/tokens.json"));
	return isset($tokens->$token);
}

function getIDfromToken($token) {
	$tokens = json_decode(file_get_contents("../storage/tokens.json"));
	return $tokens->$token;
}

?>