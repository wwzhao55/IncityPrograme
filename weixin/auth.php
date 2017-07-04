<!DOCTYPE html>
<html>
<head>
	<title>印象城活动授权</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
  <style>
	body{
		text-align: center;
		width: 450px;
		height:550px;
		margin: 150px auto;
		font-family: 'Microsoft Yahei';
		border: 1px solid #efefef;
	    border-radius: 8px;
	    box-shadow: 0 0 10px 5px #eee;
	}
	h1{
		margin-bottom: 20px;
	}
	.img{
		margin-bottom: 50px;
		margin-top: 20px;
	}
  </style>
</head>
<body>
	<h1>印象城魔法精灵活动</h1>
	<hr/>
	<div class='img'><img src='../images/share/jl.png' width='300px'></div>
<?php 
	require 'config.php';
	//error_reporting(E_ALL ^ E_DEPRECATED);
	$data = json_decode(get_php_file('wx_third.php'));
	//Header("Location: https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=".APPID."&pre_auth_code=".$data->pre_auth_code."&redirect_uri=http://incity.dataguiding.com/weixin/success.html");

	function get_php_file($filename) {
	    return trim(substr(file_get_contents($filename), 15));
	}
	echo "<a href='https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=".APPID."&pre_auth_code=".$data->pre_auth_code."&redirect_uri=http://incity.dataguiding.com/weixin/success.php'><img src='https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon_button3_1.png'></a>";
	?>

</body>
</html>