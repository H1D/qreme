
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
              meals_count: 0,
              ts: (new Date()).getTime()});
      Session.set("order_id", order_id);
    } else {
      Session.set("order_id", order._id);
    }
  }
}

Template.main.is_table = function() {
   return 'table' === get_client_type();
};

Template.toolbar.is_waiting = function () {
  return undefined != Orders.findOne({table:Session.get("table_id"),status:"approved"});
}


//--- categories_list
Template.categories_list.categories = function () {
	var meals = Meals.find({enabled:true}).fetch();
	var cats = _.uniq(_.pluck(meals,'cat'));
	return cats;
};

Template.categories.repeated_user = function () {
  return localStorage.getItem('prev_order');  
};

//--- cart
Template.cart.meals = function() {
  var order = Orders.findOne({_id:Session.get("order_id")});
  
  if (order) {
    // count duplicates
    var groups = _.groupBy(order.meals,
                          function (o) {
                            return o._id;
                          });

    return _.map( groups,
                  function (arr,id){
                    var item = arr[0];
                    item.count = groups[item._id].length;
                    return item;
                  }
                );
  } else {
    return [];
  }

  // if (order) {
  //   // count duplicates
  //   var groups = _.groupBy(
  //             _.map(order.meals,function (id){return Meals.findOne(id)}),
  //             function (o) {
  //               return o._id;
  //             });

  //   return _.map( _.uniq(order.meals),
  //                 function (id){
  //                   var cart_item = Meals.findOne(id)
  //                   cart_item.count = groups[cart_item._id].length;
  //                   return cart_item;
  //                 }
  //               );
  // } else {
  //   return [];
  // }
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

Template.cart.is_cart_not_empty = function () {
	try{
		return Orders.findOne({_id:Session.get("order_id")}).meals_count > 0;		
	} 
	catch(err) {
		return false;
	}
};

//--- meals
Template.meals_list.meals = function() {
   return Meals.find({cat:Session.get('menu-category'),enabled:true});
};

Template.toolbar.order_count = function () {
  try{
    return '['+Orders.findOne({_id:Session.get("order_id")}).meals_count +']';    
  } 
  catch(err) {
    return '';
  }
}

///////////// EVENTS ////////////////
Template.meals.events = {
    'click .meal': function (e) {
      var meal_id = $(e.target).data('id');
      var meal = Meals.findOne(meal_id)
      var order_id = Session.get("order_id");
      Orders.update({_id:Session.get("order_id")},
                    {$push:{meals: meal},$inc:{meals_count:1}});
      e.preventDefault();
      return false;
    }
  };

Template.cart.events = {
    'click .submit': function () {
     Orders.update({_id:Session.get("order_id")},
                   {$set:{status:"approved",anger:0}},
                   function () {
                      localStorage.setObject('prev_order',
                      _.pluck(Orders.findOne(Session.get("order_id")).meals,'_id'));
                   });
   }
  };   

Template.toolbar.events = {
    'click .anger': function (e) {
     Orders.update({table:Session.get("table_id"),status:"approved"},
                   {$inc:{anger:1}},
                   {multi:true});
    }
  };

Template.categories.events = {
   'click .usual': function() {
      var meals = localStorage.getObject('prev_order');
      meals = Meals.find({_id:{$in:_.uniq(meals)}});
      var order_id = Orders.insert({
                status: "progress",
                anger:0,
                table: table_id,
                meals: [],
                meals_count: 0,
                ts: (new Date()).getTime()});

      // Uncaught TypeError: Converting circular structure to JSON 
      meals.forEach(function (meal) {
          Orders.update({_id:order_id},
                    {$push:{meals: meal},$inc:{meals_count:1}});
      });

      Session.set("order_id", order_id);      
    }
}


Template.categories_list.events = {
	'click .menu-category':function (e) {				
		Session.set('menu-category',$(e.target).data('id'));
	}
};