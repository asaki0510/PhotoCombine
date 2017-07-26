<?php include_once "./common.php"; ?>
<?php $img = empty($_GET['img']) ? 'images/fb.jpg' : $_GET['img']; ?>
<?php// $img = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/' . $img; ?>

<!DOCTYPE html>
<html lang="zh-TW">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
       <title>
            <?=$event_title;?>
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <!--Brand Name請大寫 -->
        <meta name="author" content="ELLE Taiwan" />
        <meta name="copyright" content="Hearst Magazines Taiwan" />
        <meta name="keywords" content="<?=$event_keywds;?>" />
        <meta name="description" content="<?=$event_descrip;?>" />
        <!-- FB Open Graphic -->
        <meta property="fb:app_id" content="<?=$facebook_app_id;?>" />
        <meta property="og:title" content="<?=$event_title;?>" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="<?php echo $event_url ?>" />
        <!-- "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" -->
        <meta property="og:image" content="<?php echo $img?>" />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:site_name" content="ELLE TW" />
        <!--Brand Name請大寫 -->
        <meta property="og:description"  content="<?=$event_descrip;?>" />
        <!-- <link rel="image_src" type="image/jpeg" href="http://e.hearst-taiwan.com.tw/2017/ellerun/images/fb.jpg?v=1" /> -->
    </head>
    <body>
        <script>
            setTimeout(function() {
                location.href = 'http://www.elle.com.tw/';
            }, 100000);
        </script>
    </body>
</html>