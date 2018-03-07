# Bootstrap Master Modal

### For Meteor & BlazeJS

Generate dynamic modal dialogues, lightboxes, or any other view based on Blaze templates and custom modal attributes. The modal can be implemented and used similarly to the default Bootstrap modal if needed, allowing for re-use of existing code and templates.

To install:
`meteor add rd010:bootstrap-master-modal`

In your top level BlazeJS component template, include the MasterModal helper:

*app.js*
```handlebars
{{MasterModal}}
```

This will add the bootstrap modal element to your HTML document.

You trigger the modal through the DOM in the same manner as a normal bootstrap modal but with the `master-modal` target:

```html
<button class="btn btn-info" data-toggle="master-modal">Launch Modal</button>
```

This will launch the modal with empty settings an no content.

## Configuring MasterModal Defaults

By passing configuration parameters to the `MasterModal.options(array, options)` method, you can set some default options.

The **array** parameter is a set of whitelisted of templates which will be used by MasterModal. This is for security reasons, to prevent loading of templates not intended for modal use (see **Security**)
```javascript
var arr = ['myTemplate','lightbox',...]
```

The **options** parameter is an object with keys for several optional default settings to use when those instance specific options are not provided to the MasterModal.
```javascript
var obj = {size:"lg",title:"Modal Title",template:"myDefaultTemplate",btnlabel:"Confirm"}
```


*config.js*
```javascript
MasterModal.options(arr, obj);
```

## MasterModal Instance Configuration

Options for the specific instance of the MasterModal can be set through the data attributes of the event element which launches the modal:

```html
<button class="btn btn-info"
  data-toggle="master-modal"
  data-size="sm"
  data-title="My Modal Title"
  data-template="myModalTemplate"
  data-btnlabel="OK"
>
  Launch Modal
</button>
```

## Templates

Templates are rendered inside the `modal-body` element within the modal dialogue, and are defined as typical Meteor templates.

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

This will make the `{{param}}` value available within the Blaze template, and contain the `somdId` value.

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

MasterModal can also be called to trigger the modal with javascript with `MasterModal.trigger()`. The method takes a options object with identical formatting to the `data-context` attribute as described above.

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

### MasterModal Configuration Options

List of available MasterModal configuration options. These are availble when launching an instance of the modal view template using the `MasterModal.trigger()` method or through the DOM (appending "data-" to the attribute).

- [size](#configsize)
- [title](#configtitle)
- [template](#configtemplate)
- [btnlabel](#configbtnlabel)
- [formbtns](#configformbtns)
- [modalbtns](#configmodalbtns)
- [modalview](#configmodalview)
- [param](#configparam)
- [route](#configroute)
- [context(config)](#configcontext)
  - [data](#configdata)

<a name="configsize"></a>
**`size`**
Takes bootstrap size shorthand as one of either `sm`, `md`, or `lg`. If none is specified at the launch of the modal, the defaults will be used. If no size parameter is passed as user defaults, the package default is `md`.

<a name="configtitle"></a>
**`title`**
The title to be displayed as the title for the modal view in the Bootstrap `modal-title` element. This should be set in the configuration of MasterModal.

<a name="configtemplate"></a>
**`template`**
The template to display when no template is passed to the modal instnace. This is the equivalent to a `Error 404` page.

<a name="configbtnlabel"></a>
**`btnlabel`**
This will be used in place of the default text used by the package for the modal "confirm" button. The package default is "Submit".

<a name="configformbtns"></a>
**`formbtns`**
This attribute is will set the `MMformbtn` helper with the modal template context to be used to pass to the `buttonContent` parameter for AutoForm quickform.

<a name="configmodalbtns"></a>
**`modalbtns`**
Setting this to `false` will hide the modal confirmation and dismiss buttons, allowing use of custom UI controls for the modal. Default is `true` of course.

<a name="configmodalview"></a>
**`modalview`**
This value will be available as the `MMview` helper is within the modal template context as a boolean value to indicate the template is being rendered in the modal view. This will allow for the hiding of content within that supplied template based on the modal context to allow for re-use of the template in other contexts, with different controls or elements.

<a name="configparam"></a>
**`param`**
The value to be passed to the related `MMparam` helper available within the modal template when set on the launch of the template instance through the DOM trigger element.

<a name="configroute"></a>
**`route`**
Allows for definition of template and params in URI format using single attribute on the triggering DOM element. Overrides other direct attributes.

<a name="configcontext"></a>
**`context`**
NOTE: Intented for DOM element attribute only. Complete options object for the modal in JSON string. Overrides other direct attributes, and can include the `data` element.

<a name="configdata"></a>
**`data`**
Javascript config object and context attribute key. Fully describes the data context for the template when used in the `data-context` DOM attribute, or within the `data:{}` key for the config object passed to `MasterModal.trigger()` method.


## Template View Helpers
Based on configurations above, several helpers are by default available within the modal view template data context.

- MMview
- MMformbtn
- MMparam

```handlebars
{{MMview}}
```
Default simple boolean helper to allow for template views to easily conditionally disply UI elements based on the modal context. See examples with AutoForm.

```handlebars
{{MMformbtn}}
```
For use with Autoform `{{> quickform}}` `buttonContent` parameter to either hide or display custom form submission button content. Can be set to "false" or custom text.

```handlebars
{{MMparam}}
```
The single value passed by the `data-param` attribute from the DOM.

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
{{#autoForm id="exsitingTemplateForm">
    <!-- form fields -->
    {{#unless modalview}}
        <submit class="custom-submit">Submit</submit>
    {{/unless}}
{{/autoForm}}
```

## Custom integration

Since MasterModal uses default bootstrap methods to activate the modal, the modal may be triggered and handled with those normal bootstrap methods. However this currently has limited testing.

## Examples

**Lightbox**

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
      Cras sit amet nibh libero, in gravida nulla. 
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
<template name="lightbox">
  ...
  <img src="{{param}}">
  ...
</template>
```

**Simple AutoForm Dialogue Example**

This example demonstrates how to display and use an autoform as a simple dialogue form within MasterModal. We can assume the trigger element and all options are set.

As mentioned above, MasterModal will know the autoform has been successfully submitted if you use the appropriate naming convention of "\<templateName>Form" for the form id.

*myTemplate.html*
```handlebars
<template name="myTemplate">
    {{> quickform collection="myCollection" id="myTemplateForm" buttonContent=formbtns}}
</template>
```

