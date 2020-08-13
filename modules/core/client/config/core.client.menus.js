(function() {
  "use strict";

  angular.module("core").run(menuConfig);

  menuConfig.$inject = ["menuService"];

  function menuConfig(menuService) {
    menuService.addMenu("account", {
      roles: ["admin", "user"]
    });

    menuService.addMenuItem("account", {
      title: "",
      state: "settings",
      type: "dropdown",
      roles: ["admin", "user"]
    });

    menuService.addSubMenuItem("account", "settings", {
      title: "Edit Profile",
      state: "settings.profile"
    });

    menuService.addSubMenuItem("account", "settings", {
      title: "Edit Profile Picture",
      state: "settings.picture"
    });

    menuService.addSubMenuItem("account", "settings", {
      title: "Change Password",
      state: "settings.password"
    });

    // menuService.addSubMenuItem('account', 'settings', {
    //   title: 'Manage Social Accounts',
    //   state: 'settings.accounts'
    // });
  }
})();
