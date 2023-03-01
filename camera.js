
///////////////////////////////   Camera part  /////////////////////////////////////////
// Access the camera and stream the video
async function startCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const select = document.getElementById("cameras");
    select.innerHTML = "";
    cameras.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label || `Camera ${select.length + 1}`;
        select.add(option);
    });
    try {
        cameraID = document.getElementById('cameras').value
        var stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: cameraID}});
        camOption.addEventListener('change',async function(){
            newcameraID = camOption.value
            stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: newcameraID}});
            video.srcObject = stream;
            video.play();
        })
        video.srcObject = stream;
        video.play();
        startBtn.style.display = 'none';
        uploadBtn.style.display = 'none'
        captureBtn.style.display = 'block';
        camOption.style.display = 'block';
        captureBtn.disabled = false
    } catch (error) {
        console.error(error);
    }
    
}

// Capture an image from the video stream
function captureImage() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    data = canvas.toDataURL('image/png');
    isCamUpload = true
    isFileUpload = false
    console.log(data);
        // You can do something with the data here, like send it to a server or display it on the page
    sendImageToScan(data)
}

// Function to send AJAX request
function sendImageToScan(imageData) {
  // Create form data object
  var formData = new FormData();
  
  // Append image data to form data object
  
  var headers = new Headers();
  console.log(csrftoken)
  headers.append('X-CSRFToken', csrftoken);
  // Send AJAX request
  $.ajax({
    url: " http://127.0.0.1:8000/api/scan_for_points",
    type: "POST",
    headers: headers,
    data: {image:imageData},
    processData: false,
    contentType: false,
    success: function(response) {
      // Image data received from backend API
      if(response.result == "positive"){
        var imageDataFromBackend = response.points;
        console.log(imageDataFromBackend)
        // Convert image data to OpenCV format
        //var image = cv.matFromImageData(new ImageData(new Uint8ClampedArray(imageDataFromBackend), canvas.width, canvas.height));
        show_pop_up_screen(previewImageOnly(imageData,response.points))
      }
      
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("AJAX error: " + textStatus + " - " + errorThrown);
    }
  });
}


startBtn.addEventListener('click', startCamera);
captureBtn.addEventListener('click', captureImage);
