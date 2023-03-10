/////////////////////////////// canvas to preview only //////////////////////////////////////////////
function previewImageOnly(imageData=NaN) {
    view_canvas()
    // Get the canvas element and context
    editable = false
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Create an image element and set its source to the captured image data
    const image = new Image();
    
    image.src = imageData;
    
    // When the image is loaded, draw it on the canvas and add the point drag listeners
    image.onload = function() {
        // Set the canvas dimensions to match the image dimensions
        
        canvas.width = image.width;
        canvas.height = image.height;
        p_radius = Math.floor(canvas.width*0.02)
        
        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);

        // Loop through the four points and draw circles at their positions
        for (let i = 0; i < points.length; i++) {
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, p_radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'cyan';
            ctx.fill();
        }
        
        draw_convex_hull()
    }
    
}


/////////////////////////////// canvas to preview and allow user to drag point //////////////////////
function previewImageWthDot(imageData=NaN) {
    edit_canvas()
    // Get the canvas element and context
    editable = true
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Create an image element and set its source to the captured image data
    const image = new Image();
    
    image.src = imageData;
    
    // When the image is loaded, draw it on the canvas and add the point drag listeners
    image.onload = function() {
        // Set the canvas dimensions to match the image dimensions
        
        canvas.width = image.width;
        canvas.height = image.height;
        p_radius = Math.floor(canvas.width*0.02)
        var middlepoint = [ Math.floor(canvas.width/2),  Math.floor(canvas.height/2)]
        console.log(points)
        try{
            points[0].x
        }catch{
           
            points = [
                { x: middlepoint[0]-Math.floor(middlepoint[0]/2), y: middlepoint[1]-Math.floor(middlepoint[1]/2) },
                { x: middlepoint[0]+Math.floor(middlepoint[0]/2), y: middlepoint[1]-Math.floor(middlepoint[1]/2)},
                
                { x: middlepoint[0]+Math.floor(middlepoint[0]/2), y: middlepoint[1]+Math.floor(middlepoint[1]/2)},
                { x: middlepoint[0]-Math.floor(middlepoint[0]/2), y: middlepoint[1]+Math.floor(middlepoint[1]/2)}
            ];
            
            tem_points = copy_points(points)
        }
        console.log(points)
        x_scale_down = canvas.getBoundingClientRect().width*1.0/canvas.width
        y_scale_down = canvas.getBoundingClientRect().height*1.0/canvas.height
        
        if(x_scale_down<1.0 ){
            mobile_screen = true
            
        }
        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);

        // Loop through the four points and draw circles at their positions
        for (let i = 0; i < points.length; i++) {
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, p_radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'cyan';
            ctx.fill();
        
        draw_convex_hull()
        ///dragging points part///

            // Add event listeners to allow the points to be dragged
            let isDragging = false;
            let offsetX, offsetY;


            canvas.addEventListener('mousedown', function mouseClick(e) {
                // Check if the mouse is over the current point
                    alertMsg.style.display = "none";
                    if(editable){
                        if(mobile_screen){
                            if (e.offsetX >= (points[i].x - p_radius)*x_scale_down && e.offsetX <= (points[i].x + p_radius)*x_scale_down &&
                                e.offsetY >= (points[i].y - p_radius)*y_scale_down && e.offsetY <= (points[i].y + p_radius)*y_scale_down) {
                                isDragging = true;
                                offsetX = e.offsetX - (points[i].x*x_scale_down)
                                offsetY = e.offsetY - (points[i].y*y_scale_down);
                            }
                        }else if(e.offsetX >= points[i].x - p_radius && e.offsetX <= points[i].x + p_radius &&
                            e.offsetY >= points[i].y - p_radius && e.offsetY <= points[i].y + p_radius) {
                            isDragging = true;
                            offsetX = e.offsetX - points[i].x;
                            offsetY = e.offsetY - points[i].y;
                        }
                    
                    }
                });

            canvas.addEventListener('touchstart',function mobiletouch(e){
                alertMsg.style.display = "none";
                if(editable){
                    e.preventDefault()
                    var touch = e.targetTouches[0];
                    if(mobile_screen){
                        if (touch.clientX - canvas.getBoundingClientRect().x >= (points[i].x - p_radius*2)*x_scale_down && touch.clientX-canvas.getBoundingClientRect().x <= (points[i].x + p_radius*2)*x_scale_down &&
                        touch.clientY - canvas.getBoundingClientRect().y>= (points[i].y - p_radius*2)*y_scale_down && touch.clientY - canvas.getBoundingClientRect().y <= (points[i].y + p_radius*2)*y_scale_down) {
                            isDragging = true;
                            offsetX = touch.clientX-canvas.getBoundingClientRect().x - (points[i].x*x_scale_down);
                            offsetY = touch.clientY-canvas.getBoundingClientRect().y - (points[i].y*y_scale_down);
                            console.log("X: "+(touch.clientX-canvas.getBoundingClientRect().x).toString()+", Y:"+(touch.clientY-canvas.getBoundingClientRect().y).toString())
                        }
                    }else{
                        if (touch.clientX - canvas.getBoundingClientRect().x >= (points[i].x - p_radius*2) && touch.clientX-canvas.getBoundingClientRect().x <= (points[i].x + p_radius*2) &&
                        touch.clientY - canvas.getBoundingClientRect().y>= (points[i].y - p_radius*2) && touch.clientY - canvas.getBoundingClientRect().y <= (points[i].y + p_radius*2)) {
                            isDragging = true;
                            offsetX = touch.clientX-canvas.getBoundingClientRect().x - (points[i].x);
                            offsetY = touch.clientY-canvas.getBoundingClientRect().y - (points[i].y);
                            console.log("X: "+(touch.clientX-canvas.getBoundingClientRect().x).toString()+", Y:"+(touch.clientY-canvas.getBoundingClientRect().y).toString())
                        }
                    }
                }
            })

            canvas.addEventListener('mousemove', function mousemove(e) {
                // If the point is being dragged, update its position
                if(editable){
                        if(mobile_screen){
                            x_scale_up = canvas.width*1.0/canvas.getBoundingClientRect().width
                            y_scale_up = canvas.height*1.0/canvas.getBoundingClientRect().height
                            if(isDragging){
                                console.log("X: "+(points[i].x).toString()+", Y:"+(points[i].y).toString())
                                console.log(points)
                                points[i].x = (e.offsetX )*x_scale_up - offsetX
                                points[i].y = (e.offsetY )*y_scale_up - offsetY
                                point_check(points,canvas)
                                
                                
                                redraw(ctx,image);
                            }
                            
                        }else{
                            if (isDragging) {
                                points[i].x = e.offsetX - offsetX;
                                points[i].y = e.offsetY - offsetY;
                                point_check(points,canvas)
                                
                                
                                redraw(ctx,image);
                            }
                        }
                }
                }
            );
            
            canvas.addEventListener("touchmove", function mobilemove(e){
                if(editable){
                    e.preventDefault()
                    var touch = e.targetTouches[0];
                    x_scale_down = canvas.getBoundingClientRect().width*1.0/canvas.width
                    y_scale_down = canvas.getBoundingClientRect().height*1.0/canvas.height
                    
                    if(mobile_screen){
                        x_scale_up = canvas.width*1.0/canvas.getBoundingClientRect().width
                        y_scale_up = canvas.height*1.0/canvas.getBoundingClientRect().height
                        if(isDragging){
                            console.log("X: "+(points[i].x).toString()+", Y:"+(points[i].y).toString())
                            console.log(points)
                            points[i].x = (touch.clientX - canvas.getBoundingClientRect().x)*x_scale_up - offsetX
                            points[i].y = (touch.clientY - canvas.getBoundingClientRect().y)*y_scale_up - offsetY
                            point_check(points,canvas)
                            
                            redraw(ctx,image);
                        }
                        
                    }else{
                        if(isDragging){
                            console.log("X: "+(points[i].x).toString()+", Y:"+(points[i].y).toString())
                            console.log(points)
                            points[i].x = (touch.clientX - canvas.getBoundingClientRect().x)- offsetX
                            points[i].y = (touch.clientY - canvas.getBoundingClientRect().y) - offsetY
                            point_check(points,canvas)
                            
                            redraw(ctx,image);
                            
                        }
                    }
                }
            })
            
            canvas.addEventListener('mouseup', function click_touch_release() {
                // Stop dragging the point when the mouse is released
                point_check(points,canvas)
                isDragging = false;
            });

            canvas.addEventListener("touchend",function click_touch_release() {
                // Stop dragging the point when the mouse is released
                point_check(points,canvas)
                isDragging = false;
            });

            // check if mouse or touch is out of canvas boundary
            modal.addEventListener('touchmove',function check_boundary_touch(e){
                if(editable){
                        e.preventDefault()
                        var touch = e.targetTouches[0];
                        c = canvas.getBoundingClientRect()
                        if(touch.clientX>(c.width+c.x)||touch.clientX<c.x||touch.clientY<c.y||touch.clientY>(c.y+c.height)){
                            isDragging = false
                        }
                }
            })

            modal.addEventListener('mousemove',function check_boundary_mouse(e){
                if(editable){
                    c = canvas.getBoundingClientRect()
                    if(e.clientX>(c.width+c.x)||e.clientX<c.x||e.clientY<c.y||e.clientY>(c.y+c.height)){
                        isDragging = false
                    }
                }
            })
            
        }
    };
}

// Function to redraw the canvas with the updated point positions
function redraw(ctx,imageData){
    // Clear the canvas and redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(imageData, 0, 0);

    // Loop through the four points and redraw them at their updated positions
    for (let i = 0; i < points.length;i++){
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, p_radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'cyan';
        
        ctx.fill();
    }
    
    draw_convex_hull()
}

function point_check(points,canvas){
    for (let i = 0; i < points.length; i++) {
        if(points[i].x>canvas.width){
            points[i].x = canvas.width
        }else if(points[i].y>canvas.height){
            points[i].y = canvas.height
        }else if(points[i].x<0){
            points[i].x = 0
        }else if(points[i].y<0){
            points[i].y = 0
        }
    }

}


editBtn.addEventListener('click',function(){
    tem_points = copy_points(points);
    console.log('edit')
    console.log(tem_points)
    previewImageWthDot(data)
})
editCancelBtn.addEventListener('click',function(){
    points = copy_points(tem_points )
    tem_points = []
    console.log('cancel edit')
    previewImageOnly(data)
})
editComfirmBtn.addEventListener('click',function(){
    tem_points = []
    console.log('save edit')
    previewImageOnly(data)
})
