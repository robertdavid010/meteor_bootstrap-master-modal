// MasterModal.js

/*
 *
 * ************************************************
 * Bootstrap Custom Modal for MeteorJS & Blaze ****
 * ************************************************
 *
 * This is a package to create a basic routing
 * system for modals. It can render any template
 * inside a Bootstrap modal.
 *
 *
 */

MasterModal = new function () {
	var CONFIG = {};
	var inited = false;
	var configged = false;

  parseUri = function (str) {
    // PARSER for using url style arguments
    // parseUri 1.2.2
    // (c) Steven Levithan <stevenlevithan.com>
    // MIT License
    function parser (s) {
      var o   = this.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(s),
        uri = {},
        i   = 14;

      while (i--) uri[o.key[i]] = m[i] || "";

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });

      return uri;
    };

    this.options = {
      strictMode: false,
      key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
      q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    return parser(str);
  }; // end parseUri

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
    CONFIG.modalview = true;
    CONFIG.btnlabel = "Confirm";
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

  function __checkKeys(obj) {
    // Simple check to transform obj if needed
    var modalData = {context:{}};
    if (!obj.context) {
      modalData = __validateKeys(obj);

    } else {
      // "context" data attribute override
      var parsed = JSON.parse(obj.context);
      var modalObj = {};

      for (var e in parsed) {
        if (e === "data") {
          // Slight change in semantics here
          modalObj.context = parsed[e];
        } else {
          modalObj[e] = parsed[e];
        }
      }
      modalData = __validateKeys(modalObj);
    }

    return modalData;

  }

  function __validateKeys(rawObj) {
    // Validate config object
    var validObj = {};

    validObj.context = rawObj.context || {};
      if (rawObj.template) {
        validObj.template = rawObj.template;
      } else if (rawObj.route) {
        // A way of passing template and params together
        // we parse it as a 'url' type path
        // Template name is taken from first URL segment
        // Params parsed and passed through to modal data context
        var route = parseUri(rawObj.route);
        validObj.template = route.path.split('/')[1];
        validObj.context = route.queryKey;
      } else {
        validObj.template = "defaultModalTemplate";
      }

      if (rawObj.param && Object.keys(validObj.context).length === 0) {
        validObj.context.param = rawObj.param;
      }

      if (rawObj.formbtns) {
        // NOTE: We want to see if simple logic inversion works
        validObj.context.formbtns = rawObj.formbtns === "true" ? true : false;
        validObj.modalbtns = !validObj.context.formbtns;
      } else {
        validObj.modalbtns = rawObj.modalbtns === "false" ? false : true;
        validObj.context.formbtns = !validObj.modalbtns;
      }
      // Wierd for AF quickform interaction (true must be "Submit" for default...);
      if (validObj.context.formbtns === true) {
        validObj.context.formbtns = rawObj.btnlabel || "Submit";
      }
      // Set/check defaults Defaults
      validObj.context.modalview = rawObj.modalview === "false" ? false : CONFIG.modalview; // TODO: Complete logic to handle future config changes
      validObj.size = ["sm","md","lg"].indexOf(rawObj.size) !== -1 ? rawObj.size : CONFIG.size;
      validObj.title = rawObj.title || CONFIG.title;
      validObj.btnlabel = rawObj.btnlabel || CONFIG.btnlabel;

    // Convert conventions for namespaced helpers
    validObj.context.MMformbtn = validObj.context.formbtns; delete validObj.context.formbtns;
    validObj.context.MMview = validObj.context.modalview; delete validObj.context.modalview;
    validObj.context.MMparam = validObj.context.param; delete validObj.context.param;

    return validObj;
  } // end validateKeys() {}


	this.options = function (configs, defaults) {
    // Set options
		__configure(configs, defaults);
	}
  this.validateKeys = function (obj) {
    // This is to validate keys passed by the configuration object
    return __checkKeys(obj);
  }
	this.configs = function () {
		// Return the raw config object
		return CONFIG;
	}
  this.trigger = function (options) {
    $("#master-modal").modal({keyboard: true});
    Session.set("MasterModal", options);
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
