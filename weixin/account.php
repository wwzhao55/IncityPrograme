<?php
//接受微信推送
	include_once("openwx/wxBizMsgCrypt.php");
	require 'config.php';

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
	    $array_a = $xml_tree->getElementsByTagName('AppId');
		$array_e = $xml_tree->getElementsByTagName('Encrypt');
	    $appid = $array_a->item(0)->nodeValue;
		$encrypt = $array_e->item(0)->nodeValue;

	  	$encodingAesKey = ENCODINGAESKEY;
        $token = TOKEN;
        $pc = new WXBizMsgCrypt($token, $encodingAesKey, $appid);
        $format = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><Encrypt><![CDATA[%s]]></Encrypt></xml>";
		$from_xml = sprintf($format, $encrypt);

		// 第三方收到公众号平台发送的消息
        $msg = '';
        $errCode = $pc->decryptMsg($msg_signature, $timestamp, $nonce, $from_xml, $msg);
        if($errCode == 0) {
            $xml = new DOMDocument();
            $xml->loadXML($msg);
            $array_a = $xml->getElementsByTagName('InfoType');
            $infotype = $array_a->item(0)->nodeValue;
            switch($infotype){
                case 'component_verify_ticket':
                    //推送ticket
                    $array_e = $xml->getElementsByTagName('ComponentVerifyTicket');
                    $component_verify_ticket = $array_e->item(0)->nodeValue;

                    $get_token_url = "https://api.weixin.qq.com/cgi-bin/component/api_component_token";  
                    $ticket_data = array('component_appid' => $appid,'component_appsecret' => APPSECRET,'component_verify_ticket' => $component_verify_ticket);  
                    $jsonStr = json_encode($ticket_data);  
                    $returnContent = http_post_json($get_token_url, $jsonStr);  
                    $component_access_token = json_decode($returnContent)->component_access_token; 

                    $url2 = 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode?component_access_token='.$component_access_token;  
                    $pre_data = array('component_appid' => $appid);  
                    $jsonStr2 = json_encode($pre_data);  
                    $returnContent2 = http_post_json($url2, $jsonStr2);  
                    $pre_auth_code = json_decode($returnContent2)->pre_auth_code;
                    //写入文件
                    $content = array('component_verify_ticket' => $component_verify_ticket,'component_access_token'=>$component_access_token,'pre_auth_code'=>$pre_auth_code);
                    set_php_file('wx_third.php',json_encode($content));
                    break;
                case 'unauthorized':
                    //取消授权
                    $array_b = $xml->getElementsByTagName('AuthorizerAppid');
                    $authorizerAppid = $array_b->item(0)->nodeValue;
                    $content = json_decode(get_php_file('wx_auth.php'));
                    $content->is_auth = 0;
                    set_php_file('wx_auth.php',json_encode($content));
                    break;
                case 'authorized':
                    
                    break;
                case 'updateauthorized':
                    $data = json_decode(get_php_file("jsapi_ticket.php"));
                    $data->expire_time = -1;
                    set_php_file("jsapi_ticket.php", json_encode($data));

                    $third_content = json_decode(get_php_file('wx_third.php'));
                    //授权成功
                    $array_c = $xml->getElementsByTagName('AuthorizationCode');
                    $auth_code = $array_c->item(0)->nodeValue;

                    $array_d = $xml->getElementsByTagName('AuthorizerAppid');
                    $authorizer_appid = $array_d->item(0)->nodeValue;

                    $get_token_url = "https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=".$third_content->component_access_token;  
                    $post_data = array('component_appid' => APPID,'authorization_code' => $auth_code);  
                    $jsonStr = json_encode($post_data);  
                    $returnContent = http_post_json($get_token_url, $jsonStr);
                    $returnContent = json_decode($returnContent)->authorization_info;
                    
                    //获取公众号基本信息
                    $get_account_url = "https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=".$third_content->component_access_token;
                    $account_data = array('component_appid' => APPID,'authorizer_appid' => $authorizer_appid);  
                    $accountStr = json_encode($account_data);  
                    $accountContent = http_post_json($get_account_url, $accountStr); 
                    $authorizer_info = json_decode($accountContent)->authorizer_info;
                    $authorization_info = json_decode($accountContent)->authorization_info; 
                    
                    $content = array('appid'=>$authorizer_appid,'name'=>$authorizer_info->nick_name,'originalid'=>$authorizer_info->user_name,'access_token'=>$returnContent->authorizer_access_token,'refresh_token'=>$returnContent->authorizer_refresh_token,'expires_in'=>time()+6200,'is_auth'=>1);
                    set_php_file('wx_auth.php',json_encode($content));                       
                    break;
            } 
            return 'success';   
        }else{
        	 error_log($errCode,3,'error_log.log');
        }

	function get_php_file($filename) {
	    return trim(substr(file_get_contents($filename), 15));
	}
	function set_php_file($filename, $content) {
	    $fp = fopen($filename, "w+");
	    fwrite($fp, "<?php exit();?>" . $content);
	    fclose($fp);
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