if(Meteor.isServer)
{
  Meteor.methods({
    sendSMS: function(toNumber,eventDate){
              //Run Twilio here
               twilio = Twilio('AC15886b52bdb53ae37c3f2237955bb0d3', '78f868c47e97c113e05c4fe5ede64b4f');
               body = 'Your appointment on ' + eventDate + ' has been cancelled by Rashmi DentaCare';
               console.log('Number is ' + toNumber);
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

}
