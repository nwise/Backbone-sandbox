//jQuery when DOM loads run this
$(function(){

  //Backbone Model

  window.Person = Backbone.Model.extend({
    url: function() {
      return this.id ? '/people/' + this.id : '/people'; //Ternary, look it up if you aren't sure
    },

    defaults: { person: {
      name: "None entered",
      age: 0
    }},

    initialize: function(){
      //Can be used to initialize Model attributes
    }
  });

  //Collection

  window.PersonCollection = Backbone.Collection.extend({
    model: Person,
    url: '/people'
  });

  window.People = new PersonCollection;

  //View

  window.PersonView = Backbone.View.extend({
    tagName: "tr",

    events: {
      //Can be used for handling events on the template 
    },

    initialize: function(){
      //this.render();
    },

    render: function(){
      var person = this.model.toJSON();
      //Template stuff goes here
      $(this.el).html(ich.person_template(person));
      return this;
    }
  });

  //Application View

  window.AppView = Backbone.View.extend({

    el: $("#people_app"),

    events: {
      "submit form#new_person": "createPerson"
    },

    initialize: function(){
      _.bindAll(this, 'addOne', 'addAll');

      People.bind('add', this.addOne);
      People.bind('refresh', this.addAll);
      People.bind('all', this.render);

      People.fetch(); //This Gets the Model from the Server
    },

    addOne: function(person) {
      var view = new PersonView({model: person});
      this.$("#person_table").append(view.render().el);
    },

    addAll: function(){
      People.each(this.addOne);
    },

    newAttributes: function(event) {
      var new_person_form = $(event.currentTarget).serializeObject();
      //alert (JSON.stringify(new_dog_form));
      return { dog: {
          name: new_person_form["person[name]"],
          age: new_person_form["person[description]"]
        }}
    },

    createPerson: function(e) {
      e.preventDefault(); //This prevents the form from submitting normally

      var params = this.newAttributes(e);

      People.create(params);

      //TODO - Clear the form fields after submitting
    }

  });

  //START THE BACKBONE APP
  window.App = new AppView;

});

