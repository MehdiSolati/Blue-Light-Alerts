ServiceConfiguration.configurations.remove({
    $or: [{
      service: "facebook"
    }, {
      service: "google"
    }]
  });


//Hosted
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '1053262084707364',
    secret: '9af36f025a516889b128f3a1634c3e10'
});
 
ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: '946464497-f98fshu4sm5kb0qtqs4tn6fobo6r82vp.apps.googleusercontent.com',
    loginStyle: "popup",
    secret: 'yY4WChiqfkKVh2f3l3BM4JB9'
});

// // Local
// ServiceConfiguration.configurations.insert({
//     service: 'facebook',
//     appId: '1057024450997794',
//     secret: '6457964020ff15ff7796fe1089ab7146'
// });
 
// ServiceConfiguration.configurations.insert({
//     service: 'google',
//     clientId: '946464497-ceqd17jfs15m9oi2f6o7nbu29oq2lu4q.apps.googleusercontent.com',
//     loginStyle: "popup",
//     secret: '_5OeBM8W-ivsIWXRLkZ1BFZs'
// });



if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user) {
        var id = user._id;
        var facebook, google, twitter;
        try {
            facebook = user.services.facebook.id;
        } catch (e) {
        }
        try {
            google = user.services.google.id;
        } catch (e) {
        }
        try {
            twitter = user.services.twitter.id;
        } catch (e) {
        }
        if (facebook == 717119361754388 || google == 116854972102822141733 || twitter == 14345604) {
            user.roles = ['admin'];
            Houston._admins.insert({
            'user_id': id
        })
        } else {
            user.roles = ['user'];
        }
        if (options.profile) {
            user.profile = options.profile;
        }
        return user;
    });
}