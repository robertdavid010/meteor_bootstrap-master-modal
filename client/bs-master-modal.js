// bs-master-modal.js


parseUri = function (str) {
	// PARSER for using url style arguments
	// parseUri 1.2.2
	// (c) Steven Levithan <stevenlevithan.com>
	// MIT License
	function parser (s) {
		var	o   = this.options,
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
};


if (Meteor.isClient) {

  Template.MasterModal.onCreated(function () {
    var self = this;
    self.init = false;
    self.modalClosed = new ReactiveVar(true);
    self.modalDict = new ReactiveDict();

    var MMconfig = MasterModal.configs();
    console.log(MMconfig);
    var MMtemplates = MMconfig.templates;
    var MMforms = MMconfig.forms;
    var MMkeys = MMconfig.keys

    self.setModalData = function (obj) {
      var sessionData = obj || null;
      var modalData = {context:{}};
      // NOTE: We are using modalData.context to contain data for the target
      // template. This is a semantical difference from the 'context' field in sessionData
      // Simply put: sessionData.context.data = modalData.context

      function validateKeys(rawObj) {
        // Logic for context already done...
        var validObj = {};
        validObj.context = rawObj.context || {};
          if (rawObj.template) {
            validObj.template = rawObj.template;
          } else if (rawObj.route) {
            // A way of passing template and params together
            // we parse it as a 'url' type path
            // Template name is taken from first URL segment
            // Params parsed and passed through to modal data context
            var route = parseUri(sessionData.route);
            validObj.template = route.path.split('/')[1];
            validObj.context = route.queryKey;
          } else {
            validObj.template = "defaultModalTemplate";
          }

          if (rawObj.param && Object.keys(validObj.context).length === 0) {
            validObj.context.param = rawObj.param;
          }

          if (rawObj.formbtns) {
            validObj.context.formbtns = rawObj.formbtns === "true" ? true : false;
            validObj.modalbtns = !validObj.formbtns;
          } else {
            validObj.modalbtns = rawObj.modalbtns === "false" ? false : true;
            validObj.context.formbtns = !validObj.modalbtns;
          }

          validObj.size = ["sm","md","lg"].indexOf(rawObj.size) !== -1 ? rawObj.size : MMconfig.size;
          validObj.title = rawObj.title || MMconfig.title;
          validObj.btnlabel = rawObj.btnlabel || MMconfig.btnlabel;

        return validObj;
      } // end validateKeys() {}

      if (!sessionData || self.modalClosed.get()) {
        // Set/reset empty modal defaults
        Session.set("MasterModal",null);
        // TODO: Confirm if we have to reset autoforms here?
        modalData = {
        	size: MMconfig.size,
        	title: MMconfig.title,
        	template: "defaultModalTemplate"
        }

      } else {
      	// ********************
        // The modal was triggered properly
      	if (!sessionData.context) {
          modalData = validateKeys(sessionData);

      	} else {
          // "context" data attribute override
          var parsed = JSON.parse(sessionData.context);
          var modalObj = {};

          for (var e in parsed) {
            if (e === "data") {
              // Slight chance in semantics here
              modalObj.context = parsed[e];
            } else {
              modalObj[e] = parsed[e];
            }
          }
          modalData = validateKeys(modalObj);
      	}

      }

      for (var e in modalData) {
        // Filter for allowed keys while looping to set dicts for extra check
        if (MMkeys.indexOf(e) !== -1) {
          if (e === "template") {
            //SECURITY: Check for allowed templates
            if (MMtemplates.indexOf(modalData[e]) !== -1 ) { 
              self.modalDict.set(e, modalData[e]);
            } else {
              self.modalDict.set(e, MMconfig.template);
            }
          } else {
            self.modalDict.set(e, modalData[e]);
          }
        }
      }
    }

    self.initialize = function () {
    	if (!self.init) {
    		// initialize
    		self.init = true;
    	}
    }

    self.autorun(function () {
    	if (!self.init) {
    		self.initialize();
    	}

      if (Session.get("MasterModal")) {
        self.setModalData(Session.get("MasterModal"));
      }
    });

  });

  Template.MasterModal.onRendered(function () {
    var self = this;
    $('#master-modal').on('show.bs.modal', function () {
      self.modalClosed.set(false);
    });
    $('#master-modal').on('hidden.bs.modal', function () {
      self.modalClosed.set(true);
    });
  });

  Template.MasterModal.helpers({
    bsV4: function () {
    	var ver = parseInt($.fn.modal.Constructor.VERSION.charAt(0), 10);
    	return ver === 4;
    },
    size: function () {
      return Template.instance().modalDict.get("size");
    },
    title: function () {
      return Template.instance().modalDict.get("title");
    },
    template: function () {
      return Template.instance().modalDict.get("template");
    },
    modalbtns: function () {
      return Template.instance().modalDict.get("modalbtns");
    },
    btnlabel: function () {
      return Template.instance().modalDict.get("btnlabel");
    },
    modalData: function () {
      return Template.instance().modalDict.get("context");
    }
  });

  Template.MasterModal.events({
    "click #modalFormSubmit" : function (event, templ) {
      event.preventDefault();
      var formId = event.currentTarget.dataset && event.currentTarget.dataset.submit;
      $("#" + formId).submit();
    }
  });

  // Global events to trigger modal from anywhere
  // Note: Requires gwendall:body-events package if using Flow-Router
  Template.body.events({

    // Global non-conflicting listener for MasterModal trigger
    "click [data-toggle='master-modal']" : function (event, templ) {
      event.preventDefault();
      event.stopPropagation();
      // Check the trigger event to make sure and eliminate
      // extra or unwanted triggers through event bubbling in unusual element nesting.
      var eTag = event.target.tagName;
      if (eTag != "A" && eTag != "BUTTON" || event.target === event.currentTarget) {
        var evt = event.currentTarget;
        var keys = MasterModal.configs().keys;
        var evtData = {};

        for (var key in evt.dataset) {
        	if (keys.indexOf(key) !== -1) {
        		evtData[key] = evt.dataset[key];
        	}
        }

        // Experimenting with getting local caller template helper
	      if (this["$blaze_range"]) {
          // Note: Templates with no methods get no '$blaze_range',
		      evtData.callerTemplate = this["$blaze_range"].view.name.split('.').pop();
        }

        $("#master-modal").modal({keyboard: true});
        Session.set("MasterModal", evtData);

      };

    }

  });

};