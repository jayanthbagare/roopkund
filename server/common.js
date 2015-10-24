if(Meteor.isServer)
{
  Meteor.methods({
    sendSMS: function(toNumber,body){
              //Run Twilio here
               twilio = Twilio('AC15886b52bdb53ae37c3f2237955bb0d3', '78f868c47e97c113e05c4fe5ede64b4f');
               twilio.sendSms({
                          to:toNumber, // Any number Twilio can deliver to
                          from: '+14696052859', // A number you bought from Twilio and can use for outbound communication
                          body: body // body of the SMS message
                        }, function(err, responseData) { //this function is executed when a response is received from Twilio
                          if (!err) {
                            return true;
                          }
                          else {
                            {
                              console.log(err);
                              return false;
                            }
                          }
                      });
                    },
    mgetClient:function(client_id){
       var client = Clients.findOne({"_id":client_id});
       return client;
    }

});
//Ensure Index is there.
Events._ensureIndex({
  "name":"text",
  "type":"text"
});

//Publish the global methods
Meteor.publish("searchEvents",function(searchTerm){
  if(!searchTerm){
    getEventsbyDate();
  }
});

Meteor.publish("getEventsbyDate",function(chosenDate){
  if(chosenDate){
    var now = moment(chosenDate,"DD.MM.YYYY").toDate();
    var till = moment(now).add(1,'days').toDate();
        var result = Events.find({
          eventDate:{
            $gte:now
          , $lte:till
          }});
  }
});

}
