(function(){
  var polymer_ext;
  polymer_ext = require('libs_frontend/polymer_utils').polymer_ext;
  polymer_ext({
    is: 'pill-button-group',
    properties: {
      buttons: {
        type: Array,
        value: []
      },
      selected_idx: {
        type: Number,
        value: 0
      }
    },
    compute_class: function(index, selected_idx, buttons){
      var output;
      output = ['paperpillbutton'];
      if (index === 0) {
        output.push('paperpillbuttonfirst');
      } else if (index === buttons.length - 1) {
        output.push('paperpillbuttonlast');
      } else {
        output.push('paperpillbuttonmiddle');
      }
      if (index === selected_idx) {
        output.push('paperpillbuttonselected');
      }
      return output.join(' ');
    },
    buttonclicked: function(evt){
      var buttonidx;
      buttonidx = parseInt(evt.target.buttonidx);
      this.selected_idx = buttonidx;
      return this.fire('pill-button-selected', {
        buttonidx: buttonidx
      });
    }
  });
}).call(this);
