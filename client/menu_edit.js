Template.main.is_menu_edit = function() {
   return 'menu_edit' === get_client_type();
};

Template.meals_edit.meals = function () {
  return Meals.find();
};

Template.meal_edit.events = {
    'click button.block': function (e) {
      	var id = $(e.target).data('id');
     	Meals.update(id,
                   {$set:{enabled:false}});
    },
    'click button.enable': function (e) {
      	var id = $(e.target).data('id');
     	Meals.update(id,
                   {$set:{enabled:true}});
    }
  };