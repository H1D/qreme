// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (Meals.find().count() === 0) {

  	var meals = [
      {name: 'Ham sandwich',
       cat: 'Sandwiches',
       enabled:true,
       price: 2,
       ingridients: ['ham', 'bread', 'lettuce', 'sauce'],
       description:'Nourishing ham sandwich will keep your hunger at bay',
       img: '/ham_sandwich.jpg'
      },
      {name: 'Chicken sandwich',
       cat: 'Sandwiches',
       enabled:true,
       price: 2,
       ingridients: ['chicken', 'bread', 'lettuce', 'ketchup'],
       description:'Nourishing chicken sandwich will keep your hunger at bay',
       img: '/chicken_sandwich.jpg'
      },
      {name: 'Cheese sandwich',
       cat: 'Sandwiches',
       enabled:true,
       price: 1.5,
       ingridients: ['cheese', 'bread', 'tomato', 'mayonnaise'],
       description:'Nourishing cheese sandwich will keep your hunger at bay',
       img: '/cheese_sandwich.jpg'
      },
      {name: 'Stolichniy salad',
       cat: 'Salads',
       enabled:true,
       price: 2,
       ingridients: ['sausage', 'mayonnaise', 'egg', 'potato', 'sour cream', 'dill', 'pea'],
       description:'Traditional salad is always a good starter',
       img: '/stolichniy_salad.jpg'
      },
      {name: 'Beetroot salad',
       cat: 'Salads',
       enabled:true,
       price: 1.5,
       ingridients: ['beetroot', 'potato', 'cabbage', 'carrot', 'mayonnaise'],
       description:'Simple salad with a character',
       img: '/beetroot_salad.jpg'
      },
      {name: 'Fresh vegetable salad',
       cat: 'Salads',
       enabled:true,
       price: 1,
       ingridients: ['cabbage', 'onion', 'carrot', 'olive oil'],
       description:'Refresh yourself on a busy day',
       img: '/fresh_vegetable_salad.jpg'
      },
      {name: "Beef meatball",
       cat: 'Main courses',
       enabled:true,
       price: 1.5,
       ingridients: ['beef', 'bread', 'onion', 'milk', 'flour'],
       description:'A hearty helping that can be main attraction in a plate',
       img: '/meatball.jpg'
      },
      {name: "Roast chicken with stewed cabbage",
       cat: 'Main courses',
       enabled:true,
       price: 2.5,
       ingridients: ['chicken', 'cabbage', 'onion', 'dill'],
       description:'A balanced meal your inner vegan and the meat eater will enjoy',
       img: '/roast_with_stewed_cabbage.jpg'
      },
      {name: "Grilled fish steak",
       cat: 'Main courses',
       enabled:true,
       price: 2.5,
       ingridients: ['salmon', 'lemon juice', 'garlic', 'olive oil', 'pepper'],
       description:'Enjoy delicate taste of this fresh fish',
       img: '/grilled_fish_steak.jpg'
      },
      {name: "Roast pork",
       cat: 'Main courses',
       enabled:true,
       price: 2,
       ingridients: ['pork', 'potato', 'garlic', 'dill', 'pepper'],
       description:'Substantial meal for the really hungry',
       img: '/roast_pork.jpg'
      },
      {name: "Buckwheat",
       cat: 'Side dishes',
       enabled:true,
       price:0.5,
       ingridients: ['buckwheat', 'butter'],
       description:'A universal addition to meat and fish',
       img: '/buckwheat.jpg'
      },
      {name: "Macaroni",
       cat: 'Side dishes',
       enabled:true,
       price:0.5,
       ingridients: ['macaroni', 'butter'],
       description:'The cosmopolitain everyday dish',
       img: '/macaroni.jpg'
      },
      {name: "Rice",
       cat: 'Side dishes',
       enabled:true,
       price:0.5,
       ingridients: ['rice','butter'],
       description:'The cosmopolitain everyday dish',
       img: '/rice.jpg'
      },
      {name: "Black tea",
       cat: 'Drinks',
       enabled:true,
       price: 0.5,
       ingridients: ['tea'],
       description:'Strong black tea to warm up your day',
       img: '/black_tea.jpg'
      },
      {name: "Green tea",
       cat: 'Drinks',
       enabled:true,
       price:0.5,
       ingridients: ['tea'],
       description:'Delicate green tea to warm up your day',
       img: '/green_tea.jpg'
      },
      {name: "Coffee",
       cat: 'Drinks',
       enabled:true,
       price: 0.75,
       ingridients: ['coffee', 'cream'],
       description:'Refresh yourself with a taste of coffee cup',
       img: '/coffee.jpg'
      }];


  	for (var i = meals.length - 1; i >= 0; i--) {
  		Meals.insert(meals[i]);
  	};
  }

  if (Orders.find().count() === 0) {
    var orders = [
      {status: "approved",
       anger:0,
       table: 24,
       meals: [Meals.findOne()],
       meals_count:1,
       ts: ((new Date()).getTime() - Math.random(10000))
      },
      {status: "approved",
       table: 22,
       anger:0,
       meals_count:1,
       meals: [Meals.findOne()],
       ts: ((new Date()).getTime() - Math.random(10000))
      }
    ];

    for (var i = orders.length - 1; i >= 0; i--) {
      	Orders.insert(orders[i]);
 	  }
  }
});
