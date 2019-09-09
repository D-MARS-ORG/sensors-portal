var url = "https://api.devicewise.com/api";

var CLOUD = CLOUD || {

};

CLOUD.Requests = CLOUD.Requests || {

}

CLOUD.Authentication = CLOUD.Authentication || {
  auth: function(email, password, url) {

    var makeJson = function(email, password) {
      var json=JSON.stringify({
        auth: {
          command:"api.authenticate",
          params:{username: email,password: password}
        }
      });
      return json;
    }

    if ((email == "") || (password == "") || (email == undefined) || (password == undefined)) { console.warn("Please provide email and password"); return; }

    var password = password;
    var email = email;
    var url = url;
    var data_2 = makeJson(email,password);


    return $.ajax({
      type:"POST",
      url: url,
      data: data_2,
      dataType:"json"
    }).done(function( data ) {
      if (data.success == false){
        return;
      } else {
        sessionId=data.auth.params.sessionId;
        localStorage.setItem("sessionId", sessionId);
        return data;
      }
    });
  },


  auth_and_run: function(email,password,url, capp) {

    /*
     *	.auth_and_run will authenticate you to the
     *	cloud and then it will start your app. It
     *	will make sure that the authentication will
     *	take place, and after successfully login it
     *	will run your app.
     *
     *	It expects your application will accept a
     *	call to the .run method.
     *
     *	Usage:
     *
     *	CLOUD.Authentication.auth_and_run(email,password, url, MyApp);
     *
     *		1. Will authenticate you to the cloud using .auth(email,password,url)
     *			2. will execute MyApp.run
     *
     */

    if ((capp == "") || (capp == undefined)) { console.warn("Please Provide an Application to run."); return; }

    var loginPromise = this.auth(email,password,url);
    loginPromise.then(function() {
      CloudApp.run();
    });
  },


  sessionId: function() {

    return localStorage.getItem("sessionId");
  }
}

CLOUD.alarm = {
  publish: function(thingKey, alarmKey, state, message, callback){
    CLOUD.request().command("alarm.publish",
        {
          thingKey: thingKey,
          key: alarmKey,
          state: state,
          msg: message
        }).auth().send(callback);
  }
}

CLOUD.property = {

  history_last: function(hours, property, callb) {

    if ((hours == null) || (hours == "") || (hours == 0) || (hours == "0")) { console.warn("No hours given"); return; }
    if ((property == null) || (property == "")) { console.warn("No property given"); return; }


    var hours_to_get = hours;

    var buildJSON = function() {
      var result = JSON.stringify({history: { command : "property.history",params: {thingKey: current_thing.key , key: property, last: hours_to_get + "h"}}, auth: {sessionId: CLOUD.Authentication.sessionId()} })
      return result;
    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: buildJSON(),
      dataType:"json",
      success: function(data) {
        callb(data, property);
      }
    });
  },

  history_records: function(rec, property, callb) {

    if ((rec == null) || (rec == "") || (rec == 0) || (rec == "0")) { console.warn("No hours given"); return; }
    if ((property == null) || (property == "")) { console.warn("No property given"); return; }


    var buildJSON = function() {
      var result = JSON.stringify({history: { command : "property.history",params: {thingKey: current_thing.key , key: property, records: rec}}, auth: {sessionId: CLOUD.Authentication.sessionId()} })
      return result;
    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: buildJSON(),
      dataType:"json",
      success: function(data) {
        callb(data, property);
      }
    });
  },

  publish: function(thingKey, propKey, value, callback){
    var makeJson = function(thingKey, propKey, value){
      return JSON.stringify({
        publish: {
          command: "property.publish",
          params: {
            thingKey: thingKey,
            key: propKey,
            value: value
          }
        },
        auth: {
          sessionId: CLOUD.Authentication.sessionId()
        }
      });
    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: makeJson(thingKey, propKey, value),
      dataType:"json",
      success: function(data) {
        if(data.publish.success){
          callback.call();
        }else {
          console.warn("property.publish error: (" + thingKey + ") " + data.publish.errorMessages);
        }
      }
    });

  },



}


CLOUD.thing = CLOUD.thing || {

  /*
   *	Namespace: thing
   *
   *	Used to interact with the cloud things.
   *
   */


  list: function(thingsArray, callback) {

    /*
     *	.list will return a list of all the things
     *	in the cloud and then call your callback
     *	function if you specify one.
     *
     *	Usage: 	CLOUD.thing.list(myCloudThingsArray, myCallbackFunction);
     *
     *			1. Will retrieve all the things in the cloud and
     *			   push them into the myCloudThingsArray. Note that
     *			   the array must be defined somewhere public in order
     *			   for this function to be able to access it.
     *
     *			2. Will .call() on your callback function as soon as it
     *			   finishes populating the things from the cloud.
     */


    var makeJson =  function(limit, tags) {
      return JSON.stringify({
        list: {
          command: "thing.list",
          params: { limit: limit, tags: tags }
        },
        auth:{
          "sessionId": CLOUD.Authentication.sessionId()
        }
      });
    }

    if (thingsArray.constructor != Array) { console.warn("CLOUD.thing.list: accepts an 'Array' to populate the of things and a 'Callback' function to call when done."); return; }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: makeJson(1000) ,
      dataType:"json",
      success: function(data) {
        for(var i in data.list.params.result){
          var thing = data.list.params.result[i];
          thingsArray.push(thing);
        }
        callback.call();
      }
    });
  },

  search: function(query, callback){
    var makeJson = function(query){
      return JSON.stringify({
        search: {
          command: "thing.search",
          params: {
            query: query,
            limit: 1000,
            offset: 0
          }
        },
        auth : {
          sessionId:CLOUD.Authentication.sessionId()
        }
      });

    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: makeJson(query),
      dataType:"json",
      success: function(data) {
        if(data.search.success){
          callback(data.search.params.result);
        }
      }
    });

    return;
  },

  create: function(defKey, key, name, attrs, callback){
    var makeJson = function(defKey, key, name, attrs){
      return JSON.stringify({
        create: {
          command: "thing.create",
          params: {
            defKey: defKey,
            key: key,
            name: name,
            attrs: attrs
          }
        },
        auth: {
          sessionId: CLOUD.Authentication.sessionId()
        }
      });
    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: makeJson(defKey, key, name, attrs),
      dataType:"json",
      success: function(data) {
        if(data.create.success){
          callback.call();
        }else {
          console.warn("thing.create error: (" + key + ") " +
              data.create.errorMessages);
        }
      }
    });

    return;
  },

  delete: function(thingKey, callback){
    var makeJson = function(thingKey){
      return JSON.stringify({
        delete: {
          command: "thing.delete",
          params: {
            key: thingKey
          }
        },
        auth: {
          sessionId: CLOUD.Authentication.sessionId()
        }
      });
    }

    $.ajax({
      async: true,
      type:"POST",
      url: url,
      data: makeJson(thingKey),
      dataType:"json",
      success: function(data) {
        if(data.delete.success){
          callback.call();
        }else {
          console.warn("thing.delete error: (" + thingKey + ") " +
              data.delete.errorMessages);
        }
      }
    });

    return;
  },

  attr: {
    set: function(thingKey, attrKey, value, callback){
      var makeJson = function(thingKey, attrKey, value){
        return JSON.stringify(
            {
              set: {
                command: "thing.attr.set",
                params: {
                  thingKey: thingKey,
                  key: attrKey,
                  value: value
                }
              },
              auth:{
                "sessionId":CLOUD.Authentication.sessionId()
              }
            });
      }

      $.ajax({
        type:"POST",
        url: url,
        data: makeJson(thingKey, attrKey, value),
        dataType:"json"
      }).done(function(data) {
        if (data.set.success) {
          callback.call();
        }else{
          console.log("thing.attr.set error: (" + thingKey + ") " +
              data.set.errorMessages);
        }
      });
    },

    get: function(thingKey, attrKey, callback){
      var makeJson = function(attrKey, thingKey){
        return JSON.stringify({
          get: {
            command: "thing.attr.get",
            params: {
              thingKey: thingKey,
              key: attrKey
            }
          },
          auth: {
            sessionId: CLOUD.Authentication.sessionId()
          }
        });
      }

      $.ajax({
        type: "POST",
        url: url,
        data: makeJson(attrKey, thingKey),
        dataType: "json",
        success: function(data){
          if(data.get.success){
            callback(data.get);
          }

        }
      });
    }

  }

}
;
