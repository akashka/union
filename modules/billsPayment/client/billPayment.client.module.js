(function (app) {
  'use strict';

  app.registerModule('billPayments', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('billPayments.admin', ['core.admin']);
  app.registerModule('billPayments.admin.routes', ['core.admin.routes']);
  app.registerModule('billPayments.services');
  app.registerModule('billPayments.routes', ['ui.router', 'core.routes', 'billPayments.services']);
}(ApplicationConfiguration));
