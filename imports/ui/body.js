import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session'
import { Tasks } from '../api/tasks.js';
import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.disabled2 = new ReactiveVar(false);
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks(){
    const instance = Template.instance();

    if(instance.state.get('hideCompleted')){
      return Tasks.find({checked: {$ne: true}}, { sort: { createAt: -1} });
    }

    return Tasks.find({}, { sort: { createAt: -1} });
  },

  incompleteCount(){
    return Tasks.find({checked: {$ne: true}}).count();
  },

  disabled() {
    return Session.get('showRegister');
  },

  disabled2(){
    return Template.instance().disabled2.get()
  }


});

Template.body.events({
  'submit .new-task'(event, instance) {
    event.preventDefault()

    const target = event.target;
    const text = target.text.value;
    if(text){
      Meteor.call('tasks.insert', text);
    } else {
      // Session.set('showRegister', true);
      instance.disabled2.set(true)
      if( instance.disabled2.get()){
        Meteor.setTimeout(()=>{
          // Session.set('showRegister', false);
          instance.disabled2.set(false)
        }, 2000)
      }
    }
    target.text.value ='';
  },

  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked)
  }
}); 