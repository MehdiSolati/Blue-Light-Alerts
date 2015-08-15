if (Meteor.isClient) {

  
Session.setDefault("distance", "mile");

  Template.friendsList.events({
    'click .yard': function() {
     Session.set('distance', 'yard');
    },
     'click .mile': function() {
     Session.set('distance', 'mile');
    },
    'click .calorie': function() {
     Session.set('distance', 'calorie');
    }
  });

 
 
 Template.friendsList.helpers({
    'friendsList': function(template) {
      var friendsCounter = 0;
      var list = [];
      while (friendsCounter < (friendList.findOne({
          userId: Meteor.userId()
        }).friends.length)) {
        friendID = friendList.findOne({
          userId: Meteor.userId()}).friends[friendsCounter];

        lat2 = Markers.findOne({userId : friendID}).positionLat;
        lon2 = Markers.findOne({userId : friendID}).positionLon;
        lat1= Markers.findOne({userId : Meteor.userId()}).positionLat;
        lon1= Markers.findOne({userId : Meteor.userId()}).positionLon;

var R = 6371; // km 
//has a problem with the .toRad() method below.
var x1 = lat2-lat1;
var dLat = x1.toRad();  
var x2 = lon2-lon1;
var dLon = x2.toRad();  
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
Math.sin(dLon/2) * Math.sin(dLon/2);  
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var distance = R * c; 


if(Session.get("distance")==="mile"){
  var miles=distance*0.621371;
  var rounded = Math.round( miles * 10 ) / 10;
  var fixed = rounded.toFixed(2);
  var finaldist=fixed+" miles";
 }
 else if(Session.get("distance")==="yard"){
  var miles=distance*0.621371;
  var yard=miles*1760;
  var rounded = Math.round( yard * 10 ) / 10;
  var fixed = rounded.toFixed(0);
  var finaldist=fixed+" yards";
  }
 else if(Session.get("distance")==="calorie"){
  var miles=distance*0.621371;
  var calorie=miles*85
  var rounded = Math.round( calorie * 10 ) / 10;
  var fixed = rounded.toFixed(0);
  var finaldist=fixed+" calorie";
  }
  list.push({
          name: Meteor.users.findOne({
            _id: friendID
          }).profile.name
        , distance:finaldist});
        friendsCounter++;
      }
      return list;
    }
  });




  Template.friendRequests.helpers({
    'friendRequests': function(template) {
      var friendsCounter = 0;
      var friendRequests = [];
      while (friendsCounter < (requestApproval.findOne({
          userId: Meteor.userId()
        }).requests.length)) {
        friendID = requestApproval.findOne({
          userId: Meteor.userId()
        }).requests[friendsCounter];
        friendRequests.push({
          name: Meteor.users.findOne({
            _id: friendID
          }).profile.name,
          id: friendID
        });
        friendsCounter++;
      }
      return friendRequests;
    }
  });
  Template.friendRequests.events({
    'click .glyphicon-ok': function(e) {
      friendId = e.currentTarget.id;
      myId = Meteor.userId();
      requestCollectionId = requestApproval.findOne({
        userId: Meteor.userId()
      })._id;
      requestApproval.update({
        "_id": requestCollectionId
      }, {
        "$pull": {
          "requests": friendId
        }
      });
      pendingCollectionId = pendingRequests.findOne({
        userId: friendId
      })._id;
      pendingRequests.update({
        "_id": pendingCollectionId
      }, {
        "$pull": {
          "pending": Meteor.userId()
        }
      });
      if (friendList.findOne({
          userId: friendId
        }) === undefined) {
        friendList.insert({
          userId: friendId,
          friends: [myId]
        });
      } else {
        friendList.update({
          _id: friendList.findOne({
            userId: friendId
          })._id
        }, {
          $addToSet: {
            'friends': myId
          }
        });
      }
      if (friendList.findOne({
          userId: myId
        }) === undefined) {
        friendList.insert({
          userId: myId,
          friends: [friendId]
        });
      } else {
        friendList.update({
          _id: friendList.findOne({
            userId: myId
          })._id
        }, {
          $addToSet: {
            'friends': friendId
          }
        });
      }
    }
  });
  Template.friendRequests.events({
    'click .glyphicon-remove': function(e) {
      friendId = e.currentTarget.id;
      requestCollectionId = requestApproval.findOne({
        userId: Meteor.userId()
      })._id;
      requestApproval.update({
        "_id": requestCollectionId
      }, {
        "$pull": {
          "requests": friendId
        }
      });
      pendingCollectionId = pendingRequests.findOne({
        userId: friendId
      })._id;
      pendingRequests.update({
        "_id": pendingCollectionId
      }, {
        "$pull": {
          "pending": Meteor.userId()
        }
      });
    }
  });
  Template.friendsPending.helpers({
    'friendsPending': function(template) {
      var friendsCounter = 0;
      var friendsPending = [];
      while (friendsCounter < (pendingRequests.findOne({
          userId: Meteor.userId()
        }).pending.length)) {
        friendID = pendingRequests.findOne({
          userId: Meteor.userId()
        }).pending[friendsCounter];
        friendsPending.push(Meteor.users.findOne({
          _id: friendID
        }).profile.name);
        friendsCounter++;
      }
      return friendsPending;
    }
  });
  Template.addFriend.events({
    'submit form': function(event, template) {
      // Prevent Page Refresh
      event.preventDefault();
      // Get values from inputs
      var friendsCell = template.find("#friendsCell").value;
      try {
        var friendID = Meteor.users.findOne({
          'profile.number': friendsCell
        })._id;
        var myId = Meteor.userId();
        var friendsCounter = 0;
        var inRequestList = false;
        if (friendID == myId) {
          window.alert("Dude, you can't be friends with yourself!");
        } else {
          if (requestApproval.findOne({
              userId: myId
            }) !== undefined) {
            if (friendsCounter < (requestApproval.findOne({
                userId: myId
              }).requests.length)) {
              id = requestApproval.findOne({
                userId: myId
              }).requests[friendsCounter];
              if (friendID == id) {
                window.alert((Meteor.users.findOne({
                  _id: friendID
                }).profile.name) + " has already asked to be friends with you... Why not accept his/her request?");
                inRequestList = true;
              }
              friendsCounter++;
            }
          }
          if (inRequestList === false) {
            if (pendingRequests.findOne({
                userId: Meteor.userId()
              }) === undefined) {
              pendingRequests.insert({
                userId: myId,
                pending: [friendID]
              });
            } else {
              pendingRequests.update({
                _id: pendingRequests.findOne({
                  userId: Meteor.userId()
                })._id
              }, {
                $addToSet: {
                  'pending': friendID
                }
              });
            }
            if (requestApproval.findOne({
                userId: friendID
              }) === undefined) {
              requestApproval.insert({
                userId: friendID,
                requests: [myId]
              });
            } else {
              requestApproval.update({
                _id: requestApproval.findOne({
                  userId: friendID
                })._id
              }, {
                $addToSet: {
                  'requests': myId
                }
              });
            }
            }
        }
      } catch (err) {
        window.alert("Sorry they aren't members yet!");
      }
    }
  });
}