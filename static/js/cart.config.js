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
            var tag_url = location.href;

            tag_url = tag_url.split("tag=");

            $(".boton-cargar").removeClass("hidden");
            $(".inf").each(function()
            {
                var b = $(this);
                var a = $(this).attr("in_stock");

                if(a == "false")
                {
                    b.parent().children().children("button").html("Agotado");
                    b.parent().children().children("button").attr("disabled", true);
                }
            });

            if(!tag_url[1])
            {
                for(var prod = 0; prod < products.length; prod++)
                {
                    if(products[prod].tags.indexOf("especiales") != -1)
                    {
                        var sku = "." +products[prod].sku;
                        $(sku).addClass("hidden");
                    }
                }
            }
        }
    };

    $(document).ecommerce(config);

    $(document).on("click", ".subcateg", function(ev)
    {
        ev.preventDefault();

        var subtag = $(this).attr('tag');
        var tag_url = location.href;
        var tag = "";

        tag_url = tag_url.split("tag=");

        if(!tag_url[1])
        {
            config.tag = subtag;
            history.pushState('', 'nobuk', tag_url[0]+'?tag='+subtag);
        }
        else
        {
            config.tag = subtag;
            history.pushState('', 'nobuk', tag_url[0]+'tag='+subtag);
        }

        $(".products").html("");
        $(document).ecommerce('destroy');
        $(document).ecommerce(config);


    });
});
