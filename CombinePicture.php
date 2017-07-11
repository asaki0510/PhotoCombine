<?php //include_once "./common.php"; ?>
<!DOCTYPE html>
<html lang="zh-TW">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>
            <?=$event_title;?>
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="author" content="ELLE Taiwan" />
        <!--Brand Name請大寫 -->
        <meta name="copyright" content="Hearst Magazines Taiwan" />
        <meta name="keywords" content="<?=$event_keywds;?>" />
        <meta name="description" content="<?=$event_descrip;?>" />
        <!-- FB Open Graphic -->
        <meta property="fb:app_id" content="<?=$facebook_app_id;?>" />
        <meta property="og:title" content="<?=$event_title;?>" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="<?=$event_icofb;?>" />
        <meta property="og:site_name" content="ELLE Taiwan" />
        <!--Brand Name請大寫 -->
        <meta property="og:description" content="<?=$event_descrip;?>" />
        <link rel="image_src" type="image/jpeg" href="<?=$event_icofb;?>" />
        <!-- Favicons -->
        <link rel="shortcut icon" type="image/x-icon" href="//www.elle.com.tw/sites/default/files/favicon.ico"> 
        <!-- <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/aos/2.1.1/aos.css"> -->
        <script src="//use.fontawesome.com/0b5b105cb1.js"></script>
        <!-- <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" /> -->
        <!-- <link rel="stylesheet" href="//event.hearst.com.tw/event/common_support/css/font.css"> -->
		<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <!-- <link rel="stylesheet" href="css/footer.css"> -->
        <!-- <link rel="stylesheet" href="css/style.css"> -->
        <style>
            .showObject{
                    visibility: visible;
                    opacity: 1;
            }
            .hideObject{
                visibility: hidden;
                opacity: 0;
                -webkit-transition: visibility 0s, opacity 0.5s linear;;
                -o-transition: visibility 0s, opacity 0.5s linear;;
                transition: visibility 0s, opacity 0.5s linear;; 
            }
        </style>
    </head>
<body>


    <canvas id="canvas" width="330" height="330" data-canvas-size="330" style="background:url(img/background.png)"></canvas>
    <!-- <canvas id="canvas" width="330" height="330"></canvas> -->
    <img id="canvasImg" />
	<p>
		<label for="amount">Volume:</label>
		<input type="text" id="amount" readonly style="border:0; color:#f6931f; font-weight:bold;">
	</p> 
	<div id="slider" style="width:300px;"></div> 
    <p>請上傳檔案或使用fb大頭照</p>   
    <input type="file" id="uploadedImg" accept="image/jpeg,image/gif,image/png" data-max-size="2092586" />
    <button id="usefbPic">使用fb大頭照</button>
    <button id="save">save</button>
    <button id="reset">reset</button>
    <script src="./js/fabric.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="js/img.js"></script>
<script>

</script>
</body>
</html>