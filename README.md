# Wetterstation Client

This code provides the frontend for displaying the measurments of a private weather station in Rhauderfehn/Germany. It is realized with HTML, CSS, Javascript and jQuery. Furthermore for getting and actualizing the data and graphics a websocket connection to a node.js server is established. Changed data are pushed from that server every time they are changing.

This code is structured for phonegap use. With phonegap created apps for Android, Windows Phone and iOS can be found in the appropiate stores by searching for "Wetterstation Rhauderfehn".

This code is also used for realize a normal website. See https://fehngarten.de/wetter

# Wetterstation Widget
Widget for Android app "Wetterstation Rhauderfehn"

This widget shows the main weather data like temperature, wind speed and direction, pressure and huminity on the homescreen. The data were updated in real time by a websocket connection to a remote node.js server.

This widget uses java class [com.github.nkzawa.socketio.client](https://github.com/nkzawa/socket.io-client.java) for realizing a websocket connection.
