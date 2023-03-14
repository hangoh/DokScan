///////////////////////////////   Upload File part  /////////////////////////////////////////
        uploadBtn.addEventListener("click",function(){
            document.getElementById('file-input').click()
        })

        document.getElementById('file-input').addEventListener('change',function(e){
           if(e.target.files) {
            let imageFile = e.target.files[0]; //here we get the image file
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = function (e) {
                var myImage = new Image(); // Creates image object
                myImage.src = e.target.result; // Assigns converted image to image object
                myImage.onload = function(ev) {
                    var myCanvas = document.createElement("canvas"); // Creates a canvas object
                    var myContext = myCanvas.getContext("2d"); // Creates a contect object
                    myCanvas.width = myImage.width; // Assigns image's width to canvas
                    myCanvas.height = myImage.height; // Assigns image's height to canvas
                    myContext.drawImage(myImage,0,0); // Draws the image on canvas
                    data = myCanvas.toDataURL("image/jpeg"); // Assigns image base64 string in jpeg format to a variable
                    sendImageToScan(data)
                    }
                }
            }
        })
