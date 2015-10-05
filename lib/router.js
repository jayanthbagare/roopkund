Router.configure({
  layoutTemplate:"layout"
});

Router.map(function(){
  this.route('home',{
    path:"/",
    template:"home"
  });
  this.route('projects',{
    path:'/projects',
    template:'work'
  });
  this.route('contact',{
    path:'/contact',
    template:'contact'
  });
  this.route('about',{
    path:'/about',
    template:'about'
  });
  this.route('blog',{
    path:'blog',
    template:'blog'
  });

  this.route('list_posts',{
    path:'/admin/posts',
    template:'list_posts'
  });
  this.route('add_post',{
    path:'/admin/posts/add',
    template:'add_post'
  });
  this.route('edit_post',{
    path:'/admin/posts/:_id/edit',
    template:'edit_post'
  });

  this.route('list_projects',{
    path:'/admin/projects',
    template:'list_projects',
    data:function(){
      templateData={
        events: function(){
          return Events.find();
        }
      }
    }
  });
  this.route('add_project',{
    path:'/admin/projects/add',
    template:'add_project'
  });
  this.route('edit_project',{
    path:'/admin/projects/:_id/edit',
    template:'edit_project',
    data: function(){
      return Events.findOne(this.params._id);
    }
  });

  this.route('login',{
    path:'/admin',
    template:'login'
  });

});
