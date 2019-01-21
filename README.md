# roserocket

Hello Rose Rocket, 
My name is Yakob Asihk. I applied for your Junior Software Engineer Position and was tasked with making this website. 

First make sure the you run npm init --yes to create the node modules and package.json.
Then run npm install -g express.
Then run npm install -g ws.
Then run npm install -g body-parser.
Then run npm install -g fs.

Then you can simply run node roserocket.js to get the app running in your localhost.

The app runs on Port 80 so if you go to localhost:80 you will see the app running. Also I've added a websocket server running on 8080 so make sure that port is open as well. I did this because trucking requires constant updates and you want your drivers and directors to all have the same information, and I though what better way than to have a websocket server.

The front-end I created using simple JQuery and HTML because I do not think React is needed here, since we would only have 1 or 2 components and they would not really work together all that much. The back-end is developed in node. I used express to generate the get and put calls for the REST Api and I used a websocket server to talk to the html page that is sent to the client. 
