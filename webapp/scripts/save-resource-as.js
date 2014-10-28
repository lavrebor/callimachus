// save-resource-as.js
/*
   Copyright (c) 2011 3 Round Stones Inc, Some Rights Reserved
   Licensed under the Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0
*/

(function($){

if (!window.calli) {
    window.calli = {};
}

window.calli.saveFormAs = function(event, fileName, create) {
    return calli.saveResourceAs(event, fileName, create);
};
var nestedSubmit = false;
window.calli.saveResourceAs = function(event, fileName, create, folder) {
    event = calli.fixEvent(event);
    var form = event.target;
    if(!$(form).is('form')) form = $(form).closest('form')[0];

    $(form).find("input").change(); // IE may not have called onchange before onsubmit
    var resource = $(form).attr('about') || $(form).attr('resource');
    if (event.type == 'submit') {
        if (fileName && !nestedSubmit) {
            // let's set the resource attribute and go
            var about = calli.listResourceIRIs(calli.getPageUrl())[0];
            if (about.indexOf('?') > 0) {
                about = about.substring(0, about.indexOf('?'));
            }
            var ns = null;
            if (resource) {
                // use the already chosen folder
                ns = resource.replace(/[^\/]*\/?$/, '');
                if (!ns) {
                    ns = about.replace(/[^\/]*$/, '');
                }
            } else if (about.lastIndexOf('/') != about.length - 1
                    && window.location.search.indexOf('?create=') == 0) {
                // creating nested resource
                ns = about + '/';
            } else if (window.location.search == '?create') {
                ns = null; // we have to prompt for a folder
            } else {
                // create resource in this same folder
                ns = about.replace(/[^\/]*$/, '');
            }
            if (ns) {
                var local = encodeURI(fileName.replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g, '+')).replace(/%25(\w\w)/g, '%$1');
                resource = ns + local;
                $(form).removeAttr('about');
                $(form).attr('resource', resource);
                overrideLocation(form);
                return true;
            }
        } else if (resource) {
            // resource attribute ready set, let's go
            return true;
        }
    }
    // prompt for a new resource URI
    var label = fileName || findLabel(form) || localPart(resource);
    calli.promptForNewResource(folder, label).then(function(twoPartArray) {
        if (!twoPartArray) return; // dialogue cancelled
        var ns = twoPartArray[0];
        var local = twoPartArray[1];
        updateFormAction(form, ns, create);
        if (fileName) {
            local = local.replace(/(%20|\-)+/g,'-');
        } else {
            local = local.replace(/%20/g,'+');
        }
        if (ns.lastIndexOf('/') != ns.length - 1) {
            ns += '/';
        }
        var resource = ns + local;
        $(form).removeAttr('about');
        $(form).attr('resource', resource);
        overrideLocation(form);
        if (form.getAttribute("enctype") == "application/sparql-update") {
            form.setAttribute("enctype", "text/turtle");
        }
        try {
            nestedSubmit = true;
            $(form).submit(); // this time with a resource attribute
        } finally {
            nestedSubmit = false;
        }
    });
    $(form).removeAttr('about');
    $(form).removeAttr('resource');
    event.preventDefault();
    return false;
};

function findLabel(form) {
    var field = $($(form).find('input:not(:checkbox,:disabled,:button,:password,:radio)')[0]);
    var input = field.val();
    if (input) {
        var onchange = function() {
            if (input != $(field).val()) {
                // restore the resource attribute when this field changes
                if (resource) {
                    $(form).removeAttr('about');
                    $(form).attr('resource', resource);
                } else {
                    $(form).removeAttr('about');
                    $(form).removeAttr('resource');
                }
                field.unbind('change', onchange);
            }
        };
        field.bind('change', onchange);
    }
    return calli.slugify(input);
}

function localPart(resource) {
    if (resource)
        return resource.replace(/.*\/(.+)/, '$1');
    return null;
}

function updateFormAction(form, target, create) {
    var action = calli.getFormAction(form);
    var m;
    if (create) {
        form.setAttribute("method", "POST");
        form.action = target + '?create=' + encodeURIComponent(create);
    } else if (m = action.match(/^([^\?]*)\?create(&.*)?$/)) {
        action = target + '?create=';
        if (create) {
            action += encodeURIComponent(create);
        } else if (m[1]) {
            action += encodeURIComponent(calli.listResourceIRIs(m[1])[0]);
        } else {
            action += encodeURIComponent(calli.listResourceIRIs(location.pathname)[0]);
        }
        if (m[2]) {
            action += m[2];
        }
        form.setAttribute("method", "POST");
        form.action = action;
    } else if (m = action.match(/^([^\?]*)(\?create=[^&]+)(&.*)?$/)) {
        action = target + m[2];
        if (m[3]) {
            action += m[3];
        }
        form.setAttribute("method", "POST");
        form.action = action;
    }
}

function overrideLocation(form) {
    var action = calli.getFormAction(form);
    if (action.indexOf('?create') >= 0 && action.indexOf('&intermediate=') < 0 && isIntermidate(action)) {
        form.action += '&intermediate=true';
    }
}

function isIntermidate(url) {
    if (window.parent != window) {
        try {
            var childUrl = url;
            if (childUrl.indexOf('?create') > 0) {
                childUrl = childUrl.substring(0, childUrl.indexOf('?'));
                var parentUrl = window.parent.location.href;
                if (parentUrl.indexOf('?edit') > 0) {
                    parentUrl = parentUrl.substring(0, parentUrl.indexOf('?'));
                    if (parentUrl == childUrl) {
                        // they are creating a component in a dialog from an edit form
                        return true;
                    }
                }
            }
        } catch (e) {
            // I guess not
        }
    }
    return false;
}

})(jQuery);

