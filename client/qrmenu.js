Orders = new Meteor.Collection("orders");
Meals = new Meteor.Collection("meals");

// we need all this stuff
Meteor.autosubscribe(function () {
  if(Meteor.status().status === 'connected') {
    // get order for this table or create a new one
    table_id = Session.get("table_id")
    var order = Orders.findOne({table:table_id,status:"progress"});
    if( table_id && order === undefined  ) {
      order_id = Orders.insert({
              status: "progress",
              table: table_id,
              meals: [],
              ts: (new Date()).getTime()});
      Session.set("order_id", order_id);
    } else {
      Session.set("order_id", order._id);
    }
  }
});

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
    'click button': function () {
     Orders.update({_id:Session.get("order_id")},
                   {$set:{status:"approved"}});

      Session.set("order_id",null);
    }
  };
      

///////////// ROUTING ////////////////
var Router = Backbone.Router.extend({
  routes: {
    "table/:table_id":   "table", // столик (/table/23)
    "manager":         "manager"  // для манагера (/manager)
  },

  table: function(table_id) {
    Session.set("view_type", 'table');
    Session.set("table_id", table_id);
  },

  manager: function() {
     Session.set("view_type", 'manager');
  }
});
var router = new Router;
Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});
