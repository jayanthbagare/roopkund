if(Meteor.isServer)
{
  Meteor.methods({
    sendSMS: function(toNumber){
              //Run Twilio here
               console.log('Before instantiation of Twilio');
               twilio = Twilio('AC8f3065529e4aea4b7a4acee592f2aaf7', '10ec18b89e3ea8d14101d8fe468b3b3c');
               console.log('After instantiation of Twilio');
               twilio.sendSms({
                          to:toNumber, // Any number Twilio can deliver to
                          from: '+15005550007', // A number you bought from Twilio and can use for outbound communication
                          body: 'Your appointment (on 10th October) has been cancelled by Rashmi DentaCare' // body of the SMS message
                        }, function(err, responseData) { //this function is executed when a response is received from Twilio
                          if (!err) {
                            console.log(err);
                              return true;
                          }
                          else {
                            {
                              console.log(err);
                              return false;
                            }
                          }
                      });
                    }
              });

}
