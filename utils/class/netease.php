<?php
class netease{
	public function login(){
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
	public function getPlaylists($uid, $header){
		$t = new toolbox();
		$baseUrl = $t->config("neteaseAPI");
		$requestUrl = $baseUrl."/user/playlist?uid={$uid}";
		$headerArray[] = $header;
		$ch = curl_init($requestUrl);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$content = json_decode(curl_exec($ch), TRUE);
		$i = 0;
		foreach($content["playlist"] as $k => $v){
			$return["playlists"][$i]["id"] = $v["id"];
			$return["playlists"][$i]["name"] = preg_replace("/\.+$/", "", $v["name"]);
			if($v["creator"]["userId"] == $uid){
				$return["playlists"][$i]["owned"] = TRUE;
			}else{
				$return["playlists"][$i]["owned"] = FALSE;
			}
			$i++;
		}
		return $return;
	}
	public function getPlaylistDetail($id, $header){
		$t = new toolbox();
		$baseUrl = $t->config("neteaseAPI");
		$requestUrl = $baseUrl."/playlist/detail?id={$id}";
		$headerArray[] = $header;
		$ch = curl_init($requestUrl);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$content = json_decode(curl_exec($ch), TRUE);
		foreach($content["playlist"]["trackIds"] as $k => $v){
			$ids[] = $v["id"];
		}
		return $ids;
	}
	public function getSongDetails($ids, $header){
		if(is_array($ids)){
			$id = implode(",",$ids);
		}else{
			$id = $ids;
		}
		$t = new toolbox();
		$baseUrl = $t->config("neteaseAPI");
		$requestUrl = $baseUrl."/song/detail?ids={$id}";
		$headerArray[] = $header;
		$ch = curl_init($requestUrl);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$content = json_decode(curl_exec($ch), TRUE);
		$i = 0;
		foreach($content["songs"] as $k => $v){
			$arTmp = Array();
			$arCount = 0;
			foreach($v["ar"] as $kk => $vv){
				if($arCount < 3){
					$arTmp[] = $vv["name"];
					$arCount++;
				}
			}
			$songs[$i]["artist"] = str_replace(["?", "*", ":", "\"", "/", "\\", "<", ">", "|"], ["？", "＊", "：", "＂", "／", "＼", "＜", "＞", "｜"], implode(",",$arTmp));
			$songs[$i]["name"] = str_replace(["?", "*", ":", "\"", "/", "\\", "<", ">", "|"], ["？", "＊", "：", "＂", "／", "＼", "＜", "＞", "｜"], preg_replace("/\s+$/", "", $v["name"]));
			$songs[$i]["id"] = $v["id"];
			$i++;
		}
		return $songs;
	}
	public function getSongUrl($ids, $header){
		if(is_array($ids)){
			$id = implode(",",$ids);
		}else{
			$id = $ids;
		}
		$t = new toolbox();
		$baseUrl = $t->config("neteaseAPI");
		$requestUrl = $baseUrl."/song/url?id={$id}";
		$headerArray[] = $header;
		$ch = curl_init($requestUrl);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headerArray);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$content = json_decode(curl_exec($ch), TRUE);
		$i = 0;
		foreach($content["data"] as $k => $v){
			$urls[$i]["url"] = $v["url"];
			$urls[$i]["suffix"] = $v["type"];
			$i++;
		}
		return $urls;
	}
}
?>