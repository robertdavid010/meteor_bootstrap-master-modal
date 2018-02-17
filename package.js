Package.describe({
  name: 'rd010:bootstrap-master-modal',
  version: '0.0.3',
  // Brief, one-line summary of the package.
  summary: 'Dynamic Modals. Use AutoForm, Bootstrap v 3/4, & existing templates for lightboxes, dialogues etc.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/robertdavid010/meteor_bootstrap-master-modal.git',
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
    'blaze-html-templates@1.0.4',
  ], 'client');
  api.use('aldeed:autoform@6.3.0','client',{weak: true});

  api.addFiles('MasterModal.js', 'client');
  api.addFiles('client/bs-master-modal.html', 'client');
  api.addFiles('client/bs-master-modal.js', 'client');

  api.export('MasterModal','client');
});

