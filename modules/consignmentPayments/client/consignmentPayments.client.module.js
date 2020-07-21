(function (app) {
  'use strict';

  app.registerModule('consignmentPayments', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('consignmentPayments.admin', ['core.admin']);
  app.registerModule('consignmentPayments.admin.routes', ['core.admin.routes']);
  app.registerModule('consignmentPayments.services');
  app.registerModule('consignmentPayments.routes', ['ui.router', 'core.routes', 'consignmentPayments.services']);
}(ApplicationConfiguration));
