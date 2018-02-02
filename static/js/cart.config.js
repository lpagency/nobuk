/* global $ */
/* global Utils */
/* global unescape */
/* global document */
/* export config */
'use strict';

var getIncludeParameters = function()
{
    var scripts = document.getElementsByTagName('script');
    var myScript = scripts[ scripts.length - 6 ];
    // var scripts = document.getElementsByTagName('script');
    // var myScript = scripts[ scripts.length - 1 ];

    var queryString = myScript.src.replace(/^[^\?]+\??/,'');

    var params = parseQuery( queryString );

    function parseQuery ( query ) {
        var Params = new Object ();
        if ( ! query ) return Params; // return empty object
        var Pairs = query.split(/[;&]/);
        for ( var i = 0; i < Pairs.length; i++ ) {
            var KeyVal = Pairs[i].split('=');
            if ( ! KeyVal || KeyVal.length != 2 ) continue;
            var key = unescape( KeyVal[0] );
            var val = unescape( KeyVal[1] );
            val = val.replace(/\+/g, ' ');
            Params[key] = val;
        }
        return Params;
    }

    return params;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

$(document).ready(function() 
{
    var params = getIncludeParameters();
    var tag = '';

    try
    {
        tag = Utils.getUrlParameter('tag');
        tag = tag.replaceAll("%20", " ");
    }
    catch(ex)
    {
        // nothing here... 
    }

    $("#"+tag).addClass("active");
    if (tag === undefined || tag === 'todos'){
        $("#todos").addClass("active");
    }

    var config = {
        'app_public': app_public,
        'base_url': base_url,
        'products_per_page' : 9, 
        'tag': tag,
        'ignore_stock': true,
        'infinite_scroll': true,
        // 'maxProducts': 100,
        'checkout_url': checkout_url, 
        'operator' :'and',
        'onLoad': function(products) 
        {
            console.log(products);
        }
    };

    console.log(config.tag);

    $(document).ecommerce(config);

    $(document).on("click", ".subcateg", function(ev){
        ev.preventDefault();

        var subtag = $(this).attr('tag');
        var hyper = location.href;
        var tag = "";

        hyper = hyper.split("tag=");

        if(hyper[1].indexOf("mujer") > -1)
        {
            tag = "mujer";
            var tag_url = (tag + "," + subtag);
            config.tag = (tag + "," + subtag);
            console.log(config);
            history.pushState('', 'nobuk', hyper[0]+'tag='+tag_url);
        }

        if(hyper[1].indexOf("hombre") > -1)
        {
            tag = "hombre";
            var tag_url = (tag + "," + subtag);
            config.tag = (tag + "," + subtag);
            console.log(config);
            history.pushState('', 'nobuk', hyper[0]+'tag='+tag_url);
        }

        if(hyper[1].indexOf("hombre") == -1 && hyper[1].indexOf("mujer") == -1)
        {
            config.tag = subtag;
        }

        console.log(config.tag);
        $(".products").html("");
        $(document).ecommerce('destroy');
        $(document).ecommerce(config);

        
        // console.log(config);
        
        // facade.page = 1; // o 1 no estoy seguro
        

            // alert($(this).attr("tag"));
    });
});
