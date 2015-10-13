//Events section begins here
//==========================================
//******************************************
Template.add_event.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({

    });

    //change Client to Select here.
    this.$('#client').selectize();
});

Template.edit_event.onRendered(function(event) {
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
            body = 'Your appointment on ' + moment(event.eventDate).format('DD.MM.YYYY h:mm a') + ' has been cancelled by Rashmi DentaCare';

            Meteor.call('sendSMS',result.phone,body,function(error,result){
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
    //Send an SMS for confirmation
    var event = this;
    Meteor.call('mgetClient',client,function(error,result){
      if(!error){
          body = 'Your appointment has been fixed on ' + moment(eventDate).format("DD.MM.YYYY h:mm a") + ' by Rashmi DentaCare';

          Meteor.call('sendSMS',result.phone,body,function(error,result){
            if(error){
              throw new Meteor.Error('Could not send SMS, please try in some time again');
            }
          });
      }
    });
    FlashMessages.sendSuccess('Appointment Added');
    Router.go('/admin/events');

    return false;
  },


});

//Edit Handling for Events
Template.edit_event.events({
  'submit .edit_event_form': function(event){

    var name = event.target.name.value;
    var description = event.target.description.value;
    var client = event.target.client.value;
    var type = event.target.type.value;
    var eventDate = event.target.eventDate.value;

    oldEventData = Events.findOne({'_id':this._id},{eventDate:1});

    //Upsert Event
      Events.update(this._id,{$set:{
        name: name,
        description: description,
        type: type,
        //client: client,
        eventDate: eventDate
      }},true);

    //Send an SMS if the old and new appointment dates are different.
    if(oldEventData.eventDate != eventDate){
        var event = this;
        Meteor.call('mgetClient',oldEventData.client,function(error,result){
          if(!error){
              body = 'Your appointment from ' + moment(oldEventData.eventDate).format('DD.MM.YYYY h:mm a') + ' has been changed to ' + moment(eventDate).format('DD.MM.YYYY h:mm a') + ' by Rashmi DentaCare';

              Meteor.call('sendSMS',result.phone,body,function(error,result){
                if(error){
                  throw new Meteor.Error('Could not send SMS, please try in some time again');
                }
              });
          }
        });
      }
    FlashMessages.sendSuccess('Appointment Edited');
    Router.go('/admin/events');

    return false;
  }
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
  return moment(givenDate).format("DD.MM. YYYY-h:mm a");
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
