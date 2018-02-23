(function(){
  Polymer({
    is: 'prompt-time-spent',
    clicked: function(){
      return console.log('hello-world-example clicked');
    },
    buttonclicked: function(){
      return console.log('hello-world-example paper-button clicked');
    },
    ready: function(){
      return console.log('hello-world-example ready');
    }
  });
}).call(this);
