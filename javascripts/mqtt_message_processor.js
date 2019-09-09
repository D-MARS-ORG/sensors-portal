var MessageProcessor = MessageProcessor || function(data){
  this.message = data;
}

MessageProcessor.prototype.parse = function() {

  var dest = this.message.destinationName.split("/");
  var destination = dest[dest.length - 1];
  var box = $('#' + destination);

  console.log('why this is triggered??');

  if (box.length > 0) {
    box.html(MessageProcessor.convertor(destination ,this.message.payloadString));
    $('#connected').html('Online');
    $('#connected').removeClass('off');
    $('#connected').addClass('on');
  } else {
    console.log(destination + " does not exist in the DOM");
  }

}


MessageProcessor.convertor = function(destination, value) {
  switch (destination) {
    case "battlevel":
      return Math.ceil(value / 1000);
      break;
    case "earthquake_value":
        if (value == 0) {
          return 'No Quakes'
        } else {
          return 'Quakes NOW'
        }
        break;
    default:
      return value;
  }
}
;
