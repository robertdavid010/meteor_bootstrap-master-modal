# Bootstrap Master Modal
### For MeteorJS & BlazeJS

This package will allow for dynamically generated modal views from supplied template.

You can trigger the modal as you would normally with bootstrap in the DOM, and set extra attributes for which template title etc. to render in the modal.

To install:
`meteor add rd010:bootstrap-master-modal`


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

Note: This is not intended as typical use case, merely for potential convenience.

## Using Javascript

MasterModal can also be called to trigger the modal with `MasterModal.trigger()`. It takes a options object identical to the use of the `data-context` attribute.

```javascript
MasterModal.trigger({
  title: "Modal Title",
  template: "myModalTemplate",
  btnlabel: "Save",
  data: {
  	param1: "value1",
  	param2: "value2"
  }
});
```

**Full list of configurable options**

Available configurable MasterModal attributes:

```javascript
size // Bootstrap size for modal "sm","md","lg"
title // Title displayed as modal-title
template // Template rendered in the modal-body
btnlabel // The label for the modal 'confirm' button
formbtns // helper available in template to be used with Autoform quickform
modalbtns // boolean to hide modal buttons if needed (default true)
modalview // Boolean helper to indicate the template is in a modal view. Can be used to show/hide content etc. for template re-use.
param // A single paramete to pass to the template data context
route // Definition of template and params in URI format. Overrides both.
context // NOTE: Intented for DOM element attribute only. Complete options object for the modal in JSON string. Overrides.
data // NOTE: Javascript config object and context attribute key. Fully description of data context for the modal template.
```

## AutoForm Support

MasterModal adds support to submit forms in the modal template through the simple convention of adding "Form" to the `<template name>` as the form id. 

The form will also be submitted by the default modal *confirm* button.

Those supported forms will also close the modal with the `onSuccess` AutoForm event of the form submission.

*myTemplateName.html*
```html
{{> quickForm id="myTemplateNameForm"}}
```

### Modal Buttons

There are two additional parameters that can be set to control the display of buttons in the MasterModal view: `modalbtns` and `formbtns`. By default `modalbtns=true` and `formbtns=false`. Setting one will always make the other the opposite, even if conflicted.

`{{formbtns}}` will be available in the local modal template context so for use with Autoform's `buttonContent` attribute for the `{{> quickform}}` template.

### Re-using Templates

Additionally `modalview` is available as helper in the modal template, and is a simple boolean value which will allow you to show or hide content based on whether or not the template is in the modal view. This will allow for re-use of templates in different contexts.

For example if you wanted to hide your custom form buttons in a template you wished to re-use elsewhere, using the default modal buttons instead for UI consistency:

*existingTemplate.html*
```handlebars
<form id="exsitingTemplateForm">
...
{{#unless modalview}}
  <submit class="custom-submit">Submit</submit>
{{/unless}}
</form>
```

## Custom integration

Since MasterModal uses default bootstrap methods to activate the modal, the modal may be triggered and handled with normal bootstrap methods. However this currently has limited testing.

## Examples

### Lightbox

One of the most common uses for modal views is to display the full image from a list of images in the main view when the user clicks on a thumbnail in the list. This will demonstrate how to implement such a feature using MasterModal.

You should first have a template view that is showing a list of thumbnails for instance. For example if you were using the bootstrap `media` list to show a list of thumbnails:

*picturesList.html*

```handlebars
{{#each picture}}
<ul class="list-unstyled">
  <li class="media">
    <img class="mr-3" src="{{thumbUrl}}" alt="Generic placeholder image">
    <div class="media-body">
      <h5 class="mt-0 mb-1">List-based media object</h5>
      Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
    </div>
  </li>
{{/each}}
```


Depending on how you would like the event element or styling of the object to work is up to you. If we were to wrap the img in an `<a>` element to trigger the modal, this is how it would work.

*picturesList.html*
```handlebars
...
<a href="#"
  data-toggle="master-modal"
  data-template="lightbox"
  data-title="{{imgName}}"
  data-param="{{imgUrl}}"
  data-size="lg"
>
  <img class="mr-3" src="{{thumbUrl}}" alt="Generic placeholder image">
</a>
...
```

Now you are able to create a generic lightbox template to display the image.

*lightbox.html*
```handlebars
<template name="lightbox"
  ...
  <img src="{{param}}">
  ...
</template>
```

### Autoform

This example demonstrates how to display and use an autoform as a simple dialogue form within MasterModal. We can assume the trigger element and all options are set.

As mentioned above, MasterModal will know the autoform has been successfully submitted if you use the appropriate naming convention of "*templateName*Form" for the form id.

**Simple AutoForm Dialogue Example**

*With Autoform Quickform*
```handlebars
...
{{> quickform collection="ourCollection" id="myTemplateForm" buttonContent=formbtns}}
...
```

