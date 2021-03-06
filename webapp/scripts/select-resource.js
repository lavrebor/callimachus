// select-resoure.js
/*
   Copyright (c) 2011 Talis Inc, Some Rights Reserved
   Licensed under the Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0
*/

(function($, jQuery){

calli.selectFile = function(node, src) {
    return calli.selectResource(node, src);
};

calli.selectResource = function(event, src) {
    event = calli.fixEvent(event);
    event.preventDefault();
    var node = event.target;
    var list = $(node).closest('.form-group,[dropzone]');
    var title = '';
    if (list.attr("id")) {
        title = $("label[for='" + list.attr("id") + "']").text();
    }
    if (!title) {
        title = list.find("label").text();
    }
    var dialog = null;
    var url = null;
    if (!src && $(node).closest("[href]").length) {
        src = $(node).closest("[href]").attr('href');
    }
    if (!src) {
        src = "/?view";
    }
    if (src.indexOf("/?view") >= 0) {
        try {
            if (window.sessionStorage.getItem("LastFolder")) {
                url = window.sessionStorage.getItem("LastFolder");
            } else if (window.localStorage.getItem("LastFolder")) {
                url = window.localStorage.getItem("LastFolder");
            }
        } catch (e) {
            // ignore
        }
    }
    return calli.promise(function(callback){
        var closed = false;
        var resource = src.replace(/\?.*/,'');
        var options = {
            onmessage: function(event) {
                if (event.data.indexOf('POST resource\n') === 0) {
                    var data = event.data;
                    resource = data.substring(data.indexOf('\n\n') + 2);
                }
            },
            buttons: {
                "Select": function() {
                    var de = jQuery.Event('drop');
                    de.dataTransfer = {getData:function(){return resource;}};
                    de.errorMessage = "Invalid Selection";
                    $(node).trigger(de);
                    closed = true;
                    calli.closeDialog(dialog);
                    callback(resource);
                },
                "Cancel": function() {
                    closed = true;
                    calli.closeDialog(dialog);
                    callback();
                }
            },
            onclose: function() {
                try {
                    $(node)[0].focus();
                } catch (e) {
                    // ignore
                }
                if (!closed) callback();
            }
        };
        var openBrowseDialog = function(url) {
            dialog = calli.openDialog(url, title, options);
        };
        if (url) {
            calli.headText(url).then(function(){
                openBrowseDialog(url);
            }, function(){
                openBrowseDialog(src);
            });
        } else {
            openBrowseDialog(src);
        }
    });
};

})(jQuery, jQuery);

