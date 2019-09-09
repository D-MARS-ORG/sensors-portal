# DMARS Application

Under the directory 'javascripts' is all the code that runs the application.

Files:
    site.js:        Is the combination of all files under that directory.
    Cloud.js:       The code that handles the requests to Device Wise cloud.
    App.js:         Code that triggers the app to run. (like the main() function)
    CloudApp.js:    Code that handles the initialization of the application.

    In CloudApp.js and mqtt_handler.js you need to modify the correcy key and email and password for login to device wise.

    ** Do not modify the following:    bootstrap.js, bootstrap.map.js, jquery.js, jquery.datatimepicker.full.js, mqtt.min.js

    Order to include files:
        1.  jquery
        2.  jquery.datetimepicker.full
        3.  bootstrap
        4.  bootstrap.js.map
        5.  mqtt.min
        6.  mqtt_handler
        7.  mqtt_message_processor
        8.  Cloud
        9.  CloudApp
        10. App