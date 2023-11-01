// $(document).ready(clicklistener());
    
// function clicklistener(){
//     $(".image-thumbnail").click(popup);
// }

// function popup(){
//     var srcname = $(this).attr("src");
//     var bigfile = srcname.replace("small", "large");
//     var bigimg = document.getElementsByClassName("big-img");
    
//     if(bigimg.length == 0){
//         $(this).after("<img class=\"big-img\" src=\"" + bigfile + "\"/>");
//     }
//     else{
//         if (bigimg.length > 0){
//         bigimg[0].parentNode.removeChild(bigimg[0]);
//         }
//     }
// }

// $(document).ready(function() {
//     $(".image-thumbnail").click(popup);
//     $(document).click(closePopup);
// });

// function popup() {
//     var srcname = $(this).attr("src");
//     var bigfile = srcname.replace("small", "large");
//     var bigimg = $(".big-img");

//     if (bigimg.length === 0) {
//         $(this).after("<img class=\"big-img\" src=\"" + bigfile + "\"/>");
//     } else {
//         bigimg.remove();
//     }
// }

// function closePopup(event) {
//     var target = $(event.target);
//     var bigimg = $(".big-img");

//     if (!target.is(".image-thumbnail") && !target.is(".big-img")) {
//         bigimg.remove();
//     }
// }

function myFunction(imgs) {
    // Get the expanded image
    var expandImg = document.getElementById("expandedImg");
    // Get the image text
    var imgText = document.getElementById("imgtext");
    // Use the same src in the expanded image as the image being clicked on from the grid
    expandImg.src = imgs.src;
    // Use the value of the alt attribute of the clickable image as text inside the expanded image
    imgText.innerHTML = imgs.alt;
    // Show the container element (hidden with CSS)
    expandImg.parentElement.style.display = "block";
  }
