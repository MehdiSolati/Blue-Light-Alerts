App.info({
  id: 'com.bluelightalerts.bluelightalerts',
  name: 'Blue Light Alerts',
  description: 'Keeping Campuses Safe',
  author: 'Blue Light Tech',
  email: 'michael@bluelightalerts.com',
  website: 'http://blawebapp.meteor.com'
});

App.icons({
  'android_xhdpi': 'public/img/icon.png'
});

App.launchScreens({
});

App.setPreference('BackgroundColor', '0x01579b');
App.setPreference('HideKeyboardFormAccessoryBar', true);

App.accessRule('*');