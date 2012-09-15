// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Meals.find().count() === 0) {

  	var meals = [
      {name: "tea",
       cat: 'beverage'
      },
      {name: "coffee",
       cat: 'beverage'
      },
      {name: "cookie",
       cat: 'dessert'
      },
    ];

  	for (var i = meals.length - 1; i >= 0; i--) {
  		Meals.insert(meals[i]);
  	};
  }

  if (Orders.find().count() === 0) {
    var meals_ids = _.pluck(Meals.find(),'_id');
    var orders = [
      {status: "approved",
       table: 24,
       meals: meals_ids.slice(1),
       meals_count:2,
       ts: ((new Date()).getTime() - Math.random(10000))
      },
      {status: "approved",
       table: 22,
       meals_count:3,
       meals: meals_ids,
       ts: ((new Date()).getTime() - Math.random(10000))
      }
    ];

    for (var i = orders.length - 1; i >= 0; i--) {
      	Orders.insert(orders[i]);
 	  }
  }
});
