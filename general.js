 /////////////////////////////// General Part ///////////////////////////////////////////////
let cameraID

let csrftoken
const video = document.getElementById('video');
const startBtn = document.getElementById('start');
const uploadBtn = document.getElementById('upload');
const captureBtn = document.getElementById('capture');
var data = ""
var isFileUpload = false
var isCamUpload = false

var camOption = document.getElementById('cameras')
var modal = document.getElementById('modal');
var modalContainer = document.getElementById('modal-container');
var modalContent = document.getElementById('modal-content');

var confirmBtn = document.getElementById('confirm-btn');
var cancelBtn = document.getElementById('cancel-btn');

var editBtn = document.getElementById('edit-btn')
var editComfirmBtn = document.getElementById('edit-confirm-btn')
var editCancelBtn = document.getElementById('edit-cancel-btn')

var canvas = document.getElementById('modal-image');
var ctx = canvas.getContext('2d');
const alertMsg = document.getElementById("canvas-alert");
var mobile_screen = false
var editable = false

let points = []
var tem_points = []

    // Function to close and show the modal dialog box

function show_pop_up_screen(func){
    modal.style.display = 'block';
    screen_height = window.innerHeight*0.85;
    screen_width = window.innerWidth*0.85;
    //modalContainer.style.maxHeight = screen_height.toString()+"px";
    //modalContainer.style.maxWidth = screen_width.toString()+"px";
    //canvas.style.maxHeight = (screen_height*0.8).toString()+"px";
    //canvas.style.maxWidth = (screen_width*0.8).toString()+"px";
    func
}

function close_pop_up_screen() {
    modal.style.display = 'none';
    document.getElementById('file-input').value = ""
    data = ""
    isCamUpload = false
    isFileUpload = false
    mobile_screen = false
    editable = false
    points = []
    tem_points = []
    
}


confirmBtn.addEventListener('click', function() {
    // Add your code to confirm the image here
    // For example, you could send the image data to the server using AJAX
    // and then close the modal dialog box
    console.log(points)
    console.log(tem_points)
    localStorage.setItem('imagedata',JSON.stringify(data))
    localStorage.setItem('points',JSON.stringify(points))
    close_pop_up_screen();
    //window.location.href = "loading.html"    
    
});

cancelBtn.addEventListener('click', function() {
    // Close the modal dialog box
    close_pop_up_screen();
});


///modal.addEventListener('click', function(event) {
// Close the modal dialog box if the user clicks outside the modal content
///   if (event.target == modal) {
///        close_pop_up_screen();
///    }
///});
function copy_points(p){
    new_p = []
    console.log(p)
    for (var i = 0; i < points.length; i++) {
        new_p.push({x:p[i].x , y:p[i].y})
    }
    return new_p
}

function get_csrf(){
    
    $.ajax({
    url: " https://dokscan.up.railway.app/api/",
    type: "GET",
    success: function(response) {
    // Image data received from backend API
        
        const csrf_token = (response.token).toString()
        localStorage.setItem('csrf-token',JSON.stringify(csrf_token))
        },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log("AJAX error: " + textStatus + " - " + errorThrown);
        }
    })
    
}


// Function to send AJAX request
function sendImageToScan(imageData) {
    // Create form data object
    var formData = new FormData();
    
    // Append image data to form data object
    formData.append("image", imageData);
    
    
    // Send AJAX request
    $.ajax({
        url: " https://dokscan.up.railway.app/api/scan_for_points",
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
        // Image data received from backend API
        if(response.result == "positive"){
            var imageDataFromBackend = response.points;
            console.log(imageDataFromBackend)
        
            for(let i=0 ;i<imageDataFromBackend.length;i++){
                p ={x:0,y:0}
                p.x = imageDataFromBackend[i][0][0]
                p.y = imageDataFromBackend[i][0][1]
                points.push(p)
            }
            show_pop_up_screen(previewImageOnly(imageData))
        }else{
            // Hide the alert message after 4 seconds
            
            show_pop_up_screen(previewImageWthDot(imageData))
            alertMsg.style.display = "block";
            setTimeout(function() {
            alertMsg.style.display = "none";
            }, 5500);
        }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("AJAX error: " + textStatus + " - " + errorThrown);
        }
    });
}


function edit_canvas(){
    confirmBtn.style.display = 'none'
    cancelBtn.style.display = 'none'
    editBtn.style.display = 'none'
    editComfirmBtn.style.display = 'block'
    editCancelBtn.style.display = 'block' 
    
}

function view_canvas(){
    confirmBtn.style.display = 'block'
    cancelBtn.style.display = 'block'
    editBtn.style.display = 'block'
    editComfirmBtn.style.display = 'none'
    editCancelBtn.style.display = 'none'
}




function draw_convex_hull(){
    // Define an array of points
    // Move the drawing cursor to the first point
    ctx.moveTo(points[3].x, points[3].y);

    // Loop through the remaining points and draw a line to each one
    for (var i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    // Set the line color and width
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 4    ;

    // Draw the line
    ctx.stroke();
}


