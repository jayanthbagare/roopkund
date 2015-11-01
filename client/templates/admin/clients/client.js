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
      mimetypes:['image/*','text/*','video/*','application/pdf'],
      //extensions:['*.jpg','*.jpeg','*.png','*.mp4','*.pdf','*.docx','*.xlsx','*.pptx'],
      services:['COMPUTER','WEBCAM','VIDEO','URL'],
      multiple:true/*,
      customCss:'app/client/stylesheets/filepicker.css'*/
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
  },
  //Handle the SMS and messaging feature.
  'click #sms_message': function(event){
    //Call the Modal for SMS here.
    $('#smsModal').modal("show");
  }
});

Template.timeline.events({
  'click .timeline-panel': function(event){
    event.preventDefault();
    var imageURL = this.imageURL;
    console.log(imageURL);
    Session.set("imageModal",imageURL);
    Session.set("mimeType",this.mimeType);
    $("#imageModal").modal("show");
  }
});

Template.smsModal.onRendered(function(){
  var charMax = 160;
  $('#chars_left').html(charMax + ' characters remaining.');
});

Template.smsModal.events({
  'keyup #smsText': function(event){

      var text_length = $('#smsText').val().length;
      var text_remaining = 160 - text_length;
      console.log(text_remaining);
      $('#chars_left').html(text_remaining + ' characters remaining.');
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

//Template for getting the current Image for modal
Template.registerHelper("getImageModal", function(argument){
  var url = Session.get("imageModal");
  var mimeType = Session.get("mimeType");

  //Wire the right html based on the mimetype
  //Later add regex to handle different file types
  
  if(mimeType == "application/pdf"){
    console.log('returning pdf');
    return "<div type='filepicker-preview' data-fp-url='" + url + "' style='width:auto; height:500px;'> </div>";
  }else {
    console.log('returning image');
    return "<img src='" + url + "' class='img-responsive'>";
  }
});


//Template for getting the current Image for modal
Template.registerHelper("getMimeType", function(argument){
  console.log(Session.get("mimeType"));
  return Session.get("mimeType");
});

Template.registerHelper("pdfCheck", function(argument){
  var mimeType = Session.get("mimeType");
  if (mimeType == "application/pdf"){
    return true;
  }
});
