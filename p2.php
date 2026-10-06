<?php

$default_img = "non_immagine.png";

$img = isset($_GET['img']) ? basename($_GET['img']) : null;

if(!$img || !file_exists($img)){
    $img = $default_img;
}

$files = array_merge(
    glob("*.png"),
    glob("*.jpg"),
    glob("*.jpeg"),
    glob("*.webp"),
    glob("*.gif"),
    glob("*.svg"),
    glob("*.avif")
);

?>

<!DOCTYPE html>

<html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>immagine:</title>

        <style>
            *{
                margin:0;
                padding:0;
                box-sizing:border-box;
            }

            *::first-letter{
                text-transform:uppercase;
            }

            html{
                scroll-behavior:smooth;
            }

            body{
                font-family:Arial, Helvetica, sans-serif;
                background:#111;
                color:white;

                display:flex;
                justify-content:center;
                align-items:center;
                min-height:100vh;
            }

            /* contenitore principale */

            #contenitore{
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:20px;
                text-align:center;
            }

            /* immagine principale */

            #img-vis-meglio{
                max-width:90%;
                max-height:80vh;
            }

            .main-img{
                border-radius:14px;
                box-shadow:0 20px 60px rgba(0,0,0,0.7);
                transition:transform 0.3s ease;
            }

            .main-img:hover{
                transform:scale(1.02);
            }

            /* titolo immagine */

            #titolo-img{
                position:absolute;
                top:30px;
                font-size:26px;
                font-weight:600;

                background:rgba(255,255,255,0.6);
                padding:8px 16px;
                border-radius:8px;
                backdrop-filter:blur(5px);
            }

            /* lista immagini */

            #lista-img{
                margin-top:40px;
                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                gap:10px;
            }

            #lista-img img{
                width:120px;
                border-radius:8px;
                opacity:0.7;
                transition:all 0.25s;
            }

            #lista-img img:hover{
                opacity:1;
                transform:scale(1.1);
            }

            /* frecce navigazione */

            .arrow{
                position:fixed;
                top:50%;
                transform:translateY(-50%);
                font-size:50px;
                cursor:pointer;
                padding:15px;
                background:rgba(0,0,0,0.4);
                border-radius:10px;
                user-select:none;
            }

            .arrow:hover{
                background:rgba(0,0,0,0.7);
            }

            #left{
                left:20px;
            }

            #right{
                right:20px;
            }

            /* bottone torna su */

            #tornasu{
                width:7%;
                position:fixed;
                bottom:0;
                right:0;
                z-index:100000;
                border-top-left-radius:10px;
            }

            #tornasu:hover{
                cursor:pointer;
                background-color:rgba(200,200,200,0.5);
            }
            /* miniatura attiva */
            .thumb{
                display:flex;
                flex-direction:column;
                align-items:center;
                text-decoration:none;
                color:white;
            }
            .thumb.active-thumb img{
                border:3px solid #4da3ff;
                opacity:1;
            }
            .thumb.active-thumb{
                transform:scale(1.05);
            }
            /* fullscreen viewer */

            #fullscreen{
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.95);
                display:flex;
                justify-content:center;
                align-items:center;
                opacity:0;
                pointer-events:none;
                transition:opacity 0.25s;
                z-index:9999;
            }

            #fullscreen img{
                max-width:95%;
                max-height:95%;
                border-radius:10px;
            }

            #fullscreen.show{
                opacity:1;
                pointer-events:auto;
            }
        </style>
    </head>
    <body>
        
    <div id="galleria">

        <div id="viewer">
            <img id="img-vis-meglio" src="<?php echo $img; ?>" class="main-img">
            <div id="fullscreen">
                <img id="fullscreen-img">
            </div>
        </div>

        <div id="sidebar">

            <?php
            foreach($files as $f){

                $active = ($f == $img) ? "active-thumb" : "";

                echo "<a href='p2.php?img=$f' class='thumb $active'>
                        <img src='$f'>
                        <span>$f</span>
                    </a>";
            }
            ?>

        </div>

    </div>

        <!-- per tornare su -->
        <a href=""><img src="img_freccia.png" alt="TORNA SU" id="tornasu"></a>

        <script>
            const images = [
            <?php
            foreach($files as $f){
                echo "'$f',";
            }
            ?>
            ];

            let index = images.indexOf(img_id);

            function show(i){

                if(i < 0) i = images.length - 1;
                if(i >= images.length) i = 0;

                window.location = "p2.php?img=" + images[i];
            }

            document.getElementById("left").onclick = () => show(index - 1);
            document.getElementById("right").onclick = () => show(index + 1);

            document.addEventListener("keydown", e => {

                if(e.key === "ArrowRight"){
                    show(index + 1);
                }

                if(e.key === "ArrowLeft"){
                    show(index - 1);
                }

            });

            document.getElementById("img-vis-meglio").ondblclick = () => {
                history.back();
            };

            const active = document.querySelector(".active-thumb");

            if(active){
                active.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
            const mainImg = document.getElementById("img-vis-meglio");
            const fullscreen = document.getElementById("fullscreen");
            const fullscreenImg = document.getElementById("fullscreen-img");

            mainImg.onclick = () => {

                fullscreenImg.src = mainImg.src;
                fullscreen.classList.add("show");

            };

            fullscreen.onclick = () => {
                fullscreen.classList.remove("show");
            };

            document.addEventListener("keydown", e => {

                if(e.key === "Escape"){
                    fullscreen.classList.remove("show");
                }

            });
        </script>
    </body>
</html>
