Meteor.startup(function() {
  process.env.MAIL_URL = 'smtp://betadogsa100@gmail.com:BETAd0gs@smtp.gmail.com:465/';
});
Meteor.methods({
  'sendEmail': function(to, text) {
    check([to, text], [String]);
    this.unblock();
    Email.send({
      to: to,
      subject: "Blue Light Texts:",
      text: text
    });
  }
});