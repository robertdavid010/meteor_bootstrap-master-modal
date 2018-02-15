// MasterModal.js

/*
 *
 * ************************************************
 * Bootstrap Custom Modal for MeteorJS ************
 * ************************************************
 *
 * This is a package to create a basic routing
 * system for modals. This package can render
 * bascially any template inside a Bootstrap modal.
 * It parses and passes router helper generated,
 * or statically created, links with parameters and
 * queries to set the context for the modal template to
 * render and function properly.
 *
 */

MasterModal = new function () {
	var CONFIG = {};
	var inited = false;
	var configged = false;

  function __init () {
    if (!inited) {
      __setDefaults();
      inited = true;
    }
  }

  function __setDefaults () {
    CONFIG.title = "Master Modal"
    CONFIG.size = "md";
    CONFIG.template = "defaultModalTemplate";
    CONFIG.formbtns = false;
    CONFIG.modalbtns = true;
    CONFIG.btnlabel = "Submit";
    CONFIG.keys = [
      "title",
      "size",
      "param",
      "formbtns",
      "modalbtns",
      "btnlabel",
      "context",
      "template",
      "route",
      "callerTemplate"
    ];
  }

	function __configure (templates, options) {
		if (!configged) {
      if (Array.isArray(templates) && templates.length > 0) {
        CONFIG.templates = templates;
        CONFIG.forms = templates.map(function (e) {
          return e + "Form";
        });
      }
			var userKeys = ["template","size","title","btnlabel"]; // Whitelist of allowed config settings
			for (var key in options) {
		    if (userKeys.indexOf(key) !== -1) {
		    	CONFIG[key] = options[key];
		    }
			}

      configged = true;
		}
	}

	this.options = function (configs, defaults) {
		__configure(configs, defaults);
	}
	this.configs = function () {
		// return the raw config object
		return CONFIG;
	}

	__init();
};

if (Package['aldeed:autoform']) {
  var hooksObject = {
    onSuccess: function (formType, result) {
      $("#master-modal").modal("hide");
    }
  };
  import { AutoForm } from 'meteor/aldeed:autoform';
  AutoForm.addHooks(MasterModal.configs().forms, hooksObject);
}
