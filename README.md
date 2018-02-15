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
<button class="btn btn-info" data-toggle="master-modal">
	Launch Modal
</button>
```

This will launch the modal with empty settings

## Configuring MasterModal

By passing configuration parameters to the `MasterModal.options(arr,obj)` method, you can set some default options.

The **array** parameter is a list of templates which will be used by MasterModal
```javascript
var arr = ['myTemplate','lightbox',...]
```
The **obj** parameter is an object with several optional default settings
```javascript
var obj = {size:"lg",title:"Modal Title",template:"myDefaultTemplate",btnlabel:"Confirm"}
```


**config.js**
```javascript
Master.options(arr, obj);
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

Templates are rendered inside the `modal-body` element within the modal dialogue.


