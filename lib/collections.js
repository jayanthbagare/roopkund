Events = new Mongo.Collection('events');

Events.attachSchema(new SimpleSchema({
  name: {
    type: String,
    max: 100
  },
  eventDate: {
    type:String,
    max: 500
  },
  description: {
    type: String,
    max: 500
  },
  client : {
    type: String,
    max: 100
  },
  type: {
    type: String,
    max : 100
  },
  userId: {
    type: String,
    autoValue: function(){ return Meteor.userId() }
  },
  updatedAt: {
    type: Date,
    autoValue: function(){ return new Date() }
  },
  eventImages: {
    type: String,
    optional: true
  }
}));


EventImages = new FS.Collection('EventImages',{
  stores: [new FS.Store.GridFS('EventImages')]
});
