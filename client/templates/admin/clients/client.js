AutoForm.addHooks(['add_client_form','edit_client_form'],{
  onSuccess: function(operation,result,template){
    FlashMessages.sendSuccess('Client Saved Successfully');
    Router.go('/admin/clients');
  },
  onError: function(operation,result,template){
    FlashMessages.sendError('Could not save ' + result);
  }
});

Template.edit_client.helpers({
  selectedClient: function(){
    return Clients.findOne({"_id":this._id});
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

  },

  //Search Event Handler
  'click #search_button': function(event){
    var search_term = $('.search_text').val();
    // EasySearch
    //    .getComponentInstance({ index: 'clients' })
    //    .search(search_term);
  },
  'click #add_event': function(event){
    Session.set('clientId',this._id);
  },

  'click #attach_doc': function(event){
    var client = this._id;
    filepicker.pick({
      mimetypes:['image/gif','image/jpeg','image/png'],
      multiple:true
    },
    function(InkBlob){
      if(InkBlob.url){
          ClientImages.insert({
            client:client,
            imageURL: InkBlob.url
          });
      }

    }
  );
}

});
