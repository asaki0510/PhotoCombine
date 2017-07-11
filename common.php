<?php
require $_SERVER['DOCUMENT_ROOT'] . '/event/common.php';

$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === "on" ? "https://" : "http://";
$base_dir = str_replace(realpath($_SERVER['DOCUMENT_ROOT']), '', dirname(__FILE__)) . DIRECTORY_SEPARATOR;
$base_dir = '/2016/nikki/photo0710';
$event_url = $protocol . $_SERVER['HTTP_HOST'] . $base_dir;
$dismiss_url = $protocol . $_SERVER['HTTP_HOST'] . "/event/close.html";
$redirect_url = $event_url; //'http://www.elle.com.tw';

$event_name    = "photo0710"; //活動名稱+月份
$event_title   = "z"; //網站名稱
$event_keywds  = "zz";
$event_descrip = "zzz";
$event_icofb   = "{$event_url}images/fb.jpg";


$facebook_app_id = FB_APP2_ID;
//$facebook_app_id = FB_APP_BAZAAR_ID;
// $facebook_app_id = FB_APP_COSMO_ID;
//$facebook_app_id = FB_APP_HEARST_ID;

$facebook_scope = 'email,public_profile,user_birthday';
$isMobile = (preg_match('/(alcatel|amoi|android|avantgo|blackberry|benq|cell|cricket|docomo|elaine|htc|iemobile|iphone|ipad|ipaq|ipod|j2me|java|midp|mini|mmp|mobi|motorola|nec-|nokia|palm|panasonic|philips|phone|playbook|sagem|sharp|sie-|silk|smartphone|sony|symbian|t-mobile|telus|up\.browser|up\.link|vodafone|wap|webos|wireless|xda|xoom|zte)/i', $_SERVER['HTTP_USER_AGENT'])) ? true : false;

