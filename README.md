# Databind jQuery Plugin.

Serializes a form into a JSON compatible JS object.

`$('yourform').fieldsToJSON()`

Databinds (one way for now) a JSON object onto the fields.

`$('yourform').JSONToFields()`

See example.html source for how this works.

Small note, if name="root.val..." is not used, it searches for the initial data-bind value and uses that for output. So you do not need to use name=".." if you already bind to the
data-bind attribute, however this can be convenient if  your output JSON structure looks different than your input.