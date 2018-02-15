Package.describe({
  name: 'rd010:bootstrap-master-modal',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Dynamically generate modals for bootstrap & Meteor',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5.2.2');
  api.use([
    'ecmascript',
    'jquery',
    'session',
    'templating',
  ], 'client');
  api.use('aldeed:autoform','client',{weak: true});

  api.addFiles('MasterModal.js', 'client');
  api.addFiles('client/bs-master-modal.html', 'client');
  api.addFiles('client/bs-master-modal.js', 'client');

  api.export('MasterModal','client');
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('rd010:bs-master-modal');
//   api.mainModule('bs-master-modal-tests.js');
// });

Npm.depends({
  "bootstrap": "4.0.0"
});
