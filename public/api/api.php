<?php
include_once dirname(__FILE__,3)."/utils/autoloader.php";
include_once dirname(__FILE__,3)."/config/config.php";

$n = new netease();
$t = new toolbox();

switch($_REQUEST["action"]){
	case "login":
		login();
		break;
}

$baseUrl = $t->config("neteaseAPI");
function login(){
	$t = new toolbox();
	$baseUrl = $t->config("neteaseAPI");
	$acc = $t->config("neteaseAccount");
	$psw = $t->config("neteasePassword");
	$requestUrl = $baseUrl."/login/cellphone?phone={$acc}&password={$psw}";
	$ch = curl_init($requestUrl);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch, CURLOPT_NOBODY, false); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$content = curl_exec($ch);
	curl_close($ch);
	preg_match_all("/(?<=Set-Cookie: ).*?(?=;)/i", $content, $headerMatch);
	preg_match_all("/(?<=\"account\":\{\"id\":)\d+/", $content, $uidMatch);
	$header = "Cookie: ".implode(";",$headerMatch[0]);
	$return["header"] = $header;
	$return["uid"] = $uidMatch[0][0];
	return $return;
}
$headerArray[] = login()["header"];
$requestUrl = $baseUrl.$_REQUEST["resource"];
$ch = curl_init($requestUrl);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_NOBODY, false); 
curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$content = curl_exec($ch);
echo $content;