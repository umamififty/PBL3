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

$(document).ready(function() {
    $(".image-thumbnail").click(popup);
    $(document).click(closePopup);
});

function popup() {
    var srcname = $(this).attr("src");
    var bigfile = srcname.replace("small", "large");
    var bigimg = $(".big-img");

    if (bigimg.length === 0) {
        $(this).after("<img class=\"big-img\" src=\"" + bigfile + "\"/>");
    } else {
        bigimg.remove();
    }
}

function closePopup(event) {
    var target = $(event.target);
    var bigimg = $(".big-img");

    if (!target.is(".image-thumbnail") && !target.is(".big-img")) {
        bigimg.remove();
    }
}
