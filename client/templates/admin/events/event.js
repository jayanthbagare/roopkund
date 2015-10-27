//Events section begins here
//==========================================
//******************************************
Template.add_event.onRendered(function() {
  /*If the call is coming from Client screen then set the options*/
  var client = Session.get('clientId');
  if(client){
    $('select[id="client"]').find('option[value='+ '"' + client + '"' + ']').attr("selected",true);
    delete Session.keys['clientId'];
  }
  ///End Call from client screen
    this.$('.datetimepicker').datetimepicker({
    });

    //change Client to Select here.
    this.$('#client').selectize();
});

Template.edit_event.onRendered(function(){
  this.autorun(function(){
      console.log('Inside edit Event for datepicker.');
       $('#datetimepicker').datetimepicker({
      });
  });

});
Template.list_events.helpers({
  eventsIndex: () => EventsIndex
})
Template.list_events.onRendered(function(event){
  //Set the chosen date to today, if there is no chosen date.
  var chosenDate = $('#chosenDate').text()
  if(!chosenDate)
  {
    this.$('#chosenDate').text(moment().format('DD.MM.YYYY'));
  }

  /*Set the search to beautiful */
    this.$('#txtChosenDate').attr('type', 'hidden');
  /*
    Set the text field to hidden else it will look ugly.
  */
  this.$('#txtChosenDate').attr('type', 'hidden');
  this.$('#spinDate').datetimepicker({
    showClose:true,
    useCurrent: true,
    showTodayButton:true,
    format:"DD.MM.YYYY",
    widgetPositioning:{
      horizontal:"auto",
      vertical:"auto"
    }
  });

  this.$('#spinDate').on("dp.change",function(e){
    /* On change of the date
       make the spinner change the date on the div area and
       fire the eventUI changed event.
    */
    $('#chosenDate').text(e.date.format("DD.MM.YYYY"));
    eventsUI.changed();
  });
  //End of Date Change in Datepicker.
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

            /*Meteor.call('sendSMS',result.phone,body,function(error,result){
              if(!error){
                Events.remove(event._id);
              }
              else{
                throw new Meteor.Error('Could not send SMS, please try in some time again');
              }
            });*/
            Events.remove(event._id); //Remove this when SMS is enabled.
        }
      });
    }
  },
  //Search Event Handler
  'click #search_button': function(event){
    var search_term = $('.search_text').val();
    console.log('Search Button is Clicked ' + $('#search').val());
    EasySearch
       .getComponentInstance({ index: 'events' })
       .search(search_term);
  },
  'click #subtract':function(event){
    /*
      Step 1: Take the chosen date from the spinner
      Step 2: Subtract one day to it.
    */

    var chosenDate = moment($('#chosenDate').text(),"DD.MM.YYYY");
    $('#chosenDate').text(moment(moment(chosenDate).subtract(1,'days')).format('DD.MM.YYYY'));

    /*Call here to get the latest Events based on the date change.
      Step 1: Call the getEvents global helper which is defined
      Step 2: Trigger the eventsUI changed. This is marked as a
              dependency in the getEvents
    */

    Blaze._globalHelpers.getEvents();
    eventsUI.changed();
  },
  'click #add':function(event){
    /*
      Step 1: Take the chosen date from the spinner
      Step 2: Subtract one day to it.
    */
    var chosenDate = moment($('#chosenDate').text(),"DD.MM.YYYY");
    $('#chosenDate').text(moment(moment(chosenDate).add(1,'days')).format('DD.MM.YYYY'));

    /*Call here to get the latest Events based on the date change.
      Step 1: Call the getEvents global helper which is defined
      Step 2: Trigger the eventsUI changed. This is marked as a
              dependency in the getEvents
    */
    Blaze._globalHelpers.getEvents();
    eventsUI.changed();
  },
  //Search Event Handler
  'click #search_button': function(event){
    Blaze._globalHelpers.getEvents();
    eventsUI.changed();
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

          /*Meteor.call('sendSMS',result.phone,body,function(error,result){
            if(error){
              throw new Meteor.Error('Could not send SMS, please try in some time again');
            }
          });*/
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

            /*  Meteor.call('sendSMS',result.phone,body,function(error,result){
                if(error){
                  throw new Meteor.Error('Could not send SMS, please try in some time again');
                }
              });*/
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

var eventsUI = new Tracker.Dependency;

Template.registerHelper("getEvents", function(argument){
  eventsUI.depend();
  var search_term = $('#txtSearchEvents').val();
  if(search_term){
      console.log('Search Term is ' + search_term);
      Meteor.subscribe("name", argument);
  }
  else
  {
    var now = moment($('#chosenDate').text(),"DD.MM.YYYY").toDate();
    var till = moment(now).add(1,'days').toDate();
        var result = Events.find({
          eventDate:{
            $gte:now
          , $lte:till
          }});
  }
    return result;
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
  return moment(givenDate).format("DD.MM.YYYY-h:mm a");
});

//Get the date of today
Template.registerHelper("getToday", function(){
  var today = moment();
  today = moment(today).format("DD.MM.YYYY");
  return today;
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
