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
    var queryString = myScript.src.replace(/^[^\?]+\??/,'');
    var params = parseQuery( queryString );

    function parseQuery ( query )
    {
        var Params = new Object ();
        if ( ! query ) return Params;
        var Pairs = query.split(/[;&]/);
        for ( var i = 0; i < Pairs.length; i++ )
        {
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

String.prototype.replaceAll = function(search, replacement)
{
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
    if (tag === undefined || tag === 'todos')
    {
        $("#todos").addClass("active");
    }

    var config =
    {
        'app_public': app_public,
        'base_url': base_url,
        'products_per_page' : 8, 
        'tag': tag,
        'ignore_stock': true,
        'infinite_scroll': false,
        // 'maxProducts': 100,
        'checkout_url': checkout_url,
        'column': 'position', 
        'direction': 'asc',
        'operator' :'and',
        'onLoad': function(products) 
        {
            $(".boton-cargar").removeClass("hidden");
            $(".inf").each(function()
            {
                var b = $(this);
                var a = $(this).attr("in_stock");
                console.log(a);

                if(a == "false")
                {
                    b.parent().children().children("button").html("Agotado");
                    b.parent().children().children("button").attr("disabled", true);
                }
            });
        }
    };

    $(document).ecommerce(config);

    $(document).on("click", ".subcateg", function(ev)
    {
        ev.preventDefault();

        var subtag = $(this).attr('tag');
        var hyper = location.href;
        var tag = "";

        hyper = hyper.split("tag=");

        if(hyper[1] == undefined)
        {
            config.tag = subtag;
            history.pushState('', 'nobuk', hyper[0]+'?tag='+subtag);
        }
        else
        {
            config.tag = subtag;
            history.pushState('', 'nobuk', hyper[0]+'tag='+subtag);
        }

        $(".products").html("");
        $(document).ecommerce('destroy');
        $(document).ecommerce(config);
    });
});
