Template.main.is_menu_edit = function() {
   return 'menu_edit' === get_client_type();
};

Template.meals_edit.meals = function () {
  return Meals.find({},{sort: {enabled: -1}});
};

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