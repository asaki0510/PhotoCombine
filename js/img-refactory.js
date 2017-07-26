const canvasWidth= $('#canvas_game').data('canvas-width');
const canvasHeight= $('#canvas_game').data('canvas-height');
var canvas_game = new fabric.Canvas('canvas_game');

var uploadedImgObj; //儲存上傳圖片物件
//========上傳圖片各種參數=============
var uploadedImgOriginWidth,
    uploadedImgOriginHeight
var isPictureHeight = false,isPictureWidth = false;
var extendPixel = 0;
var horizontalBorderLimit = 0; //水平邊界
var verticalBorderLimit = 0; //垂直邊界
var imageScale = 1;
//=====================================

$.ajaxSetup({
    cache: true
});



$( document ).ready(function() {
        SetOverlayImage(canvas_game,'images/background.png');
        CanvasEvent(canvas_game);

        // 上傳照片============================================
        $('#uploadedImg').change(function(e) {         
          var flag = CheckFileSize(event.target.files);
              if(!flag)
              {
                  alert("Please choose an image < 2MB.");
                  return;
              }else{
                  InitialParam();
                  RemoveCanvasObj(uploadedImgObj);                  
                  var fileReader = new FileReader();
                  fileReader.readAsDataURL(e.target.files[0]);
                  fileReader.onload = function (event){
                      var imgObj = new Image();
                      imgObj.src = event.target.result;
                      imgObj.onload = function () {
                        CheckImg(imgObj);
                        uploadedImgObj = AddImgToCanvas(canvas_game,imgObj,imageScale);                        
                      }
                  }
              }
          });

        $("#save").click(function(){
            // var myCanvas = document.querySelector('canvas');                
            var url = CreateResultPic(true,canvas_game,0,0,canvasWidth,canvasHeight);
            SendImgToServer(url);
        }); 

  		$("#slider").slider({
    			range: "min",
    			min: 0,
    			max: 50,
    			value: 0,
    			slide: function(event, ui) {
        		  $("#amount").val(ui.value);
              ReSizeImg(uploadedImgObj,ui.value,uploadedImgOriginwidth,uploadedImgOriginHeight);
  			}			
  		});

      $("#reset").click(function(event) {
          RemoveCanvasObj(uploadedImgObj);         
          //SetOverlayImage(canvas_game,null);
      });

  		$("#amount").val( $("#slider").slider("value"));
});

function ReSizeImg(obj,scaleValue,originWidth,originHeight){   
    var Scale = (100 + scaleValue) / 100;              
    var changeWidth = originWidth * Scale;
    var changeHeight = originHeight * Scale;
    if(isPictureWidth){                
      obj.width = changeWidth;
      obj.height = changeHeight;
      horizontalBorderLimit = extendPixel + ((changeWidth - originWidth) * imageScale);
      verticalBorderLimit = (changeHeight - originHeight) * imageScale;
    }else if(isPictureHeight){               
      obj.width = changeWidth;
      obj.height = changeHeight;
      horizontalBorderLimit = ((changeWidth - originWidth) * imageScale);
      verticalBorderLimit = extendPixel + ((changeHeight - originHeight) * imageScale);
    }else{
      obj.width = changeWidth;
      obj.height = changeHeight;
      horizontalBorderLimit = ((changeWidth - originWidth) * imageScale);
      verticalBorderLimit = ((changeHeight - originHeight) * imageScale);
    }              
    canvas_game.renderAll();
}

function SetOverlayImage(canvas,path){
  canvas.setOverlayImage(path, canvas.renderAll.bind(canvas));
}

function CanvasEvent(canvas)
{
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
}

function CreateResultPic(download_flag,canvas_box,x,y,width,height){
  var ctx = canvas_box.getContext ? canvas_box.getContext('2d') : null;
  var baseimage = new Image();
  ctx.drawImage(baseimage,x,y,width,height);    
  var dataURL = canvas_box.toDataURL("image/png");
  document.getElementById('canvasImg').src = dataURL;  
  if(download_flag){
    ImgDownload(dataURL);
  }    
  return dataURL;
}

function ImgDownload(imgurl){
    //使用者下載 此方法在ios無效
    var link = document.createElement("a");
    link.href = imgurl;
    link.download = "mypainting.png";
    link.click();
}
  
function SendImgToServer(imgurl){
    // 鎖住該按鈕避免重複送出=====

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

function CheckFileSize(obj){
    var filelist = obj;
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
    if(file.size>=maxSize){
      return false;
    }else{
      return true;
    }

}

function CheckImg(imgObj){
    if(imgObj.width>imgObj.height){
        imageScale = canvasHeight / imgObj.height;
        isPictureWidth = true;
        extendPixel = Math.round((imgObj.width * imageScale) - canvasWidth);
        horizontalBorderLimit = extendPixel;
    }else if(imgObj.width<imgObj.height){
        imageScale = canvasWidth / imgObj.width;
        isPictureHeight = true;
        extendPixel = Math.round((imgObj.height * imageScale) - canvasHeight);
        verticalBorderLimit = extendPixel;
    }else{
        imageScale = canvasHeight / imgObj.height;
        isPictureWidth =false;
        isPictureHeight = false;
    }
    uploadedImgOriginHeight = imgObj.height;
    uploadedImgOriginwidth = imgObj.width;
}

function AddImgToCanvas(canvas,imgObj,imageScale){
  var image = new fabric.Image(imgObj);
        image.set({
              left: 0,
              top: 0,
              scaleX: imageScale,
              scaleY: imageScale,
              hasControls : false,
              hasBorders : false
        });        
  canvas.centerObject(image);
  canvas.add(image);
  canvas.renderAll();
  return image;
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

function RemoveCanvasObj(canvas_ele){  
    if (typeof canvas_ele !== "undefined") {
        canvas_ele.remove();
    } 
}


