Orders = new Meteor.Collection("orders");
Meals = new Meteor.Collection("meals");


function load_order() {
  if(Meteor.status().status === 'connected') {
    // get order for this table or create a new one
    table_id = Session.get("table_id")
    var order = Orders.findOne({table:table_id,status:"progress"});
    if( table_id && order === undefined  ) {
      order_id = Orders.insert({
              status: "progress",
              anger:0,
              table: table_id,
              meals: [],
              ts: (new Date()).getTime()});
      Session.set("order_id", order_id);
    } else {
      Session.set("order_id", order._id);
    }
  }
}

function get_client_type() {
  return Session.get("view_type");
}

////////// TEMPLATES ////////////////
Template.main.is_manager = function() {
   return 'manager' === get_client_type();
};

Template.main.is_table = function() {
   return 'table' === get_client_type();
};

Template.menu.is_waiting = function () {
  return undefined != Orders.findOne({table:Session.get("table_id"),status:"approved"});
}

Template.menu.is_cart_free = function () {
  return undefined != Orders.findOne({table:Session.get("table_id"),status:"approved"});
}

Template.menu.events = {
    'click button.anger': function (e) {
     Orders.update({table:Session.get("table_id")},
                   {$inc:{anger:1}},
                   {multi:true});
      var $btn = $(e.target);
      $btn.attr('disabled','disabled');
      setTimeout(function () {
        $btn.removeAttr('disabled');
      },1000*5)

    }
  };

Template.cart.meals = function() {
  var order = Orders.findOne({_id:Session.get("order_id")});
  if (order) {
    // count duplicates
    var groups = _.groupBy(
              _.map(order.meals,function (id){return Meals.findOne(id)}),
              function (o) {
                return o._id;
              });

    return _.map( _.uniq(order.meals),
                  function (id){
                    var cart_item = Meals.findOne(id)
                    cart_item.count = groups[cart_item._id].length;
                    return cart_item;
                  }
                );
  } else {
    return [];
  }
};

Template.cart.total = function() {
  var order = Orders.findOne({_id:Session.get("order_id")});
  if (order) {
    return _.reduce(
              _.map(order.meals,function (id){return Meals.findOne(id)}),
              function (memo,meal) {
                return memo+meal.price;
              },
              0); 
  } else {
    return null;
  }
};


Template.orders.orders = function() {
   return Orders.find({status:'approved'},{sort: {ts: -1}});
};

Template.meals.meals = function() {
   return Meals.find();
};

Template.meals.events = {
    'click div.meal': function (e) {
      var meal_id = $(e.target).data('id');
      var order_id = Session.get("order_id");
      Orders.update({_id:Session.get("order_id")},
                    {$push:{meals: meal_id}});

      var order = Orders.findOne({_id:Session.get("order_id")},{fields: {meals: 1}});
      Orders.update({_id:Session.get("order_id")},
                   {$set:{meals_count:order.meals.length}});
    }
  };

Template.cart.events = {
    'click button.submit': function () {
     Orders.update({_id:Session.get("order_id")},
                   {$set:{status:"approved"}});

      Session.set("order_id",null);
      load_order();
    }
  };   

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