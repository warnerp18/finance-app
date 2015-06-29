Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function(){
      if (Session.get("hideCompleted")) {
        //If hide completed is check, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        //Otherwise, return all of the taks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      console.log(event.target);
      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date(), // current time
        owner: Meteor.userId(),
        username: Meteor.user().username
      });

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },
    "change .hide-completed input": function(event){
      Session.set("hideCompleted", event.target.checked);

    }
  });
  Template.task.events({
    "click .toggle-checked": function() {
      //Set the checked property to the opposite of its current value
     console.log(this, this._id);
      Tasks.update(this._id, {$set: {checked: !this.checked}});
    },
    "click .delete": function(){
      Tasks.remove(this._id);
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
