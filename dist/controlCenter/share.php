<?php
$postdata = file_get_contents("php://input");
$link = $postdata;
$shares = json_decode(file_get_contents('shares.json'), true);
array_push($shares, $link);
file_put_contents('shares.json', json_encode($shares));

?>