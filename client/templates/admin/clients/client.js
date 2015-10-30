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
  'click #add_event': function(event){
    Session.set('clientId',this._id);
  },

  'click #attach_doc': function(event){
    var client = this._id;
    filepicker.pickMultiple({
      mimetypes:['image/*','text/*','video/*'],
      services:['COMPUTER','WEBCAM','VIDEO','URL'],
      multiple:true
    },
    function(InkBlob){
      $.each(InkBlob,function(key,value){
          console.log(InkBlob);
          if(value.url){
              ClientImages.insert({
                client:client,
                imageURL: value.url,
                mimeType:value.mimetype
                                  });
                      }});
                  });
  },
  'click #view_timeline': function(event){
    //Set the client session id to be retrieved in timeline.
    Session.set('clientId',this._id);
  }
});

//Handle mimetype
Template.registerHelper("handleMime",function(givenMime){
  console.log('Inside Handle Mime');
  if(givenMime === "image/jpeg"){
    return UI.toHTML("<img src='{{imageURL}}'>");
  }else {
    return UI.toHTML("<img src='{{imageURL}}'>");
  }
});

//Register Helpers for getting the documents.
Template.registerHelper("getClientDocuments",function(argument){
  var client_id = Session.get('clientId');
  return ClientImages.find({
    client:client_id
});

});

//Format the time to the locale here
Template.registerHelper("formatDateTime", function(givenDate){
    return moment(givenDate).format("DD.MM.YYYY-h:mm a");
});
