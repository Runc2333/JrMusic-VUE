<?php
include_once dirname(__FILE__,3)."/config/config.php";
class toolbox{
	/*----------------------------
			   发送请求
	------------------------------*/
	public function sendRequest($requestUrl, $decode=true){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $requestUrl);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$result = curl_exec($ch);
		curl_close($ch);
		if ($decode){
			$result = json_decode($result, true);
		}
		return $result;
	}

	/*----------------------------
			   返回错误
	------------------------------*/
	public function returnError($msg, $errorCode=FALSE, $disableHelp=FALSE){
		global $con;
		if($con){
			mysqli_close($con);
		}
		if($disableHelp === FALSE){
			$msg = $msg;
		}else{
			$msg = "未定义的错误.";
		}
		$return["code"] = 0;
		if($errorCode === FALSE){
			$return["msg"] = $msg;
		}else{
			$return["msg"] = "{$msg}({$errorCode})";
		}
		echo json_encode($return, JSON_UNESCAPED_UNICODE);
		exit();
	}

	/*----------------------------
			   返回数据
	------------------------------*/
	public function returnData($data=null,$msg="success"){
		global $con;
		if($con){
			mysqli_close($con);
		}
		$return["code"] = 1;
		$return["msg"] = $msg;
		if($data !== null){
			$return["data"] = $data;
		}
		echo json_encode($return,JSON_UNESCAPED_UNICODE);
		exit();
	}

	/*----------------------------
			  连接数据库
	------------------------------*/
	public function connectDB(){
		global $System_Config;
		$mysqlHost = $this->config("mysqlHost");
		$mysqlUser = $this->config("mysqlUser");
		$mysqlPassword = $this->config("mysqlPassword");
		$mysqlDatabase = $this->config("mysqlDatabase");
		$con = mysqli_connect($mysqlHost, $mysqlUser, $mysqlPassword, $mysqlDatabase);//连接mysql数据库
		if (!$con) {
			returnError("基础工具包错误:未能建立数据库连接.(TOOLBOX_ESTABLISH_DATABASE_CONNECTION_FAILED)<br><br>Mysql错误信息:<br>".mysqli_connect_error());
		}else{
			$con->query("SET NAMES utf8");
			return $con;
		}
	}

	/*----------------------------
			   PDF转JPG
	------------------------------*/
	public function pdf2jpg($pdf,$path){
		if (!extension_loaded('imagick')) {
			returnError("基础工具包错误:未能找到ImageMagick拓展.(TOOLBOX_UNABLE_TO_FIND_IMGICK)");
		}
		if (!file_exists($pdf)) {
			returnError("基础工具包错误:指定的PDF文件不存在.(TOOLBOX_SPECIFIED_PDF_FILE_DOES_NOT_EXIST)");
		}
		if(!is_dir($path)){
			mkdir($path,0644,true);
		}
		$im = new Imagick();
		$im->setResolution(140, 140);
		$im->setCompressionQuality(100);
		$im->readImage($pdf);
		foreach ($im as $k => $v) {
			$v->setImageFormat('jpg');
			echo $k."<br>";
			$fileName = $path.basename($pdf)."_".date("Ymdhis").'.jpg';
			if ($v->writeImage($fileName) == true) {
				$return[] = $fileName;
			}
		}
		returnData($return);
	}

	/*----------------------------
			 转base64并压缩
	------------------------------*/
	public function encodeImageIntoBase64($image){
		try{
			$im = new Imagick();
			$im->readImage($image);
			$width = $im->getImageWidth();
			$height = $im->getImageHeight();
			if($width != $height){
				$min = $width > $height ? $height : $width;
				$x = $width > $height ? ($width / 2) - ($min / 2) : 0;
				$y = $height > $width ? ($height / 2) - ($min / 2) : 0;
				$im->cropImage($min,$min,$x,$y);
			}
			$im->scaleImage(256,256,true);
			$im->setImageFormat("png");
			$formatted = $im->getImageBlob();
			$base64 = base64_encode($formatted);
			return "data:image/png;base64,{$base64}";
		}catch(\Throwable $e){
			//echo $e;
			returnError("基础工具包错误:转码图片时出现错误.(TOOLBOX_ENCODE_IMAGE_ERROR)");
		}
	}

	/*----------------------------
			 检查所需参数
	------------------------------*/
	public function checkParameter($requiredParameterString, $errorCode, $strict=TRUE){
		$requiredParameter = explode(",", $requiredParameterString);
		if($strict){
			foreach($requiredParameter as $k => $v){
				if(!isset($_REQUEST[$v]) || $_REQUEST[$v] == ""){
					returnError("运行时错误:缺少参数.({$errorCode})");
				}
			}
		}else{
			foreach($requiredParameter as $k => $v){
				if(!isset($_REQUEST[$v])){
					returnError("运行时错误:缺少参数.({$errorCode})");
				}
			}
		}
		return true;
	}

	/*----------------------------
			  获取设置项
	------------------------------*/
	public function config($parameter){
		global $System_Config;
		if(isset($System_Config[$parameter])){
			return $System_Config[$parameter];
		}else{
			$this->returnError("基础工具包错误:指定的设置项不存在", "TOOLBOX_SPECIFIC_CONFIG_PARAMETER_DOES_NOT_EXIST");
		}
	}
	
	/*----------------------------
			  随机字符串
	------------------------------*/
	public function randomStr($num){
		$strs = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890qwertyuiopasdfghjklzxcvbnm";
		$rand = substr(str_shuffle($strs), mt_rand(0,strlen($strs)-11), $num);
		return $rand;
	}

}
?>