    
    $( document ).ready(function() {
        var canvas = new fabric.Canvas('canvas');
        var borderLimit = 0;
        canvas.on({
            'object:moving': function(e) {
              e.target.opacity = 0.5;
              var obj = e.target;
                obj.setCoords();     
                //top corner 
                if(obj.getBoundingRect().top < -borderLimit){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top)-borderLimit;
                }
                // left corner
                if(obj.getBoundingRect().left < -borderLimit){                    
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left)-borderLimit;
                }
                //bottom corner
                if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height + borderLimit){
                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top) + borderLimit;
                }
                //right corner
                if(obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width + borderLimit){
                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left) + borderLimit;
                }            
               
            },
            'object:modified': function(e) {
              e.target.opacity = 1;
           }
        });      

        canvas.setOverlayImage('img/background.png', canvas.renderAll.bind(canvas));

        var uploadedImgWidth,uploadedImgHeight;
        // 上傳照片============================================
        $('#uploadedImg').change(function(e) {

          var obj = canvas.getObjects()[0];
          if (typeof obj !== "undefined") {
              obj.remove();
          }       
          var reader = new FileReader();
            reader.onload = function (event){
              var imgObj = new Image();
              imgObj.src = event.target.result;
              imgObj.onload = function () {
                var image = new fabric.Image(imgObj);
                image.set({
                      left: 0,
                      top: 0,            
                      scaleX: 330 / image.width,
                      scaleY: 330 / image.height,
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
            reader.readAsDataURL(e.target.files[0]);
          });
           // 上傳照片============================================

        // fabric.Image.fromURL('img/scream.jpg', function(img) {
        // img.set({
        //     left: 0,
        //     top: 0,            
        //     scaleX: 330 / img.width,
        //     scaleY: 330 / img.height,
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
    			ctx.drawImage(baseimage,0,0,330,330);    
    			var dataURL = canvas.toDataURL("image/png");
    			document.getElementById('canvasImg').src = dataURL;

    			// console.log("pwd:"+ "<?=$base_dir ;?>");
    			sendImgToServer(dataURL);
    			imgDownload(dataURL);
           
        });
		
	
		$( "#slider" ).slider({				
			range: "min",
			min: 0,
			max: 100,
			value: 0,
			slide: function(event, ui) {
			$("#amount").val(ui.value);     

      var obj = canvas.getObjects()[0];
      obj.width = uploadedImgwidth + ui.value;
      obj.height = uploadedImgHeight + ui.value;
      borderLimit = ui.value;
      canvas.renderAll();      

			}			
		});
		$("#amount").val( $("#slider").slider("value"));
		
		
    });    
  
  function imgDownload(imgurl){
    //使用者下載
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
