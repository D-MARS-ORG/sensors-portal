$( document ).ready(function() {

    jQuery('.datetimepicker').datetimepicker();

    connect(); // MQTT


    var url = "https://api.devicewise.com/api";
    var orgKeyLawn = "HUSQVARNA_LAWN_MOWERS";
    var email = "telithusqvarna2@gmail.com";
    var password = "Telit@husq2";


    CLOUD.Authentication.auth_and_run(email, password, url, orgKeyLawn, CloudApp);

});
