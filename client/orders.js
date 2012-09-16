Template.main.is_manager = function() {
   return 'manager' === get_client_type();
};

Template.orders.orders = function() {
   return Orders.find({status:'approved'},{sort: {ts: -1}});
};