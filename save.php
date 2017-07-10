<?php
    if(empty($_POST)){
        echo json_encode(array(
            'status' => false,
            'msg'    => "post data is empty.",
        ));
        return;
    }
    $post = $_POST;
    foreach ($_POST as $key => $value) {
        $post[$key]=htmlspecialchars(strip_tags($value));
    }
    $dir = str_replace('\\', '/', dirname(__FILE__))."/uploads/";
    define('UPLOAD_PATH', $dir);
      // 接收 POST 進來的 base64 DtatURI String
    $img = $post['base64'];
    // 轉檔 & 存檔


    $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $img));

/*

    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
*/
    
    $fileName = uniqid() . '.png';
    $file = UPLOAD_PATH . $fileName;

    if(file_exists($file)){
        echo json_encode(array(
            'status' => false,
            'msg'    => "照片重複",
        ));
        return;
    }

    $success = file_put_contents($file, $data);

    if($success){
        //$_SESSION['mac12']['imgurl'] = "http://".$_SERVER['HTTP_HOST']."/2016/mac12/uploads/".$fileName;
        echo json_encode(array(
            'status' => true,
            'msg'    => "成功",
            'data'   => array(
                'imgUrl' =>
                // "http://".$_SERVER['HTTP_HOST']."/2017/skii01/uploads/".$fileName
                "http://".$_SERVER['HTTP_HOST']."/2016/nikki/photo0710/uploads/".$fileName
                
            )
        ));
    } else {
        echo json_encode(array(
            'status' => false,
            'msg'    => "失敗",
        ));
    }
