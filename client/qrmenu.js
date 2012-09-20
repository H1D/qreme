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
    "table/":   "table_redirect", // столик (/table/23)
    "manager":         "manager",  // для манагера (/manager)
    "menu": "menu_edit"  // для манагера
  },

  table_redirect: function() {
    Meteor.subscribe('orders',function(){
      if(Meteor.status().status === 'connected') {
        window.location = Orders.find().count()+1;
      }
    });    
  },

  table: function(table_id) {
    /// load stuff
    // load('iui.css');
    // load('iui.js');


    Session.set("view_type", 'table');
    Session.set("table_id", table_id);
   
    Meteor.flush();     
    Meteor.subscribe('orders',load_order);
  },

  manager: function() {
    // load('kitchen.css');
    // load('bootstrap.css');
    // load('bootstrap.js');
    Session.set("view_type", 'manager');
  },

  menu_edit:function () {
    // load('kitchen.css');
    // load('bootstrap.css');
    // load('bootstrap.js');
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

function load(str) {
  if(str.match(/.css$/i)) {
    $("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
      rel:  "stylesheet",
      type: "text/css",
      href: "str"
    });
  } else {
    $.getScript(str);
  }
}