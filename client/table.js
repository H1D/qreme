
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

Template.footer.is_waiting = function () {
  return undefined != Orders.findOne({table:Session.get("table_id"),status:"approved"});
}


//--- categories_list
Template.categories_list.categories = function () {
	var meals = Meals.find({enabled:true}).fetch();
	var cats = _.uniq(_.pluck(meals,'cat'));
	return cats;
};

Template.categories_list.rendered = function () {
	update_page( 'cat_page' );
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

Template.cart.rendered = function () {
	update_page( 'cart_page' );
};


Template.cart.sugg_meals = function () {
  // var meals = Meals.find({price:{$lt:1}}).fetch().slice(-3);
  // if (meals.length === 3) {
  //   return _.map(_.zip(['a','b','c'], meals),
  //               function ( arr ) {
  //                 if (arr[1]) {
  //                   arr[1].symb = arr[0];
  //                 }
                  
  //                 return  arr[1]
  //               });
  // } else {
    return[]
  // }
  
}

//--- meals
Template.meals_list.meals = function() {
   return Meals.find({cat:Session.get('menu-category'),enabled:true});
};

Template.meals_list.rendered = function () {
	update_page( 'meals' );
};

Template.meals.rendered = function () {
	update_page( 'meals' );
};

//--- footer
Template.footer.rendered = function () {
	update_page( 'cat_page' );
};

Template.footer.order_count = function () {
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
      var meal_id = $(e.target).find('input').val();
      var meal = Meals.findOne(meal_id)
      var order_id = Session.get("order_id");
      Orders.update({_id:Session.get("order_id")},
                    {$push:{meals: meal},$inc:{meals_count:1}});
    }
  };

Template.cart.events = {
    'click .submit': function () {
     Orders.update({_id:Session.get("order_id")},
                   {$set:{status:"approved",anger:0}});

     Session.set("order_id",null);

     localStorage.setObject('prev_order',
      _.pluck(Orders.findOne(Session.get("order_id")).meals,'_id'));
   }
  };   

Template.footer.events = {
    'click .anger': function (e) {
     Orders.update({table:Session.get("table_id"),status:"approved"},
                   {$inc:{anger:1}},
                   {multi:true});
      var $btn = $(e.target);
      $btn.addClass('ui-disabled');
      setTimeout(function () {
        $btn.removeClass('ui-disabled');
      },200*5)

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
		
		to_page('meals');
		Session.set('menu-category',$(e.target).find('input').val());
	}
};

Template.cart_sugg_item.events = {
  'click': function (e) {
     //  var meal_id = $(e.target).data('id');
     //  var meal = Meals.findOne(meal_id)
     //  var order_id = Session.get("order_id");
     //  Orders.update({_id:Session.get("order_id")},
     //                {$push:{meals: meal},$inc:{meals_count:1}});
     // setTimeout(function () {Meteor.flush();to_page('cart_page')},200)
      
    }
}


//////////////////////////////////////////////////////////
to_page = function (id) {
	$.mobile.changePage( '#'+id ,{changeHash:false,transition:'none'});
	update_page(id);
}

update_page = function (id) {
	if ($('#'+id).is('.ui-page-active')) {
		$('#'+id).trigger('pagecreate');
	} else {
		setTimeout(function () {
		if ($('#'+id).is('.ui-page-active')) {
	 		$('#'+id).trigger('pagecreate');
	 	}
	 },300
 	);
	}	
}