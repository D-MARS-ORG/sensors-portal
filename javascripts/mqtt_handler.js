var username = "[dewice-wise-email-login]";
var password = "[device wise password]";
var clientId = "HUSQVARNA_LAWN_MOWERS" + Math.floor(Math.random() * 1000000);

var connect = function() {

	var host = "api.devicewise.com";
	var port = 443;
	var ssl = port != 80 && port != 8080;

	client = new Paho.MQTT.Client(host, port, '/mqtt' + (ssl ? '-ssl' : ''), clientId);
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;

	client.connect({
		userName : username,
		password : password,
		useSSL : ssl,
		mqttVersion : 3,
		onSuccess : onConnect,
		onFailure : onFailure
	});


	function onConnect() {
		/*
			Because we use one thing for our application,
			if you need to make things differently the thing
			key to subscribe should be dynamic.
		*/
		client.subscribe("thing/357178070539450/property/+");
		console.log("connected!");

	}


	function onFailure(responseObject) {
	  console.log('Failed to connect: ' + responseObject.errorMessage);
	}

	function onConnectionLost(responseObject) {
		/*
			Handle what happens when the connection is lost. 
		*/
		console.log('Connection lost: ' + responseObject.errorMessage);
	}

	function onMessageArrived(message) {

    var mp = new MessageProcessor(message);
    mp.parse();
		// console.log(message);
	}
}
;
