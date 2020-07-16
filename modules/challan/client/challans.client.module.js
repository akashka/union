(function (app) {
  'use strict';

  app.registerModule('challans', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('challans.admin', ['core.admin']);
  app.registerModule('challans.admin.routes', ['core.admin.routes']);
  app.registerModule('challans.services');
  app.registerModule('challans.routes', ['ui.router', 'core.routes', 'challans.services']);
}(ApplicationConfiguration));
