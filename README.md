# Bootstrap Master Modal
### For MeteorJS & BlazeJS

This package will allow for dynamically generated modal views from supplied template.

You can trigger the modal as you would normally with bootstrap in the DOM, and set extra attributes for which template title etc. to render in the modal.

To install:
`meteor install rd010:bootstrap-master-modal`


In your top level BlazeJS component template, include the MasterModal helper:
```handlebars
{{MasterModal}}
```

This will add the bootstrap modal element to your HTML document.

You trigger the modal in the same manner as a normal bootstrap modal with modifications:

```html
<button class="btn btn-info" data-toggle="master-modal">Launch Modal</button>
```

This will launch the modal with empty settings

## Configuring MasterModal

By passing configuration parameters to the `MasterModal.options()` method, you can set some default options.

The **array** parameter is a list of templates which will be used by MasterModal
```javascript
var arr = ['myTemplate','lightbox',...]
```
The **obj** parameter is an object with several optional default settings
```javascript
var obj = {size:"lg",title:"Modal Title",template:"myDefaultTemplate",btnlabel:"Confirm"}
```


*config.js*
```javascript
MasterModal.options(arr, obj);
```

## Event modal configuration

Not only can you configure the default settings for the modal, but they can be set through the data attributes of the event element.

```html
<button class="btn btn-info"
	data-toggle="master-modal"
	data-size="sm"
	data-title="new modal title"
	data-template="myTemplate"
	data-btnlabel="OK"
>
	Launch Modal
</button>
```

## Templates

Templates are rendered inside the `modal-body` element within the modal dialogue, and are defined normally as Meteor templates.

## Passing data to the modal

Additionally data can be passed to the local context of the rendered template, alleviating the need to write additional trival helpers just to acces a single parameter (for instance).

```html
<button class="btn btn-info"
	...
	data-param="someId"
>
	Launch Modal
</button>
```

This will make the `{{param}}` value available within the Blaze template

## More complex configuration of modal

It may be necessary to pass more data to the template, or be more convenient ways of defining the modal template and the data available to it.

The `data-route` attribute will take a simple URI type segment and regular query parameters, using the first URI segment as the template name, and parsing the parameters and making them available in the local template data context

```html
<button class="btn btn-info"
	...
	data-route="/myTemplateName?param1=value1&param2=value2"
>
Launch Modal
</button>

```
Note: This will override both `data-template` and `data-param` attributes

Lastly the `data-context` attribute can be used to pass a JSON object (as a string) to the modal trigger element, which will parsed as with keys corresponding to named alement data attributes. Also, any the top level `data` key will have all contained keys made available to the local template data context.

```html
<button class="btn btn-info"
	...
	data-context='{"template":"modalTemplate","title":"Modal Title","data":{"param1":"value1"}}'
>
	Launch Modal
</button>
```

## AutoForm Support

MasterModal adds support to submit forms in the modal template through the simple convention of adding "Form" to the <template name> as the form id. 

The form will also be submitted by the default modal *confirm* button.

Those supported forms will also close the modal with the `onSuccess` AutoForm event of the form submission.

*myTemplateName.html*
```html
{{> quickForm id="myTemplateNameForm"}}
```

### Modal and Form buttons interaction

There are two additional parameters that can be set for the MasterModal: `modalbtns` and `formbtns`. By default `modalbtns=true` and `formbtns=false`. Setting one will always make the other the opposite, even if conflicted. Also, `{{formbtns}}` will be available in the local modal template context so that existing forms can be used in modals, with the existing form buttons being replaced by the modal buttons.

*existingTemplate.html*
```html
<form id="customForm">
...
{{#unless}}
	<submit>Submit</submit>
{{/unless}}
</form>
```





