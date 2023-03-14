var done = false

async function form_doc_data(){
    
        var imageData = localStorage.getItem('imagedata')
        var points = localStorage.getItem('points')
        
        localStorage.removeItem('imagedata')
        localStorage.removeItem('points')
        
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
                done = true
                return true
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("AJAX error: " + textStatus + " - " + errorThrown);
                done = true
                //window.location.href = 'index.html';
            }
        });
       
}

async function loading(){
    const canvas = document.getElementById('loading-canvas')
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
    setInterval(() => {
        if (done){
            return true
        }
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
    }, 17);
}

async function window_load(){
    var [r1,r2] = await Promise.allSettled([form_doc_data(),loading()])
    if(r2){
        window.location.href = 'download.html';
    }
}

window_load()