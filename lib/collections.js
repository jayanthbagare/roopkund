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
  }
}));

//Image Attachment for Clients.
ClientImages = new Mongo.Collection('cimages');
ClientImages.attachSchema(new SimpleSchema({
  client:{
    type:String
  },
  imageURL:{
    type:String
  },
  mimeType:{
    type:String
  },
  userId: {
    type: String,
    autoValue: function(){ return Meteor.userId() }
  },
  updatedAt: {
    type: Date,
    autoValue: function(){ return new Date() }
  }
}));
