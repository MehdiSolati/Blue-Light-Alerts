Template.navbar.events({
  'click #logout': function(event) {
    Meteor.logout(function(err) {
      if (err)
        throw new Meteor.Error("Logout failed");
    });
  },
  
    'click #myMapNav': function(event) {
      Session.set("myMap", true);
      Session.set("myPath", false);
      Session.set("myFriends", false);
  },
  
    'click #myPathNav': function(event) {
      Session.set("myMap", true);
      Session.set("myPath", true);
      Session.set("myFriends", false);
  },
  
    'click #myFriendsNav': function(event) {
      Session.set("myMap", false);
      Session.set("myPath", false);
      Session.set("myFriends", true);
  }
});