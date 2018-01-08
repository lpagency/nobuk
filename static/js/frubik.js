//lleva a div dentro de pagina
anchor = {
    init: function() {
        $("a.anchorLink").click(function() {
            elementClick = $(this).attr("href");
            console.log(elementClick);
            destination = $(elementClick).offset().top;
            console.log(destination);
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: destination
            },800);
            return false;
        });
    }
}

var page=0;

// (function( $ ){
//    $.fn.infinit_scroll = function(tag="", limit=10) {
//     $(window).scroll(function() {
//            if($(window).scrollTop() + $(window).height() == $(document).height()) {
//                 page += 1;
//                 $.post(site_base + "/article/list", { 
//                             "tag" : tag, 
//                             "limit" : limit,
//                             "page" : page
//                         }, function(result)
//                         {
//                           $(".article_list").append(result)
//                         });
//            }
//       });
//    }; 
// })( jQuery );

var infinit_scroll = function(tag="", limit=10){
  $(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() == $(document).height()) {
            page += 1;
            $.post(site_base + "/article/list", { 
                        "tag" : tag, 
                        "limit" : limit,
                        "page" : page
                    }, function(result)
                    {
                      $(".article_list").append(result)
                    });
       }
  });
}


$(document).ready(function() 
{
    anchor.init();

});

var Validate = function(){
    var units = parseInt($(".units-total span").text());

        if (units>0){
    
                return true;
            
        }else{
            alert("Debe tener productos en el carrito para finalizar la compra.");
            return false;
        }
   
}
