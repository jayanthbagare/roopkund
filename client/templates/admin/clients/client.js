Template.add_client.events({
  'submit .add_client_form': function(event){
    FS.Debug = true;
    var name = event.target.name.value;
    var email = event.target.email.value;
    var phone = event.target.phone.value;

          //Insert Event
          Clients.insert({
            name: name,
            email: email,
            phone:phone,
          });
    FlashMessages.sendSuccess('Client Added');
    Router.go('/admin/clients');

    return false;
  }
});

Template.edit_client.events({
  'submit .edit_client_form': function(event){
    var name = event.target.name.value;
    var email = event.target.email.value;
    var phone = event.target.phone.value;

          //Upsert Client
          Clients.update(this._id,{$set:{
            name: name,
            email: email,
            phone:phone
          }},true);
    FlashMessages.sendSuccess('Client Changes Saved');
    Router.go('/admin/clients');

    return false;
  }
});

Template.list_clients.helpers({
	clients: function(){
		return Clients.find();
	}
});

Template.list_clients.events({
  //Delete the Event
  'click .delete_client': function(event){
    if(confirm('Are you sure to delete this'))
    {
        Clients.remove(this._id);
    }

  }
});
