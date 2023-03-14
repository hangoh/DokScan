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
    close_pop_up_screen();
    form_doc_data(data)
    
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
        csrftoken=csrf_token
    
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

function form_doc_data(imageData){
    
    var formData = new FormData()
    formData.append('image',imageData)

    var numpy_p_list = []
    for (let i = 0;i<points.length; i++){
        var p_list = [[]]
        p_list[0].push(points[i].x)
        p_list[0].push(points[i].y)
        numpy_p_list.push(p_list)
    }
    formData.append('points',JSON.stringify(numpy_p_list))
    console.log(numpy_p_list)
    $.ajax({
        url: " https://dokscan.up.railway.app/api/return_scaned_doc",
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
        // Image data received from backend API
            localStorage.setItem('image_byte',`data:image/jpeg;base64,${response}`)
             window.location.href = 'download.html';
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("AJAX error: " + textStatus + " - " + errorThrown);
            forming_doc = false
            
        }
    });
    
}

function loading(){
    const canvas = document.getElementById('loading')
    document.getElementById('loading_modal').style.display = 'block'
    
        const canvasWidth = 80;
        const canvasHeight = 24;
        const canvasArea = canvasHeight * canvasWidth;
        const yOffset = 12;
        const xOffset = 40;
        const innerRadius = 2;
        const r1Points = 90; // 90
        const r2Points = 314; // 314
        const fov = 5;

        const what = 30;

        let A = 0;
        let B = 0;

        let shades = '.,-~:;=!*#$@'.split('');
        // let shades = 'patrick PATRICK'.split('');

        // buffers
        let b, z;
        var interval = false
        interval = setInterval(() => {
            if(forming_doc){
                b = Array(canvasArea).fill(' '); //
                z = Array(7040).fill(0); // z-buffer set to z^-1

                for (let j = 0; j < 6.28; j += 6.28 / r1Points) {
                for (let i = 0; i < 6.28; i += 6.28 / r2Points) {
                    let c = Math.sin(i);
                    let d = Math.cos(j);
                    let e = Math.sin(A);
                    let f = Math.sin(j);
                    let g = Math.cos(A);

                    let h = d + innerRadius;

                    let D = 1 / (c * h * e + f * g + fov);

                    let l = Math.cos(i);
                    let m = Math.cos(B);
                    let n = Math.sin(B);
                    let t = c * h * g - f * e;

                    // floored floats a.k.a. ints
                    let x = (xOffset + what * D * (l * h * m - t * n)) << 0;
                    let y = (yOffset + (what / 2) * D * (l * h * n + t * m)) << 0;
                    let o = (x + canvasWidth * y) << 0;
                    let shadeConstant = (((shades.length + 1) * 2) / 3) << 0; // ceil(shade.length * (2/3))
                    let N =
                    (shadeConstant *
                        ((f * e - c * d * g) * m - c * d * e - f * g - l * d * n)) <<
                    0;

                    if (canvasHeight > y && y > 0 && x > 0 && canvasWidth > x && D > z[o]) {
                    z[o] = D;
                    b[o] = shades[N > 0 ? N : 0];
                    }
                }
                }

                canvas.innerHTML = '';
                let line = [];

                for (let k = 0; k < canvasArea + 1; k++) {
                if (k % canvasWidth) {
                    line.push(b[k]);
                } else {
                    canvas.innerHTML += line.join('') + '<br />';
                    line = [];
                }

                A += 0.00002;
                B += 0.00001;
                }
            }else{
                document.getElementById('loading_modal').style.display = 'none'
                
            }
        }, 17);
}
