// credential-create.js
/*
 * Copyright (c) 2014 3 Round Stones Inc., Some Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

jQuery(function($){

$('#created').val(new Date().toISOString()).change();

$('form[typeof~="calli:Credential"]').bind('calliRedirect', function(event){
    var password = $('#password').val();
    if (password && event.cause.type == 'calliSubmit') {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: event.resource + '?password',
            contentType: 'text/plain',
            data: rstr2b64(str2rstr_utf8(password)),
            xhrFields: calli.withCredentials,
            dataType: "text",
            success: function(url) {
                window.location.replace(url);
            }
        });
    }
});

});
