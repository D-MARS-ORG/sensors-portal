var cloudThings = [];
var current_thing;
var CloudApp = CloudApp || {};
var KEY = "357178070539450";
CloudApp.run = function() {
  CLOUD.thing.list(cloudThings, CloudApp.init);
}


CloudApp.init = function() {
  for (var i = 0; i < cloudThings.length; i++) {
    var thing = cloudThings[i];
    if (thing != null) {
      if (thing.key == KEY) {
        current_thing = thing;
      }
    }
  }

  if (current_thing != null) {
    // In here show some things

    $('#last_seen').html(current_thing.lastSeen.split(".")[0].replace("T", "&nbsp;").substring(0, current_thing.lastSeen.split(".")[0].replace("T", "&nbsp;").length - 3) + "&nbsp;UTC");

    $('#imei').html(current_thing.imei);
    $('#battlevel').html(Math.ceil(current_thing.properties.battlevel.value / 1000));
    $('#light_value').html(current_thing.properties.light_value.value);
    $('#sound_value').html(current_thing.properties.sound_value.value);
    $('#uv_value').html(current_thing.properties.uv_value.value);

    if (current_thing.properties.earthquake_value == 0) {
      $('#earthquake_value').html('No Quakes');
    } else {
      $('#earthquake_value').html('MarsQuakes');
    }

    $('#amonium').html(current_thing.properties.amonium.value);
    $('#methanol').html(current_thing.properties.methanol.value);
    $('#acetone').html(current_thing.properties.acetone.value);
    $('#co').html(current_thing.properties.co.value);
    $('#co2').html(current_thing.properties.co2.value);



    if (current_thing.connected) {
      $('#connected').html('Online');
      $('#connected').removeClass('off');
      $('#connected').addClass('on');
    } else {
      $('#connected').html('Offline');
      $('#connected').removeClass('on');
      $('#connected').addClass('off');
    }

    $('#battlevelalarm').html(CloudApp.convertAlarmToText("battlevelalarm", current_thing.alarms.battlevelalarm.state));
    $('#light_sensor').html(CloudApp.convertAlarmToText("light_sensor", current_thing.alarms.light_sensor.state));

    $('#sound_sensor').html(CloudApp.convertAlarmToText("sound_sensor", current_thing.alarms.sound_sensor.state));
    $('#uv_sensor').html(CloudApp.convertAlarmToText("uv_sensor", current_thing.alarms.uv_sensor.state));
    $('#accel_sensor').html(CloudApp.convertAlarmToText("accel_sensor", current_thing.alarms.accel.state));

  }
}

CloudApp.convertAlarmToText = function(alarm, state) {
  if ((alarm == null) || (alarm == undefined) || (alarm == "")) { return state; }

  switch (alarm) {
    case "battlevelalarm":
      if (state == 0) {
        return 'Good';
      } else if (state == 1) {
        return 'Low'
      } else if (state == 2) {
        return 'Critical'
      } else if (state == 3) {
        return 'Charging';
      }
      break;
    case "light_sensor":
      if (state == 0) {
        return 'Very Dark Ambient Light';
      } else if (state == 1) {
        return 'Dark Ambient Light';
      } else if (state == 2) {
        return 'Bright Ambient Light';
      } else if (state == 3) {
        return 'Very Bright Ambient Light';
      }
      break;
    case "accel_sensor":
      if (state == 0) {
        return 'No Quakes';
      } else if (state == 1) {
        return 'Weak Quake';
      } else if (state == 2) {
        return 'Strong Quakes';
      } else if (state == 3) {
        return 'Very Strong Quakes';
      }
      break;

    case "sound_sensor":
      if (state == 0) {
        return 'No Noise';
      } else if (state == 1) {
        return 'Low Noise';
      } else if (state == 2) {
        return 'Loud Noise';
      } else if (state == 3) {
        return 'Very Loud Noise';
      }
      break;
    case "uv_sensor":
        if (state == 0) {
          return 'Low UV Radiation';
        } else if (state == 1) {
          return 'Moderate UV Radiation';
        } else if (state == 2) {
          return 'High UV Radiation';
        } else if (state == 3) {
          return 'Very High UV Radiation';
        } else if (state == 4) {
          return 'Extreme UV Radiation';
        }
    default:
      return state;
  }
}

var polling = setInterval(function(){
  console.log('Polling...');
  CLOUD.thing.list(cloudThings, CloudApp.init);
}, 6000);
