const canvasSize= $('#canvas_game').data('canvas-size');
var fileReader = new FileReader();
var canvas_game = new fabric.Canvas('canvas_game');
var uploadedImgWidth,
    uploadedImgHeight,
    app_id=$("meta[property='fb:app_id']").attr("content");
var apidata = {}; 
var isPictureHeight = false,isPictureWidth = false;
var extendPixel = 0;
var horizontalBorderLimit = 0; //水平邊界
var verticalBorderLimit = 0; //垂直邊界
var imageScale = 1;
var send2server_flag= false;

// temp object for index
var uploadedImgObj,tempImg,inputTextArea,iText7;

// fb share-----
var canvas_share = new fabric.Canvas('canvas_share');
const fbShareCanvas_width = $('#canvas_share').width();
const fbShareCanvas_height = $('#canvas_share').height();
const fbShareUserPic_size = 580;
// const fbShareBgSrc = "/2016/nikki/photo0710/images/fbshare-bg.jpg";
var baseimage ;
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
      InitialParam();
       var fbimg = new Image();
       fbimg.setAttribute('crossOrigin', 'anonymous');
       fbimg.src = e.data.url;
       fbimg.onload = function(e) {
        import_fbPic(fbimg);
        canvasEle_setZindex();
      }
  })
}

// include fb sdk---------------
function canvasEle_setZindex()
{
  canvas_game.moveTo(uploadedImgObj,7);          
  canvas_game.moveTo(tempImg, 8);
  canvas_game.moveTo(inputTextArea,9);
  canvas_game.moveTo(iText7, 10);     
}
$( document ).ready(function() {
        canvas_game.on({
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
              canvasEle_setZindex();                   
              canvas_game.deactivateAll().renderAll();     
              focusText(); 
              iText7.enterEditing();   
              e.target.opacity = 1;              
           },
           'mouse:down': function(e) {
              canvasEle_setZindex();                  
              canvas_game.deactivateAll().renderAll();   
              focusText();
              iText7.enterEditing();   
           },
           // 'mouse:over': function(e) {
           //    var obj = e.target;
           //    //  e.target.setFill('red');
           //    // canvas_game.renderAll();
           //    if(obj.name == 'backgroundText')
           //      $('.upper-canvas').css( 'cursor', 'text' );         
           // }

        });      
        //disable group select
        canvas_game.selection = false;
        
        //文字匡背景=======================
        var backgroundText = new fabric.Image.fromURL('images/template.svg', function(img) {
            img.set({
                 name:'backgroundText',
                hasBorders : false,
                hasControls: !1,
                originX: "right",
                originY: "bottom",
                left: canvas_game.getWidth(),
                top: canvas_game.getHeight() - 20,
                scaleX: .525,
                scaleY: .525,
                selectable: !1
                // hoverCursor : 'text'    
            });
          canvas_game.add(img);          
          tempImg = img;
          canvas_game.moveTo(tempImg, 8);
        });
        //文字匡背景=======================
        //文字匡fixed width================
        inputTextArea = new fabric.Rect({
            name:'inputTextArea',
            width: 200,
            height: 75,
            hoverCursor: "text",
            opacity: 0,
            top: canvas_game.getHeight() - 60,
            left: canvas_game.getWidth() - 100,
            originX: "center",
            originY: "center",
            lockMovementX: !0,
            lockMovementY: !0,
            hasBorders: !1,
            hasControls: !1,
            hasRotatingPoint: !1,            
            moveCursor:'text'
        })
        canvas_game.add(inputTextArea);
        canvas_game.moveTo(inputTextArea, 9);
        //================
        //文字匡設置=======================
        iText7 = new fabric.IText('', {
          name:'iText7',
          originX: "center",
          originY: "center",
          textAlign: "center",
          cache: !1,
          hoverCursor: "text",
          hasBorders: !1,
          hasControls: !1,
          hasRotatingPoint: !1,
          maxWidth: 150,
          top: canvas_game.getHeight() - 60,
          left: canvas_game.getWidth() - 100,
          fontFamily: "'Noto Sans TC', Helvetica, Arial, '黑體-繁', 'Heiti TC', '儷黑', 'LiHei', '微軟正黑體', 'Microsoft JhengHei', sans-serif",
          fontSize: 64,
          lockMovementX: !0,
          lockMovementY: !0
        });
        canvas_game.add(iText7).setActiveObject(iText7);
        canvas_game.moveTo(iText7, 10);
        iText7.enterEditing();
        //==================================
        // iText7.on('editing:exited', function () {
        //   canvasEle_setZindex();                    
        // });
        

         //文字匡設置=======================
         // var ia = canvas_game.getItemByName('inputTextArea');
         // canvas_game.on('mouse:down', focusText);

        // iText7.on('mouse:over', function () {
           
        //    $('.upper-canvas').css( 'cursor', 'text' );                  
        // });


         canvas_game.on({
            'object:selected': function(e) {
              canvasEle_setZindex();    
              var obj = e.target;
              canvasEle_setZindex();
              if(obj.name == 'inputTextArea')
                focusText();
            }});
         function focusText(){
            canvas_game.setActiveObject(iText7);
            iText7.enterEditing();
         }

        canvas_game.on('text:changed', function(e) {
            console.log('text:changed', e.target.text);
            textCheck(e.target.text);
        });

        // canvas_game.setOverlayImage('images/template.svg', canvas_game.renderAll.bind(canvas_game));
        // 上傳照片============================================
        $('#uploadedImg').change(function(e) {         
          var flag = checkFileSize(event.target.files);
              if(!flag)
              {
                  alert("Please choose an image < 2MB.");
                  return;
              }else{
                  InitialParam();
                  importPicToCanvas(e.target.files[0]);
              }
          });

        $("#save").click(function(){
            // var myCanvas = document.querySelector('canvas');                
            var url = create_resultPic(true,canvas_game,0,0,canvasSize,canvasSize);
            sendImgToServer(url);
        }); 

  		$( "#slider" ).slider({				
    			range: "min",
    			min: 0,
    			max: 50,
    			value: 0,
    			slide: function(event, ui) {
        			$("#amount").val(ui.value);     
              var obj = uploadedImgObj;              
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
                verticalBorderLimit = ((changeHeight - uploadedImgHeight) * imageScale);
              }
              console.log(isPictureHeight);
              // console.log(obj.height + "/" + obj.width)
              // console.log(uploadedImgHeight + "/" + uploadedImgwidth)
              // console.log(verticalBorderLimit + "/" + horizontalBorderLimit)
              canvas_game.renderAll();      

  			}			
  		});
  		$("#amount").val( $("#slider").slider("value"));
});    

/**
 * Item name is unique
 */
fabric.Canvas.prototype.getItemByName = function(name) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].name && objects[i].name === name) {
      object = objects[i];
      break;
    }
  }

  return object;
};

function textCheck(text){

}

function create_resultPic(download_flag,canvas_box,x,y,width,height){
  var ctx = canvas_box.getContext ? canvas_box.getContext('2d') : null;
  var baseimage = new Image();
  ctx.drawImage(baseimage,x,y,width,height);    
  var dataURL = canvas_box.toDataURL("image/jpg");
  document.getElementById('canvasImg').src = dataURL;
  
  if(download_flag){
    imgDownload(dataURL);
  }
    apidata['user_result_pic'] = dataURL;
  return dataURL;
}
function create_resultPic_shareUse(canvas_box,x,y,width,height){
  var ctx = canvas_box.getContext ? canvas_box.getContext('2d') : null;
  var baseimage = new Image();
  ctx.drawImage(baseimage,x,y,width,height);    
  var dataURL = canvas_box.toDataURL("image/jpg");
  document.getElementById('canvasImg_share').src = dataURL;
    apidata['user_resultShare_pic'] = dataURL;
    // console.log("user_resultShare_pic:"+apidata['user_resultShare_pic']);
  return dataURL;
}
function initImg(){
    fabric.Image.fromURL('images/initimg.jpg', function(img) {
        img.set({
            left: 0,
            top: 0,            
            scaleX: canvasSize / img.width,
            scaleY: canvasSize / img.height,
            hasControls : false,
            hasBorders : false,
            //lockMovementX: true
        });
      uploadedImgHeight = img.height;
      uploadedImgwidth = img.width;
      canvas.add(img);
    });
}
function imgDownload(imgurl){
    //使用者下載 此方法在ios無效
    var link = document.createElement("a");
    link.href = imgurl;
    link.download = "mypainting.jpg";
    link.click();
}
  
function sendImgToServer(imgurl){
    var flag = false;
    // 鎖住該按鈕避免重複送出=====
    $('#save').prop('disabled', true);
    $('#fbShare').prop('disabled', true);
     // 自動存放至路徑資料夾內
    $.ajax({
      type: "POST",
      url: "save.php",
      dataType: 'json',
      async: false,
      data: { 
         // imgBase64: dataURL
         base64: imgurl
      }
    }).done(function(o) {
      console.log('res:'+o.msg); 
      console.log('resImg:'+o.data.imgUrl); 
      apidata['user_canvas_pic_url'] = o.data.imgUrl;
      send2server_flag = true;
      $('#save').prop('disabled', false);
      $('#fbShare').prop('disabled', false);
      flag = true;
    });
    return flag;
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
      canvasReset(canvas_game);
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
              isPictureWidth =false;
              isPictureHeight = false;
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
          //canvas_game.centerObject(image);
          canvas_game.add(image);
          canvas_game.moveTo(image,1);
          uploadedImgObj = image;
          //canvas_game.renderAll();
        }
      }
      fileReader.readAsDataURL(target);
      //apidata['user_canvas_pic'] = imgObj;
}
function import_fbPic(imgObj){
      canvasReset(canvas_game); 
      var image = new fabric.Image(imgObj);
      // fb的圖片會是正方形的
     imageScale = canvasSize / image.height;
     isPictureWidth =false;
     isPictureHeight = false;
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
      canvas_game.centerObject(image);
      canvas_game.add(image);
      canvas_game.renderAll();
      uploadedImgObj = image;

       apidata['user_canvas_pic'] = imgObj;
}
function import_share(imgObj,x,y){
      // canvasReset(canvas_share); 
      var image = new fabric.Image(imgObj);
      // fb的圖片會是正方形的
     // imageScale = canvasSize / image.height;
     // isPictureWidth =false;
     // isPictureHeight = false;
      image.set({       
            left: x,
            top: y,            
            // scaleX: imageScale,
            // scaleY: imageScale,
            hasControls : false,
            hasBorders : false
      });
      uploadedImgHeight = image.height;
      uploadedImgwidth = image.width;
      canvas_share.centerObject(image);
      canvas_share.add(image);
      canvas_share.renderAll();
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

function canvasReset(canvas_ele){
  //var obj = canvas_ele.getObjects()[0];
    if (typeof uploadedImgObj !== "undefined") {
        // uploadedImgObj.remove();
        // canvas_ele.remove(uploadedImgObj);
        canvas_ele.clear();
        //重新放文字輸入匡跟文字背景
        send2server_flag = false;
    } 
}
$("#reset").click(function(event) {
  canvasReset(canvas_game);
});

// var clear = function() {
//     canvas_share.clearRect(0, 0, canvasWidth, canvasHeight);
// };
var itemRender = function(src, x, y, width, height) {
    // canvas_share.drawImage(src, X, Y, width, height);
     create_resultPic_shareUse(canvas_share,x,y,width,height);
};

var itemsRender = function() {
    var i;
    i = 0;
    while (i < itemsAry.length) {
        if (itemsAry[i].src) {
            itemRender(itemsAry[i].src, itemsAry[i].X, itemsAry[i].Y, itemsAry[i].width, itemsAry[i].height);
        }
        i++;
    }
};

$("#fbShare").on("click", function() {
    $('#save').prop('disabled', true);
     $('#fbShare').prop('disabled', true);

    var url = create_resultPic(false,canvas_game,0,0,canvasSize,canvasSize);
    var flag;
    if(send2server_flag==false)
      flag = sendImgToServer(url);

    // var fblink = "http://e.hearst-taiwan.com.tw/2016/nikki/photo0710/"+"share.php?img="+apidata['user_canvas_pic_url'];
    console.log("fblink:"+fblink);
      // if(flag){
          console.log("userimgurl:"+apidata['user_canvas_pic_url']);
          FB.ui({
              method: "feed",
              link: apidata['user_canvas_pic_url'],
              hashtag: "#ImPretty",
              display: "popup"
          }, function(e) {
             console.log("share action");
          })
      // }
      
});