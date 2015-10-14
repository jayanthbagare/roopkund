//Client Definition
Clients = new Mongo.Collection('clients');
Clients.attachSchema(new SimpleSchema({
  name: {
    type: String,
    max: 100,
    optional:false,
    index:1
  },
  email:{
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional:true,
    unique: true
  },
  phone: {
    type:String,
    max: 100,
    optional:false,
    unique:true,
    index:1
  },
  userId: {
    type: String,
    autoValue: function(){ return Meteor.userId() }
  },
  updatedAt: {
    type: Date,
    autoValue: function(){ return new Date() }
  }

},{transform:true}));

//Events Collection
Events = new Mongo.Collection('events');
Events.attachSchema(new SimpleSchema({
  name: {
    type: String,
    max: 100
  },
  eventDate: {
    type:Date,
    max: 500
  },
  description: {
    type: String,
    max: 500,
    optional : true
  },
  client : {
    type: String,
    max: 100
  },
  type: {
    type: String,
    max : 100,
    optional: true
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

//Events Collection
Events2 = new Mongo.Collection('events2');
Events2.attachSchema(new SimpleSchema({
  name: {
    type: String,
    max: 100
  },
  startDate: {
    type:String,
    max: 500
  },
  endDate:{
    type:String,
    max: 500
  },
  description: {
    type: String,
    max: 500,
    optional : true
  },
  client : {
    type: String,
    max: 100
  },
  type: {
    type: String,
    max : 100,
    optional: true
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


//Enable Search Pattern here
Clients.initEasySearch(['name','email','phone'],{
  'limit':20
});

Events.initEasySearch(['client','type','name'],{
  'limit':10
});
