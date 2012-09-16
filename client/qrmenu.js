Orders = new Meteor.Collection("orders");
Meals = new Meteor.Collection("meals");

window.location.hash='';


function get_client_type() {
  return Session.get("view_type");
}

///////////// ROUTING ////////////////
var Router = Backbone.Router.extend({
  routes: {
    "table/:table_id":   "table", // столик (/table/23)
    "manager":         "manager",  // для манагера (/manager)
    "menu": "menu_edit"  // для манагера
  },

  table: function(table_id) {
    Session.set("view_type", 'table');
    Session.set("table_id", table_id);
    Meteor.flush();
    Meteor.subscribe('orders',load_order);
  },

  manager: function() {
    Session.set("view_type", 'manager');
  },

  menu_edit:function () {
    Session.set("view_type", 'menu_edit');
  }
});
var router = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

///////////// UPDATES ////////////////
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

///////////// SHIT ////////////////
function get_meal_name (uid) {
  return  Meals.findOne(uid).name
}