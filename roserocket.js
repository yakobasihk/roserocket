const express = require('express'); //express module
const app = express();              //express object 
const fs = require('fs');           //file system module
const ws = require('ws');           //websocket module
const bp = require('body-parser');  //body parser module
app.use(bp.json());
app.use(bp.urlencoded({ extended: false}));

const wss = new ws.Server({port: 8080});   //websocket server runs on port 8080

var driverLocation = {"activeLegID": "FG","legProgress": "33"};   //driver location 

var stops = [{"name": "A","x": 20,"y": 10},                    //stops
			 {"name": "B","x": 20,"y": 20},
			 {"name": "C","x": 25,"y": 30},
			 {"name": "D","x": 25,"y": 80},
			 {"name": "E","x": 30,"y": 100},
			 {"name": "F","x": 35,"y": 80},
			 {"name": "G","x": 35,"y": 30},
			 {"name": "H","x": 40,"y": 20},
			 {"name": "I","x": 40,"y": 10},
			 {"name": "J","x": 35,"y": 15},
			 {"name": "K","x": 25,"y": 15},
			 {"name": "L","x": 20,"y": 10}
			];

var legs = [{"startStop": "A","endStop": "B","speedLimit": 100,"legID": "AB"},       //legs 
			{"startStop": "B","endStop": "C","speedLimit": 60,"legID": "BC"},
			{"startStop": "C","endStop": "D","speedLimit": 80,"legID": "CD"},
			{"startStop": "D","endStop": "E","speedLimit": 120,"legID": "DE"},
			{"startStop": "E","endStop": "F","speedLimit": 40,"legID": "EF"},
			{"startStop": "F","endStop": "G","speedLimit": 40,"legID": "FG"},
			{"startStop": "G","endStop": "H","speedLimit": 100,"legID": "GH"},
			{"startStop": "H","endStop": "I","speedLimit": 100,"legID": "HI"},
			{"startStop": "I","endStop": "J","speedLimit": 50,"legID": "IJ"},
			{"startStop": "J","endStop": "K","speedLimit": 100,"legID": "JK"},
			{"startStop": "K","endStop": "L","speedLimit": 60,"legID":"KL"}
			];

wss.on('connection', (client) => {
	client.send(JSON.stringify({"driverLocation":driverLocation,"stops":stops,"legs":legs}));
})


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};


app.get('/', (req,res) =>{                                   //initial page sent as an html
	fs.readFile('./Challenge.html', (error,data) => {
		res.write(data);
		res.end();
	});
});

app.get('/legs', (req,res) => {
	var html = "<!DOCTYPE html><html><head></head><body><table><tr><th>Start Stop</th><th>End Stop</th><th>Speed Limit</th><th>Leg ID</th></tr>";
	for(var i=0;i<legs.length;i++){
		html = html + "<tr><td>" + legs[i]['startStop'] + "</td>" + "<td>" + legs[i]['endStop'] + "</td>" 
		+ "<td>" + legs[i]['speedLimit'] + "</td>" + "<td>" + legs[i]['legID'] + "</td></tr>";
	}
	html = html + "</table></body></html>";
	res.write(html);
	res.end();
});

app.get('/stops', (req,res) => {
	var html = "<!DOCTYPE html><html><head></head><body><table><tr><th>Name</th><th>X</th><th>Y</th></tr>";
	for(var i=0;i<stops.length;i++){
		html = html + "<tr><td>" + stops[i]['name'] + "</td>" + "<td>" + stops[i]['x'] + "</td>" 
		+ "<td>" + stops[i]['y'] + "</td></tr>";
	}
	html = html + "</table></body></html>";
	res.write(html);
	res.end();
});

app.get('/driver', (req, res) =>{
	var html = "<!DOCTYPE html><html><head></head><body><table><tr><th>Active Leg ID</th><th>Leg Progress</th>" + 
	"</tr><tr><td>" + driverLocation['activeLegID'] + "</td><td>" + driverLocation['legProgress'] + "</td><tr></table></body></html>";
	res.write(html);
	res.end();
})

app.put('*', (req,res) => {
	console.log(req.body);
	if(req.body["activeLegID"]){
		driverLocation = req.body;
	}else{
		driverLocation["legProgress"] = req.body["legProgress"];
	}
	wss.broadcast(JSON.stringify({"driverLocation":driverLocation,"stops":stops,"legs":legs}));
});

app.listen(80, () => console.log("listening on port 80"));
