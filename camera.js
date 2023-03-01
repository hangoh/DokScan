   
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
        camOption.addEventListener('select',async function(){
            cameraID = camOption.value
            stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: cameraID}});
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
    show_pop_up_screen(data)
}


startBtn.addEventListener('click', startCamera);
captureBtn.addEventListener('click', captureImage);
