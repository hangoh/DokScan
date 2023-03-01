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
        function getCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        
        function eraseCookie(name) {   
            document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        function setCookie(name,value,days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        }

        function get_csrf(){
            var csrf_t = ""
            $.ajax({
                url: "http://127.0.0.1:8000/api/",
                type: "GET",
                credentials: 'include',
                success: function(response) {
			// Image data received from backend API
			setCookie('csrftoken',response.token.toString(),7);
			console.log(response.token.toString())
			// Do your OpenCV processing here...
                },
                error: function(jqXHR, textStatus, errorThrown) {
                	console.log("AJAX error: " + textStatus + " - " + errorThrown);
                }
            })
            return csrf_t
        }
       
        
