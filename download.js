var byteData =''
var url
var canvas = document.getElementById('download_canvas')
var ctx = canvas.getContext('2d')
var img_download = document.getElementById('img_d')
var pdf_download = document.getElementById('pdf_d')

function get_img_data(){
    try{
        byteData = localStorage.getItem('image_byte')
        if(byteData == null){
            console.log('redirecting...')
            window.location.href = 'index.html';
        }else{
             url = byteData
            localStorage.removeItem('image_byte')
            drawimage(byteData)
        }
    
   }catch{
        console.log('redirecting...')
        window.location.href = 'index.html';
   }
}




function drawimage(url){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    
    image.src = url;
    image.onload = function() {
        // Set the canvas dimensions to match the image dimensions
        
        canvas.width = image.width;
        canvas.height = image.height;
        
        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);

    }
}

function get_date(){
    // create a new Date object
    var today = new Date();

    // get the current date
    var date = today.getDate(); // returns the day of the month (1-31)
    var month = today.getMonth() + 1; // returns the month (0-11)
    var year = today.getFullYear(); // returns the year (4 digits)

    // get the current time
    var hours = today.getHours(); // returns the hour (0-23)
    var minutes = today.getMinutes(); // returns the minutes (0-59)
    var seconds = today.getSeconds(); // returns the seconds (0-59)
    return `${date}/${month}/${year}-${hours}:${minutes}:${seconds}`
}

img_download.addEventListener('click',function(e){

    const a = document.createElement("a");
    a.href = url;
    a.download = `DokScan-${get_date()}.jpeg`;
    a.click();
})



// Convert the image to a PDF and download it
async function downloadImageAsPdf(imageSrc) {
    // Load the image
    const img = new Image
    img.src = imageSrc

    // Create a new PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Add the image to the PDF and scale it to fit on the page
    var width = img.width;
    var height = img.height;

    // calculate the center of the page
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const centerY = doc.internal.pageSize.getHeight() / 2;

    // set the maximum width and height of the image
    const maxWidth = doc.internal.pageSize.getWidth() - 20; // subtracting some margin
    const maxHeight = doc.internal.pageSize.getHeight() - 20; // subtracting some margin

    // check if the width or height is larger than the maximum size
    if (width > maxWidth || height > maxHeight) {
        // calculate the aspect ratio of the image
        const aspectRatio = width / height;

        // resize the image to fit the maximum size while maintaining the aspect ratio
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }

        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
    }

    // add the image to the PDF
    doc.addImage(img, 'JPEG', centerX - width / 2, centerY - height / 2, width, height);
    // Download the PDF at the frontend
    doc.save(`DokScan-${get_date()}.pdf`);
}

pdf_download.addEventListener("click", () => {
  downloadImageAsPdf(url);
});
window.jsPDF = window.jspdf.jsPDF

get_img_data()

