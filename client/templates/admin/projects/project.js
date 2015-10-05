Template.add_project.onRendered(function() {
    this.$('.datetimepicker').datetimepicker({

    });
});

Template.edit_project.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});

Template.add_project.events({
  'submit .add_project_form': function(event){
    FS.Debug = true;
    var name = event.target.name.value;
    var description = event.target.description.value;
    var client = event.target.client.value;
    var type = event.target.type.value;
    var eventDate = event.target.eventDate.value;

    var file = $('#projectImage').get(0).files[0];

    if(file){
      fsFile = new FS.File(file);
      EventImages.insert(fsFile,function(err,result){
        if(!err){
          //var eventImage = '/cfs/files/EventImages/' + result._id;
          eventImage = result._id;
          
          //Insert Event
          Events.insert({
            name: name,
            description: description,
            type: type,
            client: client,
            eventImage: eventImage,
            eventDate: eventDate
          });
        }
      });
    }else {
          //Insert Event
          Events.insert({
            name: name,
            description: description,
            type: type,
            client: client,
            eventDate: eventDate
          });
    }
    FlashMessages.sendSuccess('Event Added');
    Router.go('/admin/projects');

    return false;
  },


});

Template.list_projects.helpers({
	events: function(){
		return Events.find();
	}
});

Template.list_projects.events({
  //Delete the Event
  'click .delete_project': function(event){
    if(confirm('Are you sure to delete this'))
    {
        Events.remove(this._id);
    }

  }
});
