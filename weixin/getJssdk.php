<?php
	require 'config.php';
	require 'jssdk.php';
	if(isset($_POST['url']) && $_POST['url']){
		if($_SERVER['REQUEST_METHOD']=='POST'){
			$auth_content = json_decode(get_php_file('wx_auth.php'));
			$jssdk = new Jssdk($auth_content->appid,$_POST['url']);
			$signature = $jssdk->getSignPackage();
			echo json_encode(array('status'=>'success','signature'=>$signature));

		}
	}else{
		echo json_encode(array('status'=>'fail'));
		exit;
	}
	
	

	function get_php_file($filename) {
	    return trim(substr(file_get_contents($filename), 15));
	}