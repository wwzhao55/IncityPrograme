<?php
//全网发布验证
	include_once("openwx/wxBizMsgCrypt.php");
	include_once("config.php");
	error_reporting(E_ALL ^ E_DEPRECATED);

	//接受数据
	$timestamp = $_REQUEST['timestamp'];
	$nonce = $_REQUEST['nonce'];
	$msg_signature = $_REQUEST['msg_signature'];
	if(!$timestamp || !$nonce || !$msg_signature){
		error_log('无效参数',3,"error_log.log");
		return false;
	}
	$encryptMsg = file_get_contents('php://input');

	$xml_tree = new DOMDocument();
	$xml_tree->loadXML($encryptMsg);
    $array_a = $xml_tree->getElementsByTagName('ToUserName');
	$array_e = $xml_tree->getElementsByTagName('Encrypt');
    $originalid = $array_a->item(0)->nodeValue;
	$encrypt = $array_e->item(0)->nodeValue;

	$encodingAesKey = ENCODINGAESKEY;
    $token = TOKEN;
    $pc = new WXBizMsgCrypt($token, $encodingAesKey, $weixin->appid);

	$format = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><Encrypt><![CDATA[%s]]></Encrypt></xml>";
	$from_xml = sprintf($format, $encrypt);
	$msg = '';
    $errCode = $pc->decryptMsg($msg_signature, $timestamp, $nonce, $from_xml, $msg);
    if($errCode == 0) {
    	$xml = new DOMDocument();
        $xml->loadXML($msg);
     	
        $array_e1 = $xml->getElementsByTagName('ToUserName');
        $ToUserName = $array_e1->item(0)->nodeValue;
     
        $array_e2 = $xml->getElementsByTagName('FromUserName');
        $FromUserName = $array_e2->item(0)->nodeValue;
                             
        $array_e3 = $xml->getElementsByTagName('MsgType');
        $MsgType = $array_e3->item(0)->nodeValue;
        $mtime=time();
        	//测试账号
    	switch($MsgType){
    		case 'event':
    			$array_e5 = $xml->getElementsByTagName('Event');
            	$Event = $array_e5->item(0)->nodeValue;
    			$ContentStr = $Event.'from_callback';
    			$text = "<xml>
	                    <ToUserName><![CDATA[$FromUserName]]></ToUserName>
	                    <FromUserName><![CDATA[$ToUserName]]></FromUserName>
	                    <CreateTime>$mtime</CreateTime>
	                    <MsgType><![CDATA[text]]></MsgType>
	                    <Content><![CDATA[$ContentStr]]></Content>
	                    </xml>";
				$encryptMsg = '';
				$errCode = $pc->encryptMsg($text, $timestamp, $nonce, $encryptMsg);
				$result = $encryptMsg;
				return $result;
				break;
    	}
    }
