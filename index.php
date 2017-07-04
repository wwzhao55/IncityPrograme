<?php
require 'weixin/config.php';

error_reporting(E_ALL ^ E_DEPRECATED);
$source = isset($_GET['source'])?$_GET['source']:0;
$game = isset($_GET['game'])?$_GET['game']:0;
$serverId = isset($_GET['serverId'])?$_GET['serverId']:'0';
$redirect_url = urlencode('http://incity.dataguiding.com/game.php?source='.$source.'&serverId='.$serverId);
$auth_content = json_decode(get_php_file('weixin/wx_auth.php'));

Header("Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$auth_content->appid."&redirect_uri=".$redirect_url."&response_type=code&scope=snsapi_base&state=".$game."&component_appid=".APPID."#wechat_redirect");

function get_php_file($filename) {
	    return trim(substr(file_get_contents($filename), 15));
	}
