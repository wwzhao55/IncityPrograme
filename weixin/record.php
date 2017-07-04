<?php
	require 'config.php';
	error_reporting(E_ALL ^ E_DEPRECATED);
	try {
	    $pdo = new PDO('mysql:host=121.42.136.52;dbname=statistics;port=3306','deling','redhatredhat');
	} catch (PDOException $e) {
	    die("数据库连接失败".$e->getMessage());
	}
	$pdo->exec('set names utf8');

	$openid = $_POST['openid'];
	$longitude = $_POST['longitude'];
	$latitude = $_POST['latitude'];
	$source = $_POST['source'];
	$game = $_POST['game'];
	$page = $_POST['page'];

	if($pdo->exec("INSERT INTO incity_users(openid,time,game,page,source,latitude,longitude) values('$openid',".time().",".$game.",".$page.",'$source','$latitude','$longitude')")){
		//var_dump('yes');
		echo json_encode(array('status'=>'success'));
	}else{
		echo json_encode(array('status'=>'fail','msg'=>"操作失败"));
	}