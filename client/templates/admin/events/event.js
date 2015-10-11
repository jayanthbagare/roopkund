//Events section begins here
//==========================================
//******************************************
Template.add_event.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({

    });

    //change the Select here.
    this.$('#client').selectize();
});

Template.edit_event.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});

Template.list_events.events({
  //Delete the Event
  'click .delete_event': function(event){
    if(confirm('Are you sure to cancel this Appointment'))
    {
      var event = this;
      Meteor.call('mgetClient',this.client,function(error,result){
        if(!error){
            console.log('Event date is ' + event.eventDate)
            Meteor.call('sendSMS',result.phone,event.eventDate,function(error,result){
              if(!error){
                Events.remove(event._id);
              }
              else{
                throw new Meteor.Error('Could not send SMS, please try in some time again');
              }
            });

        }
      });
    }
  }
});

Template.add_event.events({
  'submit .add_event_form': function(event){
    FS.Debug = true;
    var name = event.target.name.value;
    var description = event.target.description.value;
    var client = event.target.client.value;
    var type = event.target.type.value;
    var eventDate = event.target.eventDate.value;
    //Insert Event
      Events.insert({
        name: name,
        description: description,
        type: type,
        client: client,
        eventDate: eventDate
      });
    FlashMessages.sendSuccess('Appointment Added');
    Router.go('/admin/events');

    return false;
  },


});
//Event Section ends here.
//====================================================
//****************************************************

//Helper Section begins here
//====================================================
//****************************************************
Template.registerHelper("getEvents", function(argument){
  return Events.find();
});

Template.registerHelper("getClient", function(){
  var clientName =  Clients.findOne({"_id":this.client});
  return clientName;
});

Template.registerHelper("getClients", function(argument){
  return Clients.find();
});

//Format the time to the locale here
Template.registerHelper("formatDateTime", function(givenDate){
  return moment(givenDate).format("MM.DD.YYYY hh:mm:ss a");
});


//Helper Section ends here.
//====================================================
//****************************************************

//Generic methods starts here
//====================================================
//****************************************************


//Generic methods ends here
//====================================================
//****************************************************
