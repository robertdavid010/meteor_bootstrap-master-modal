// bs-master-modal.js




if (Meteor.isClient) {

  Template.MasterModal.onCreated(function () {
    var self = this;
    self.init = false;
    self.modalClosed = new ReactiveVar(true);
    self.modalDict = new ReactiveDict();

    var MMconfig = MasterModal.configs();
    var MMtemplates = MMconfig.templates;
    var MMforms = MMconfig.forms;
    var MMkeys = MMconfig.keys

    self.setModalData = function (obj) {
      var sessionData = obj || null;
      var modalData = {context:{}};

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
        // The modal was triggered properly
        // Parse and validate the config object
        modalData = MasterModal.validateKeys(sessionData);
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

        MasterModal.trigger(evtData);

      };

    }

  });

};