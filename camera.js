
///////////////////////////////   Camera part  /////////////////////////////////////////
// Access the camera and stream the video
async function startCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const select = document.getElementById("cameras");
    select.innerHTML = "";
    video.setAttribute("muted"," ")
    video.setAttribute("playsinline"," ")
    cameras.forEach((device) => {
        console.log(device)
        const option = document.createElement("option");
        option.id = "camera_option"+device.deviceId.toString()
        option.value = device.deviceId;
        option.text = device.label || `Camera ${select.length + 1}`;
        select.add(option);
    });
    
    try {
        cameraID = document.getElementById('cameras').value
        var stream = await navigator.mediaDevices.getUserMedia({video:{facingMode: "environment"}});
        var current_stream_device_id = stream.getVideoTracks()[0].getSettings().deviceId
        document.getElementById("camera_option"+current_stream_device_id.toString()).selected = "selected"
        camOption.addEventListener('change',async function(){
            newcameraID = camOption.value
            stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: newcameraID}});
            video.srcObject = stream;
            video.play();
        })
        
        video.srcObject = stream;
        video.play();
        startBtn.style.display = 'none';
        uploadBtn.style.display = 'none';
        captureBtn.style.display = 'block';
        camOption.style.display = 'block';
        captureBtn.disabled = false
    } catch (error) {
        console.log(error)
    }
}

// Capture an image from the video stream
function captureImage() {
    captureBtn.disabled = true
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    data = canvas.toDataURL('image/png');
    isCamUpload = true
    isFileUpload = false
    console.log(data);
        // You can do something with the data here, like send it to a server or display it on the page
    captureLoading.style.display = 'block'
    video.pause()
    sendImageToScan(data)
}


startBtn.addEventListener('click', startCamera);
captureBtn.addEventListener('click', captureImage);
