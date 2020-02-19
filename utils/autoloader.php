<?php
spl_autoload_register(function ($class){
	$classpath = dirname(__FILE__)."/class/{$class}.php";
	if(file_exists($classpath)){
		require_once($classpath);
	}else{
		$return["code"] = 0;
		$return["msg"] = "致命错误:指定的类文件不存在.(FATAL_ERROR_SPECIFIED_CLASS_FILE_DOES_NOT_EXIST)";
		echo json_encode($return,JSON_UNESCAPED_UNICODE);
		exit();
	}
});