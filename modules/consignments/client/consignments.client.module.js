(function (app) {
  'use strict';

  app.registerModule('consignments', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('consignments.admin', ['core.admin']);
  app.registerModule('consignments.admin.routes', ['core.admin.routes']);
  app.registerModule('consignments.services');
  app.registerModule('consignments.routes', ['ui.router', 'core.routes', 'consignments.services']);
}(ApplicationConfiguration));
