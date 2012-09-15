Orders = new Meteor.Collection("orders");

// Publish complete set of orders to all clients.
Meteor.publish('orders', function () {
  return Orders.find();
});

Meals = new Meteor.Collection("meals");
//Publish all items for requested list_id.
Meteor.publish('meals', function () {
  return Meals.find();
});