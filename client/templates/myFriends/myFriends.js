if (Meteor.isClient) {



Session.setDefault("Sosmode", "Soslvl0");
Session.setDefault("distance", "mile");


Template.friendsList.events({
  'click #poke':function(){
    var email = "9174768299@tmomail.net";

    var message = (this.name + " pokes you from "+this.distance+" aways");
    var sosmsg = (this.name + 
     " is in trouble, location at : https://www.google.com/maps/dir/41.052953,-73.53986/41.0529534,-73.5398648");
    
    if (Session.get("Sosmode")==="Soslvl1"){
        Meteor.call('sendEmail', email, sosmsg);
          window.alert('SOS Text is Sent, Help Is On The Way');
       
   
    }else if(Session.get("Sosmode")==="Soslvl2"){

      var message="Lets take some code";

       Meteor.call('sendEmail', email, message);
        window.alert('trouble');

     }

    else
    {
   
    Meteor.call('sendEmail', email, message);
    window.alert('poked');
   
  }
  }
});



var i=1;

allowDrop=   function (ev) {
    ev.preventDefault();
}
drag=function (ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

dropdanger=function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
   document.getElementById("warning").innerHTML = "WARNING: You are in SOS-Mode. Drag Bluelight Icon back to Exit";
    Session.set("Sosmode", "Soslvl1"); 
   $('.fa-share').addClass('fa-reply');
   $('.fa-share').removeClass('fa-share');
}

dropsafe=function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    document.getElementById("warning").innerHTML = "Enter Password to Exit SosMode"
    document.getElementById("sospass").style.display="block";
    document.getElementById("sostext").focus();
    document.getElementById("dangerzone").removeAttribute("ondrop");
}



Template.friendsList.events({
  'click #sosexit':function(){
    var danger="sos"
    var password="blue"
    var attempt=document.getElementById("sostext").value;
    document.getElementById("sostext").value="";
    
    if(attempt==password){
      if (confirm('Are you sure you are safe and want to exit SOS-mode?')) {
      document.getElementById("warning").innerHTML = "Exited SOS-mode"
      document.getElementById("sospass").style.display="none";
      document.getElementById("dangerzone").setAttribute('ondrop','dropdanger(event)');
      i=1;
      }
    }   

    else if(attempt==danger){
      if (confirm('Are you sure you are safe and wants to exit out of SOS-mode?')) {
      Session.set("Sosmode", "Soslvl2"); 
      document.getElementById("warning").innerHTML = "Exited SOS-mode"
      document.getElementById("sospass").style.display="none";
      document.getElementById("dangerzone").setAttribute('ondrop','dropdanger(event)');
      i=1;
      } 
    }
    
    else{
        document.getElementById("warning").innerHTML = "Invalid Password, Attempt ("+i+")";
        i++;
        if(i==6){
        document.getElementById("warning").innerHTML = "Maximum Attempt Exceeded, Dockin in SOSModes For 10mins"
        document.getElementById("sospass").style.display="none";

        setTimeout(function(){   
        document.getElementById("sospass").style.display="block";
        document.getElementById("warning").innerHTML = "Enter Password to Exit SosMode"
        }, 
        600000);
        }
      }
    }
  });

  Template.friendsList.events({
  'keyup #sostext':function(e){ 
    if(e.type=="keyup" && e.which ==13){
    var danger="sos"
    var password="blue"
    var attempt=document.getElementById("sostext").value;
    document.getElementById("sostext").value="";
    
    if(attempt==password){
      if (confirm('Are you sure you are safe and want to exit SOS-mode?')) {
      document.getElementById("warning").innerHTML = "Exited SOS-mode"
      document.getElementById("sospass").style.display="none";
      document.getElementById("dangerzone").setAttribute('ondrop','dropdanger(event)');

     
      i=1;
       }
    }   

    else if(attempt==danger){
      if (confirm('Are you sure you are safe and wants to exit out of SOS-mode?')) {
      Session.set("Sosmode", "Soslvl2"); 
      document.getElementById("warning").innerHTML = "Exited SOS-mode"
      document.getElementById("sospass").style.display="none";
      document.getElementById("dangerzone").setAttribute('ondrop','dropdanger(event)');
      i=1;
      } 
    }
    
    else{
        document.getElementById("warning").innerHTML = "Invalid Password, Attempt ("+i+")";
        i++;
        if(i==6){
        document.getElementById("warning").innerHTML = "Maximum Attempt Exceeded, Dockin in SOSModes For 10mins"
        document.getElementById("sospass").style.display="none";

        setTimeout(function(){   
        document.getElementById("sospass").style.display="block";
        document.getElementById("warning").innerHTML = "Enter Password to Exit SosMode"
        }, 
        600000);
        }
      }
     }
    }
  });



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
        
        var distance=haversine(lat1,lon1,lat2,lon2);

if(Session.get("distance")==="mile"){
  var miles=distance*0.621371;
  var fixed = miles.toFixed(2);
  var finaldist=fixed+" miles";
 }
 else if(Session.get("distance")==="yard"){
  var miles=distance*0.621371;
  var yard=miles*1760;
  var fixed = yard.toFixed(0);
  var finaldist=fixed+" yards";
  }
 else if(Session.get("distance")==="calorie"){
  var miles=distance*0.621371;
  var calorie=miles*80;
  var fixed = calorie.toFixed(0);
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
                // Meteor.users.findOne({ emails: { $elemMatch: { address: friendsEmail } } }).profile.name
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

