(function(app) {
    'use strict';

    app.registerModule('onAccountPayments', ['core']); // The core module is required for special route handling; see /core/client/config/core.client.routes
    app.registerModule('onAccountPayments.admin', ['core.admin']);
    app.registerModule('onAccountPayments.admin.routes', ['core.admin.routes']);
    app.registerModule('onAccountPayments.services');
    app.registerModule('onAccountPayments.routes', ['ui.router', 'core.routes', 'onAccountPayments.services']);
}(ApplicationConfiguration));