<!DOCTYPE html>
<html>
<head>
  <title>授权成功</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0" />
  <link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css" />
</head>
<body>
  <div class="weui_msg">
    <div class="weui_icon_area"><i class="weui_icon_success weui_icon_msg"></i></div>

    <div class="weui_text_area">
      <h4 class="weui_msg_title">已授权，Incity活动已启动</h4>
      <p class="weui_msg_desc">请将如下地址添加至您的公众号菜单：http://incity.dataguiding.com</p>
    </div>
  </div>
  <?php
    require 'config.php';
    $data = json_decode(get_php_file("jsapi_ticket.php"));
    $data->expire_time = -1;
    set_php_file("jsapi_ticket.php", json_encode($data));

    $third_content = json_decode(get_php_file('wx_third.php'));
   
    //授权成功
    $auth_code = $_GET['auth_code'];

    $get_token_url = "https://api.weixin.qq.com/cgi-bin/component/api_query_auth?component_access_token=".$third_content->component_access_token;  
    $post_data = array('component_appid' => APPID,'authorization_code' => $auth_code);  
    $jsonStr = json_encode($post_data);  
    $returnContent = http_post_json($get_token_url, $jsonStr);
    $returnContent = json_decode($returnContent)->authorization_info;

    //获取公众号基本信息
    $get_account_url = "https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info?component_access_token=".$third_content->component_access_token;
    $account_data = array('component_appid' => APPID,'authorizer_appid' => $returnContent->authorizer_appid);  
    $accountStr = json_encode($account_data);  
    $accountContent = http_post_json($get_account_url, $accountStr); 
    $authorizer_info = json_decode($accountContent)->authorizer_info;
    $authorization_info = json_decode($accountContent)->authorization_info; 
        
    $content = array('appid'=>$returnContent->authorizer_appid,'name'=>$authorizer_info->nick_name,'originalid'=>$authorizer_info->user_name,'access_token'=>$returnContent->authorizer_access_token,'refresh_token'=>$returnContent->authorizer_refresh_token,'expires_in'=>time()+6200,'is_auth'=>1);
    set_php_file('wx_auth.php',json_encode($content));
  ?>
</body>
</html>
