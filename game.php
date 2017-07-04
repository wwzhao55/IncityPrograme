<?php
//记录用户信息
require 'weixin/config.php';
	error_reporting(E_ALL ^ E_DEPRECATED);
	try {
	    $pdo = new PDO('mysql:host=121.42.136.52;dbname=statistics;port=3306','deling','redhatredhat');
	} catch (PDOException $e) {
	    die("数据库连接失败".$e->getMessage());
	}
	
	$pdo->exec('set names utf8');

	if(check_table_is_exist($pdo,'incity_users')!=true){
		//表不存在	
		$create_t="create table incity_users
		(id int not null auto_increment,
		 PRIMARY KEY(id),
		 openid varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
		 time int(11),
		 game varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
		 page int(4),
		 source varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
		 latitude decimal(10,6) default 0,
		 longitude decimal(10,6) default 0
		 )";
		$pdo->exec($create_t);
	}
	$code = isset($_GET['code'])?$_GET['code']:'';
	$source = $_GET['source'];
	$game = $_GET['state'];
	$appid = isset($_GET['appid'])?$_GET['appid']:'';
	$serverId = $_GET['serverId'];

	$auth_content = json_decode(get_php_file('weixin/wx_auth.php'));
	$third_content = json_decode(get_php_file('weixin/wx_third.php'));
	if($appid!=$auth_content->appid){
		echo "公众号信息不符！";
		exit;
	}
	$openid = getOpenid($code,$appid,APPID,$third_content->component_access_token);
	//关闭连接
	$pdo = null;

	if($serverId=='0'){
		Header("Location: http://incity.dataguiding.com/game.html?openid=".$openid."&source=".$source);
	}else{
		Header("Location: http://incity.dataguiding.com/receive.html?openid=".$openid."&serverId=".$serverId.'&source='.$source);
	}

	function getOpenid($code,$appid,$component_appid,$component_access_token){
		$token_url = 'https://api.weixin.qq.com/sns/oauth2/component/access_token?appid='.$appid.'&code='.$code.'&grant_type=authorization_code&component_appid='.$component_appid.'&component_access_token='.$component_access_token;
		$token = json_decode(file_get_contents($token_url));
		if (isset($token->errcode)) {
    		echo '<h1>错误：</h1>'.$token->errcode;
    		echo '<br/><h2>错误信息：</h2>'.$token->errmsg;
    		exit;
		}
		$openid = $token->openid;	
		return $openid;
	}

	function check_table_is_exist($pdo,$table)
    {
        $result = $pdo->query("SHOW TABLES LIKE '". $table."'");
		$row = $result->fetchAll();

		if(count($row)){
		    return true;
		} else {
		    return false;
		}
    }

	function http_post_json($url, $jsonStr) {  
      $ch = curl_init();  
      curl_setopt($ch, CURLOPT_POST, 1);  
      curl_setopt($ch, CURLOPT_URL, $url);  
      curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStr);  
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //不验证证书，这一点很重要因为是HTTPS请求，  
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); //不验证证书  
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  
      curl_setopt($ch, CURLOPT_HTTPHEADER, array(  
          'Content-Type: application/json; charset=utf-8',  
          'Content-Length: ' . strlen($jsonStr)  
        )  
      );  
      $response = curl_exec($ch);  
      $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
      return $response;  
    }  

    function get_php_file($filename) {
	    return trim(substr(file_get_contents($filename), 15));
	}