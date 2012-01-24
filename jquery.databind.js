/*
* Databind jQuery plugin. By Marco Kotrotsos (mlabs.nl, @kotrotsos)
*
* The MIT License
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* Code is somewhat cobbled together using inspiration from different sources.
*
* $('yourform').fieldsToJSON()
* Serializes a form into a JSON compatible JS object.
*
* $('yourform').JSONToFields()
* Databinds (one way for now) a JSON object onto the fields.
*
* See example.html source for how this works.
*
* Small note, if name="root.val..." is not used, it searches for the initial data-bind value
* and uses that for output. So you do not need to use name=".." if you already bind to the
* data-bind attribute, however this can be convenient if  your output JSON structure looks
* different than your input.
*
* TODO : Databinding the Radiobuttons type.
 */

(function ($) {
    $.fn.fieldsToJSON = function () {
        if (!this.length) {
            return false;
        }
        var $el = this,
            data = {},
            lookup = data;

        $el.find(':input[type!="checkbox"][type!="radio"], input:checked').each(function () {
            var path = this.name;
            if (path != "" || path === undefined) {
                path = path.split('.');
            } else {
                path = $(this).data('bind').split('.');
            }

            var cap = path.length - 1,
                i = 0;

            if (path[ 0 ]) {
                for (; i < cap; i++) {
                    // move down the tree - create objects or array if necessary
                    lookup = lookup[ path[i] ] = lookup[ path[i] ] ||
                        ( path[i + 1] == "" ? [] : {} );
                }
                if (lookup.length != undefined) {
                    lookup.push($(this).val());
                } else {
                    lookup[ path[ cap ] ] = $(this).val();
                }
                lookup = data;
            }
        });
        return data;
    };

    $.fn.JSONToFields = function (dta) {
        var $templateHTML = this,
            $fieldArray = $("[data-bind]:input", $templateHTML),
            fdata = dta,
            $field = "",
            item = "",
            index = "";

        $.each(
            $fieldArray,
            function (index) {
                $field = $($fieldArray[index]);
                if ($field.attr('data-bind').length) {
                    var item = $field.attr('data-bind');

                    var val = item,
                        acc = dta,
                        parts = val.split('.'),
                        i;

                    for (i = 0; i < parts.length; i++)
                        acc = acc[parts[i]];

                    // type is textfield
                    if ($field.attr('type') == 'text' || $field.is('textarea')) {
                        $field.attr('value', acc);
                    }

                    // type is checkbox
                    else if ($field.attr('type') == 'checkbox') {
                        // check the field if the data value is true/1
                        if (acc == 1) {
                            $field.attr("checked", "checked");
                        }

                    // type is select
                    } else if ($field.is("select")) {
                        $field.val(acc);
                    }
                    // Radiobuttons : TODO
                }
            }
        );
    };
})(jQuery);

