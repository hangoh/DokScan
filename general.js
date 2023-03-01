 /////////////////////////////// General Part ///////////////////////////////////////////////
        let cameraID
        
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
        var canvas = document.getElementById('modal-image');
        var ctx = canvas.getContext('2d');
        var mobile_screen = false

         // Function to close and show the modal dialog box
        function close_pop_up_screen() {
            modal.style.display = 'none';
            document.getElementById('file-input').value = ""
            data = ""
            isCamUpload = false
            isFileUpload = false
        }

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

        confirmBtn.addEventListener('click', function() {
            // Add your code to confirm the image here
            // For example, you could send the image data to the server using AJAX
            // and then close the modal dialog box
            close_pop_up_screen();
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
        

        function get_csrf(){
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://127.0.0.1:8000/api/');
            xhr.send();
            xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                    const headersString = xhr.getAllResponseHeaders();
                    return headersString
                    // Do something with the headers string
                }
            };
        }

        
       
        
