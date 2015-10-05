Meteor.startup(function(){
  if(Meteor.users.find().count() === 0 )
  {
    Accounts.createUser({
      username: "rashmi",
      mail: "admin@admin.com",
      password: "initial1"
    });
  }
});
