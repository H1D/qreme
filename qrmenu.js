var Router = Backbone.Router.extend({
  routes: {
    "/table/:table_id":   "table", // столик (/table/#table_num)
    "/manager":         "manager"  // для манагера (/manager)
  },

  table: function(table_num) {
    alert(1);
  },

  manager: function() {
    alert(2);
  }
});

if (Meteor.is_client) {
  var app = new Router;
  Backbone.history.start({pushState: true});

  Template.hello.greeting = function () {
    return "Welcome to qrmenu.";
  };

  Template.hello.events = {
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    
  });
}