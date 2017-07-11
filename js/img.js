const canvasSize= $('#canvas').data('canvas-size');
var fileReader = new FileReader();
var canvas = new fabric.Canvas('canvas');
var uploadedImgWidth,
    uploadedImgHeight,
    app_id=$("meta[property='fb:app_id']").attr("content");
var apidata = {}; 
var isPictureHeight = false,isPictureWidth = false;
var extendPixel = 0;
var horizontalBorderLimit = 0; //水平邊界
var verticalBorderLimit = 0; //垂直邊界
var imageScale = 1;
// if(href.match(/^http:\/\/event.elle.com.tw/i)==null){
//   //測試機
//   app_id = 696667610471207;
// }else{
// //正式機
//   app_id = 548200988552737;
// }
console.log("canvasSize:"+canvasSize);

// include fb sdk---------------
$.ajaxSetup({
    cache: true
});

$.getScript('//connect.facebook.net/zh_TW/sdk.js', function() {
    FB.init({
        appId: app_id,
        cookie: true,
        version: 'v2.7'
    });

    $("#usefbPic").on("click", function(e) {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                apidata['uid'] = response.authResponse.userID;
                FB.api('/me', {
                    fields: 'name,email'
                }, function(response) {
                    apidata['name'] = response.name;
                    apidata['email'] = response.email;
                    // goStart(apidata);
                });
            } else {
                    FB.login((function(response) {
                        if (response.status === 'connected') {
                            apidata['uid'] = response.authResponse.userID;
                            FB.api('/me', {
                                fields: 'name,email'
                            }, function(response) {
                                apidata['name'] = response.name;
                                apidata['email'] = response.email;
                                // goStart(apidata);
                            });
                        } else if (response.status === 'not_authorized') {
                            console.log('not_authorized');
                        } else {
                            console.log('need login');
                        }
                }), {
                scope: 'public_profile'
                });
            }
            reqFbPic();
        });
        
    });
});

// $(".needusefb").on("click", function(){
//     reqFbPic();
// });    
function reqFbPic(){
  FB.api("/" + apidata['uid'] + "/picture?type=square&width=500&height=500", function(e) {
      import_fbPic(e.data.url);
  })
}

// include fb sdk---------------

$( document ).ready(function() {
        
        
        canvas.on({
            'object:moving': function(e) {
              e.target.opacity = 0.5;
              var obj = e.target;
                obj.setCoords();     
                //top corner 
                if(obj.getBoundingRect().top < -verticalBorderLimit){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top)-verticalBorderLimit;
                }
                // left corner
                if(obj.getBoundingRect().left < -horizontalBorderLimit){                    
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left)-horizontalBorderLimit;
                }
                //bottom corner
                if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height + verticalBorderLimit){
                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top) + verticalBorderLimit;
                }
                //right corner
                if(obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width + horizontalBorderLimit){
                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left) + horizontalBorderLimit;
                }            
               
            },
            'object:modified': function(e) {
              e.target.opacity = 1;
           }
        });      

        canvas.setOverlayImage('img/background.png', canvas.renderAll.bind(canvas));

        
        // 上傳照片============================================
        $('#uploadedImg').change(function(e) {         
          var flag = checkFileSize(event.target.files);
          // if(!flag)
          // {
          //     alert("Please choose an image < 2MB.");
          //     return;
          // }else{
              InitialParam();
              importPicToCanvas(e.target.files[0]);
          // }
          
          });
         
           // 上傳照片============================================

        // fabric.Image.fromURL('img/scream.jpg', function(img) {
        // img.set({
        //     left: 0,
        //     top: 0,            
        //     scaleX: canvasSize / img.width,
        //     scaleY: canvasSize / img.height,
        //     hasControls : false,
        //     hasBorders : false,
        //     //lockMovementX: true
        // });
        //   uploadedImgHeight = img.height;
        //   uploadedImgwidth = img.width;
        //   canvas.add(img);
        // });

        $("#save").click(function(){
            var myCanvas = document.querySelector('canvas');                
            var ctx = myCanvas.getContext ? myCanvas.getContext('2d') : null;
            var baseimage = new Image();
      			ctx.drawImage(baseimage,0,0,canvasSize,canvasSize);    
      			var dataURL = canvas.toDataURL("image/png");
      			document.getElementById('canvasImg').src = dataURL;
      			sendImgToServer(dataURL);
      			imgDownload(dataURL);
        });
		
	
  		$( "#slider" ).slider({				
    			range: "min",
    			min: 0,
    			max: 50,
    			value: 0,
    			slide: function(event, ui) {
        			$("#amount").val(ui.value);     

              var obj = canvas.getObjects()[0];              
              var Scale = (100 + ui.value) / 100;
              var changeWidth = uploadedImgwidth * Scale;
              var changeHeight = uploadedImgHeight * Scale;
              if(isPictureWidth){                
                obj.width = changeWidth;
                obj.height = changeHeight;
                horizontalBorderLimit = extendPixel + ((changeWidth - uploadedImgwidth) * imageScale);
                verticalBorderLimit = (changeHeight - uploadedImgHeight) * imageScale;
              }else if(isPictureHeight){               
                obj.width = changeWidth;
                obj.height = changeHeight;
                horizontalBorderLimit = ((changeWidth - uploadedImgwidth) * imageScale);
                verticalBorderLimit = extendPixel + ((changeHeight - uploadedImgHeight) * imageScale);
              }else{
                obj.width = changeWidth;
                obj.height = changeHeight;
                horizontalBorderLimit = ((changeWidth - uploadedImgwidth) * imageScale);
                verticalBorderLimit = (changeHeight - uploadedImgHeight) * imageScale;
              }
              console.log(isPictureHeight);
              // console.log(obj.height + "/" + obj.width)
              // console.log(uploadedImgHeight + "/" + uploadedImgwidth)
              // console.log(verticalBorderLimit + "/" + horizontalBorderLimit)
              canvas.renderAll();      

  			}			
  		});
  		$("#amount").val( $("#slider").slider("value"));
		
		
});    
  
function imgDownload(imgurl){
    //使用者下載 此方法在ios無效
    var link = document.createElement("a");
    link.href = imgurl;
    link.download = "mypainting.png";
    link.click();
}
  
function sendImgToServer(imgurl){
     // 自動存放至路徑資料夾內
    $.ajax({
      type: "POST",
      url: "save.php",
      dataType: 'json',
      data: { 
         // imgBase64: dataURL
         base64: imgurl
      }
    }).done(function(o) {
      console.log('res:'+o.msg); 
      console.log('resImg:'+o.data.imgUrl); 
    });
}

function checkFileSize(obg){
    var filelist = obg;
    var str = "";
    var maxSize = $('#uploadedImg').data('max-size');

    for(var i = 0; i < filelist.length ; i++ ) {
        var file = filelist[i]
        str += "name：" + escape(file.name) + "\n" + //檔名
               "type：" + file.type + "\n" +  //檔案類型
               "size：" + file.size + "\n" +  //檔案大小
               "lastModifiedDate：" + file.lastModifiedDate.toLocaleDateString() + "\n\n\n"; //最後修改日期
    }
    console.log(str);
    if(file.size>=maxSize)
    {
      return false;
    }else{
      return true;
    }

}

function importPicToCanvas(target){
    var obj = canvas.getObjects()[0];
    if (typeof obj !== "undefined") {
        obj.remove();
    }       
    
      fileReader.onload = function (event){
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
          var image = new fabric.Image(imgObj);          
          // 判斷傳進來的圖片是 直圖/橫圖/正方形圖
          if(image.width>image.height){
              imageScale = canvasSize / image.height;
              isPictureWidth = true;
              extendPixel = Math.round((image.width * imageScale) - canvasSize);
              horizontalBorderLimit = extendPixel;
          }else if(image.width<image.height){
              imageScale = canvasSize / image.width;
              isPictureHeight = true;
              extendPixel = Math.round((image.height * imageScale) - canvasSize); 
              verticalBorderLimit = extendPixel;
          }else{
            //image.width==image.height
              imageScale = canvasSize / image.height;
          }
          console.log(image.height+"/"+image.width);
          console.log(imageScale);
          console.log(extendPixel);
          image.set({
                left: 0,
                top: 0,            
                scaleX: imageScale,
                scaleY: imageScale,
                hasControls : false,
                hasBorders : false
          });
          uploadedImgHeight = image.height;
          uploadedImgwidth = image.width;
          canvas.centerObject(image);
          canvas.add(image);
          canvas.renderAll();
        }
      }
      fileReader.readAsDataURL(target);
}
function import_fbPic(imgurl){
  var obj = canvas.getObjects()[0];
    if (typeof obj !== "undefined") {
        obj.remove();
    }       
    var imgObj = new Image();
    imgObj.src = imgurl;
    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      var imageScale;
      // fb的圖片會是正方形的
      imageScale = canvasSize / image.width;
      image.set({
            left: 0,
            top: 0,            
            scaleX: imageScale,
            scaleY: imageScale,
            hasControls : false,
            hasBorders : false
      });
      uploadedImgHeight = image.height;
      uploadedImgwidth = image.width;
      canvas.centerObject(image);
      canvas.add(image);
      canvas.renderAll();
    }
    
}

function InitialParam(){
  isPictureHeight = false,isPictureWidth = false;
  extendPixel = 0;
  horizontalBorderLimit = 0; //水平邊界
  verticalBorderLimit = 0; //垂直邊界
  imageScale = 1;
  $("#amount").val(0);
  $("#slider").slider("value", 0);
}